interface Member { id: string; name: string; email: string; }
interface Payment { id: string; memberId: string; amount: number; }

interface MemberRepository {
    save(member: Member): Promise<void>;
    findById(id: string): Promise<Member | null>;
}

interface PaymentRepository {
    save(payment: Payment): Promise<void>;
    findByMemberId(memberId: string): Promise<Payment[]>;
}

// ─── Fábrica abstracta ───────────────────────────────────────────────────────
interface RepositoryFactory {
    createMemberRepository(): MemberRepository;
    createPaymentRepository(): PaymentRepository;
}

class CreateMember implements MemberRepository {
    private members: Map<string, Member> = new Map();

    async save(member: Member): Promise<void> {
        if (this.members.has(member.id)) {
            throw new Error("The member already exists.");
        }

        this.members.set(member.id, member);
    }

    async findById(id: string): Promise<Member | null> {
        return this.members.get(id) ?? null;
    }
}

class CreatePayment implements PaymentRepository {
    private payments: Payment[] = [];

    async save(payment: Payment): Promise<void> {
        this.payments.push(payment);
    }

    async findByMemberId(memberId: string): Promise<Payment[]> {
        const filteredPaymentsByMemberId = this.payments.filter(payment => payment.memberId == memberId);

        return filteredPaymentsByMemberId;
    }

}

// Familias concretas
class InMemoryRepositoryFactory implements RepositoryFactory {
    createMemberRepository(): MemberRepository { return new CreateMember(); }
    createPaymentRepository(): PaymentRepository { return new CreatePayment(); }
}

class PrismaRepositoryFactory implements RepositoryFactory {
    createMemberRepository(): MemberRepository {
        return {
            async save(member) {
                console.log(`Prisma: saving member ${member.id}`);
            },
            async findById(id) {
                console.log(`Prisma: finding member ${id}`);
                return null;
            }
        };
    }
    createPaymentRepository(): PaymentRepository {
        return {
            async save(payment) {
                console.log(`Prisma: saving payment ${payment.id}`);
            },
            async findByMemberId(memberId) {
                console.log(`Prisma: finding payments for member ${memberId}`);
                return [];
            }
        };
    }
}

class MemberService {
    constructor(private memberRepository: MemberRepository, private paymentRepository: PaymentRepository) { }

    async registerMember(member: Member): Promise<void> {
        await this.memberRepository.save(member);

        const newPayment: Payment = {
            id: "payment-id",
            memberId: member.id,
            amount: 50,
        }

        await this.paymentRepository.save(newPayment);
    }

    async getMemberWithPayments(id: string): Promise<{ member: Member; payments: Payment[] } | null> {
        const member = await this.memberRepository.findById(id);

        if (!member) { return null; }

        const payments = await this.paymentRepository.findByMemberId(id);

        return { member, payments }
    }
}

async function main() {
    const factory = new InMemoryRepositoryFactory();
    // const factory = new PrismaRepositoryFactory(); // ← swap sin tocar nada más

    const memberRepo = factory.createMemberRepository();
    const paymentRepo = factory.createPaymentRepository();

    const service = new MemberService(memberRepo, paymentRepo);

    const member: Member = {
        id: "member-1",
        name: "Cristian",
        email: "cristian@test.com",
    };

    await service.registerMember(member);

    const result = await service.getMemberWithPayments("member-1");
    console.log(result);

    const notFound = await service.getMemberWithPayments("member-999");
    console.log(notFound);

    // Probar duplicado
    try {
        await service.registerMember(member);
    } catch (e) {
        console.log(`Error: ${(e as Error).message}`);
    }
}

main();
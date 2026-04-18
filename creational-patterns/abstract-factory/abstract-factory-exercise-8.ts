// Modelos
interface LoanApplicant {
    id: string;
    name: string;
    monthlyIncome: number;
    creditScore: number;
    hasActiveDebts: boolean;
}

interface LoanRequest {
    applicantId: string;
    amount: number;
    months: number;
}

interface LoanTerms {
    approved: boolean;
    applicantName: string;
    amount: number;
    months: number;
    annualRate: number;
    monthlyPayment: number;
    message: string;
}

// Utils
function calculateMonthlyPayment(amount: number, months: number, annualRate: number): number {
    const annualRateDecimal = annualRate / 100;
    const r = annualRateDecimal / 12;
    const n = months;
    const P = amount;

    return P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// Productos abstractos
interface LoanEvaluator {
    evaluate(applicant: LoanApplicant, request: LoanRequest): boolean;
}

interface LoanTermsGenerator {
    generate(applicant: LoanApplicant, request: LoanRequest, approved: boolean): LoanTerms;
}

// Fábrica abstracta
interface LoanFactory {
    createEvaluator(): LoanEvaluator;
    createTermsGenerator(): LoanTermsGenerator;
}

// Familias concretas
class StandardLoanFactory implements LoanFactory {
    createEvaluator(): LoanEvaluator {
        return {
            evaluate(applicant, request) {
                const { monthlyIncome } = applicant;
                const { amount, months } = request;

                return monthlyIncome >= (amount / months) * 3;
            }
        }
    }

    createTermsGenerator(): LoanTermsGenerator {
        return {
            generate(applicant, request, approved) {
                const applicantName = applicant.name;
                const { amount, months, } = request;
                const annualRate = 12;

                const monthlyPayment = parseFloat(calculateMonthlyPayment(amount, months, annualRate).toFixed(2));

                const loanMessage = approved ? `Loan approved for ${applicantName}. Monthly payment: ${monthlyPayment} for ${months} months at ${annualRate}% annual rate.` : `Loan rejected for ${applicantName}. Insufficient income for the requested amount.`;

                const result: LoanTerms = {
                    approved,
                    applicantName,
                    amount,
                    annualRate,
                    message: loanMessage,
                    monthlyPayment,
                    months
                };

                return result;
            },
        }
    }
};

class PremiumLoanFactory implements LoanFactory {
    createEvaluator(): LoanEvaluator {
        return {
            evaluate(applicant, request) {
                const { creditScore, hasActiveDebts, monthlyIncome } = applicant;
                const { amount, months } = request;

                return monthlyIncome >= (amount / months) * 3 && creditScore >= 700 && hasActiveDebts === false;
            },
        }
    }

    createTermsGenerator(): LoanTermsGenerator {
        return {
            generate(applicant, request, approved) {
                const { name: applicantName, creditScore } = applicant;
                const { amount, months } = request;
                const annualRate = 7;

                const monthlyPayment = parseFloat(calculateMonthlyPayment(amount, months, annualRate).toFixed(2));

                const loanMessage = approved
                    ? `Loan approved for ${applicantName}. Credit score: ${creditScore}. Monthly payment: $${monthlyPayment} for ${months} months at ${annualRate}% annual rate.`
                    : `Loan rejected for ${applicantName}. Requirements not met: credit score >= 700 and no active debts.`;

                const result: LoanTerms = {
                    approved,
                    applicantName,
                    amount,
                    annualRate,
                    message: loanMessage,
                    monthlyPayment,
                    months
                };

                return result;
            },
        }
    }
}

// Cliente
class LoanService {
    constructor(private readonly factory: LoanFactory) { }

    apply(applicant: LoanApplicant, request: LoanRequest): LoanTerms {
        const evaluator = this.factory.createEvaluator();
        const generator = this.factory.createTermsGenerator();

        const approved = evaluator.evaluate(applicant, request);

        return generator.generate(applicant, request, approved);
    }
}


function main() {
    const applicant: LoanApplicant = {
        creditScore: 300,
        hasActiveDebts: false,
        id: 'loan-applicant-1',
        monthlyIncome: 10000,
        name: 'Applicant 1'
    };

    const loanRequest: LoanRequest = {
        amount: 30000,
        applicantId: applicant.id,
        months: 12
    };

    // const factory = new StandardLoanFactory();
    const factory = new PremiumLoanFactory();

    const loanValidatorService = new LoanService(factory);

    console.log(loanValidatorService.apply(applicant, loanRequest));
};

main();
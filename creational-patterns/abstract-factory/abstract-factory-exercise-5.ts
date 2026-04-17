interface Student { id: string; name: string; }
interface Grade { studentId: string; score: number; }

interface ReportCardGenerator {
    generate(student: Student, grade: Grade): string;
}

// Fábrica abstracta
interface ReportCardFactory {
    createGenerator(): ReportCardGenerator;
}

// Familias concretas
class PrimarySchoolFactory implements ReportCardFactory {
    createGenerator(): ReportCardGenerator {
        return {
            generate(student, grade) {
                const name = student.name;
                const score = grade.score;

                return `Alumno: ${name} | Nota: ${score}`;
            }
        }
    }
}

class UniversityFactory implements ReportCardFactory {
    createGenerator(): ReportCardGenerator {
        return {
            generate(student, grade) {
                const name = student.name;
                const score = grade.score;

                const letter = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

                return `Student: ${name} | Grade: ${letter} | Credits: 3`;
            }
        }
    }
}

// Cliente
class ReportCardService {
    constructor(private readonly factory: ReportCardFactory) { }

    printCard(student: Student, grade: Grade): void {
        const reportGenerator = this.factory.createGenerator();

        console.log(reportGenerator.generate(student, grade));
    }
}

function main() {
    const student: Student = { id: 'student-1', name: 'Cristian' };
    const grade: Grade = { studentId: student.id, score: 85 };
    const university = new UniversityFactory();

    const report = new ReportCardService(university);
    report.printCard(student, grade);
}

main();
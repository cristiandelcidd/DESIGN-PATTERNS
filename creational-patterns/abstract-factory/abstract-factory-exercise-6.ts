interface Student { id: string; name: string; email: string; }
interface RawScore { studentId: string; scores: number[]; } // varios parciales

interface GradeCalculator {
    calculate(raw: RawScore): number; // retorna promedio final
}

interface GradeNotifier {
    notify(student: Student, finalGrade: number): void;
}

// Fábrica abstracta
interface EvaluationFactory {
    createCalculator(): GradeCalculator;
    createNotifier(): GradeNotifier;
}

// Familias concretas
class PrimarySchoolEvaluationFactory implements EvaluationFactory {
    createCalculator(): GradeCalculator {
        return {
            calculate(raw: RawScore): number {
                const sum = raw.scores.reduce((acc, score) => acc + score, 0);
                return sum / raw.scores.length;
            }
        }
    }

    createNotifier(): GradeNotifier {
        return {
            notify(student, finalGrade) {
                const name = student.name;
                const grade = finalGrade;

                console.log(`Dear parent of ${name}, the final grade is ${grade}`);
            },
        }
    }
}

class UniversityEvaluationFactory implements EvaluationFactory {
    createCalculator(): GradeCalculator {
        return {
            calculate(raw) {
                const scores = raw.scores;
                const compareNumbers = (a: number, b: number) => a - b;

                const scoresOrdered = [...scores].sort(compareNumbers);
                const scoresFiltered = scoresOrdered.filter((_, index) => index !== 0);
                const sum = scoresFiltered.reduce((acc, score) => acc + score, 0);

                const average = sum / scoresFiltered.length;

                return average;
            },
        }

    }

    createNotifier(): GradeNotifier {
        return {
            notify(student, finalGrade) {
                const name = student.name;
                const email = student.email;
                const grade = finalGrade;

                const letter = grade >= 90 ? "A" : grade >= 80 ? "B" : grade >= 70 ? "C" : grade >= 60 ? "D" : "F";

                console.log(`Dear ${name}, your final grade is ${letter}. Check your email ${email}`);
            },
        }
    }
}

// Cliente
class EvaluationService {
    constructor(private readonly factory: EvaluationFactory) { }

    evaluate(student: Student, raw: RawScore): void {
        const calculator = this.factory.createCalculator();
        const notifier = this.factory.createNotifier();

        const finalGrade = calculator.calculate(raw);

        notifier.notify(student, finalGrade);
    }
}

function main() {
    const student: Student = { id: "STD-001", name: "Cristian", email: "cristian@email.com" };
    const rawScores: RawScore = { studentId: "STD-001", scores: [85, 90, 78, 92] };  // 4 parciales

    const factory = new PrimarySchoolEvaluationFactory();
    // const factory = new UniversityEvaluationFactory();

    const evaluation = new EvaluationService(factory);

    evaluation.evaluate(student, rawScores);
}

main();
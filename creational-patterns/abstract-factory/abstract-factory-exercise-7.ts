// Modelos
interface Applicant {
    id: string;
    name: string;
    age: number;
    hasDiploma: boolean;   // bachillerato
    previousGrades: number[];
}

interface AdmissionResult {
    approved: boolean;
    message: string;
}

// Productos  abstractos
interface AdmissionEvaluator {
    evaluate(applicant: Applicant): boolean;
}

interface AdmissionLetterGenerator {
    generate(applicant: Applicant, approved: boolean): string;
}

// Utils
function average(grades: number[]): number {
    return grades.reduce((acc, curr) => acc + curr, 0) / grades.length;
}

// Fábrica abstracta
interface AdmissionFactory {
    createEvaluator(): AdmissionEvaluator;
    createLetterGenerator(): AdmissionLetterGenerator;
}

// Familias concretas
class PrimaryAdmissionFactory implements AdmissionFactory {
    createEvaluator(): AdmissionEvaluator {
        return {
            evaluate(applicant) {
                const applicantAge = applicant.age;
                const validAge = applicantAge >= 5 && applicantAge <= 12;

                return validAge;
            }
        }
    }

    createLetterGenerator(): AdmissionLetterGenerator {
        return {
            generate(applicant, approved) {
                const name = applicant.name;

                return approved ? `Welcome ${name} to primary school` : `Sorry ${name}, you do not meet the requirements`;
            }
        }
    }
}

class UniversityAdmissionFactory implements AdmissionFactory {
    createEvaluator(): AdmissionEvaluator {
        return {
            evaluate(applicant) {
                const hasDiploma = applicant.hasDiploma === true;
                const grades = applicant.previousGrades;

                return hasDiploma && average(grades) >= 75;
            }
        }
    }

    createLetterGenerator(): AdmissionLetterGenerator {
        return {
            generate(applicant, approved) {
                const name = applicant.name;
                const grades = applicant.previousGrades;
                const gradesAverage = average(grades);

                if (approved) {
                    return `Dear ${name}, your admission score is ${gradesAverage}. You have been accepted`;
                }

                return `Dear ${name}, your admission score is ${gradesAverage}. You have not been accepted`;
            }
        }
    }
}

// Cliente
class AdmissionService {
    constructor(private readonly factory: AdmissionFactory) { }

    process(applicant: Applicant): AdmissionResult {
        const evaluator = this.factory.createEvaluator();
        const approved = evaluator.evaluate(applicant);

        const letterGenerator = this.factory.createLetterGenerator();
        const message = letterGenerator.generate(applicant, approved);

        return { approved, message };
    }
}

function main() {
    const applicant: Applicant = {
        age: 20,
        hasDiploma: true,
        id: 'student-1',
        name: 'Cristian Delcid',
        previousGrades: [76, 60, 90, 85]
    };

    // const factory = new PrimaryAdmissionFactory();
    const factory = new UniversityAdmissionFactory();

    const admission = new AdmissionService(factory);
    console.log(admission.process(applicant));
};

main();
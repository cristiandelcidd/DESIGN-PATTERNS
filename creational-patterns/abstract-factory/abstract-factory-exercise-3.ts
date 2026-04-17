interface MemberReport { memberId: string; name: string; totalPayments: number; }
interface AttendanceReport { memberId: string; sessionsAttended: number; }

interface ReportDataSource {
  getMembers(): Promise<MemberReport[]>;
  getAttendance(): Promise<AttendanceReport[]>;
}

interface ReportExporter {
  export(members: MemberReport[], attendance: AttendanceReport[]): string;
}

// Fábrica abstracta
interface ReportFactory {
  createDataSource(): ReportDataSource;
  createExport(): ReportExporter;
}

// Familias concretas
class AdminReportFactory implements ReportFactory {
  createDataSource(): ReportDataSource {
    return {
      async getMembers() {
        return [
          { memberId: "m-1", name: "Carlos", totalPayments: 10 },
          { memberId: "m-2", name: "Maria", totalPayments: 6 },
        ];
      },
      async getAttendance() {
        return [
          { memberId: "m-1", sessionsAttended: 24 },
          { memberId: "m-2", sessionsAttended: 15 },
        ];
      }
    }
  };

  createExport(): ReportExporter {
    return {
      export: function (members: MemberReport[], attendance: AttendanceReport[]): string {
        return JSON.stringify({ members, attendance });
      }
    }
  }
}

class TrainerReportFactory implements ReportFactory {
  constructor(private readonly trainerId: string) { }

  createDataSource(): ReportDataSource {
    const trainerId = this.trainerId;

    return {
      async getMembers() {
        return [{ memberId: "member-1", name: "Juan", totalPayments: 3 }];
      },
      async getAttendance() {
        console.log(`Fetching attendance for trainer ${trainerId}`);
        return [{ memberId: "member-1", sessionsAttended: 12 }];
      }
    };
  }

  createExport(): ReportExporter {
    return {
      export(members, attendance) {
        const header = "memberId,name,totalPayments";
        const rows = members.map(m => `${m.memberId},${m.name},${m.totalPayments}`);
        return [header, ...rows].join("\n");
      }
    };
  }
}

class ReportService {
  constructor(private readonly factory: ReportFactory) { }

  async generate(): Promise<string> {
    const dataSource = this.factory.createDataSource();
    const exporter = this.factory.createExport();

    const members = await dataSource.getMembers();
    const attendance = await dataSource.getAttendance();

    return exporter.export(members, attendance);
  }
}

async function main() {
  // Admin
  const adminFactory = new AdminReportFactory();
  const adminService = new ReportService(adminFactory);
  const adminReport = await adminService.generate();

  console.log("=== Admin Report ===");
  console.log(adminReport);

  // Trainer
  const trainerFactory = new TrainerReportFactory("trainer-42");
  const trainerService = new ReportService(trainerFactory);
  const trainerReport = await trainerService.generate();

  console.log("\n=== Trainer Report ===");
  console.log(trainerReport);
}

main();
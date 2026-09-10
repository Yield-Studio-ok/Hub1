import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

export interface DailySignup {
  date: string;
  count: number;
}

export interface DashboardMetrics {
  totalUsers: number;
  newUsersLast7Days: number;
  usersPerDay: DailySignup[];
}

@Injectable()
export class MetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const totalUsers = await this.prisma.user.count();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newUsersLast7Days = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    const usersPerDay: DailySignup[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const startOfDay = new Date(d.setHours(0, 0, 0, 0));
      const endOfDay = new Date(d.setHours(23, 59, 59, 999));

      const count = await this.prisma.user.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      usersPerDay.push({
        date: startOfDay.toISOString().split("T")[0],
        count,
      });
    }

    return {
      totalUsers,
      newUsersLast7Days,
      usersPerDay,
    };
  }
}

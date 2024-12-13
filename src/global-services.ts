import { PrismaService } from './prisma/prisma.service';

class GlobalServices {
  private static prismaService: PrismaService;

  static setPrismaService(prisma: PrismaService) {
    this.prismaService = prisma;
  }

  static getPrismaService(): PrismaService {
    if (!this.prismaService) {
      throw new Error('PrismaService no está configurado en GlobalServices');
    }
    return this.prismaService;
  }
}

export { GlobalServices };

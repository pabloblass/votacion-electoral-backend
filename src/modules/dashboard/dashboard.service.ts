import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getVotosPorCandidatos() {
    const votosPorCandidato = await this.prisma.voto.groupBy({
      by: ['id_candidato'],
      _sum: {
        votos: true,
      },
    });

    const candidatos = await this.prisma.candidato.findMany({
      select: {
        id: true,
        nombre: true,
      },
    });

    const stats = votosPorCandidato.map((item) => {
      const candidato = candidatos.find((c) => c.id === item.id_candidato);
      return {
        candidato: candidato ? candidato.nombre : 'Desconocido',
        votos: item._sum.votos || 0,
      };
    });

    return stats;
  }

  async getVotosPorMunicipiosYCandidatos() {
    const municipiosList = await this.prisma.municipio.findMany({
      select: { id: true, descripcion: true },
      where: { activo: true },
      orderBy: { id: 'asc' },
    });

    const candidatosList = await this.prisma.candidato.findMany({
      select: { id: true, nombre: true },
      where: { activo: true },
      orderBy: { id: 'asc' },
    });

    const arrayData = [];

    await Promise.all(
      municipiosList.map(async (municipio) => {
        const arrayVotosPorCandidato = [];

        await Promise.all(
          candidatosList.map(async (candidato) => {
            const sumResult = await this.prisma.voto.aggregate({
              _sum: {
                votos: true,
              },
              where: {
                id_candidato: candidato.id,
                acta: {
                  mesa: {
                    recinto: {
                      id_municipio: municipio.id,
                    },
                  },
                },
              },
            });

            // Extraer la suma, devolviendo 0 si es null
            const votos = sumResult._sum.votos || 0;

            arrayVotosPorCandidato.push({ candidato, votos });
          }),
        );

        arrayData.push({
          municipio,
          data: arrayVotosPorCandidato.sort(
            (a, b) => a.candidato.id - b.candidato.id,
          ),
        });
      }),
    );

    arrayData.sort((a, b) => a.municipio.id - b.municipio.id);

    return arrayData;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getVotosPorCandidatos() {
    // Obtener la lista de candidatos activos
    const candidatosList = await this.prisma.candidato.findMany({
      select: { id: true, nombre: true, color: true },
      where: { activo: true },
      orderBy: { id: 'asc' },
    });

    // Calcular los votos por candidato
    const candidatosVotos = await Promise.all(
      candidatosList.map(async (candidato) => {
        const sumResult = await this.prisma.voto.aggregate({
          _sum: {
            votos: true,
          },
          where: {
            id_candidato: candidato.id,
          },
        });

        return {
          candidato,
          votos: sumResult._sum.votos || 0,
        };
      }),
    );

    // Calcular votos blancos y nulos desde las actas
    const blancosNulos = await this.prisma.acta.aggregate({
      _sum: {
        blancos_m: true,
        blancos_h: true,
        nulos_m: true,
        nulos_h: true,
      },
    });

    // Obtener valores de blancos y nulos
    const blancos =
      (blancosNulos._sum.blancos_m || 0) + (blancosNulos._sum.blancos_h || 0);
    const nulos =
      (blancosNulos._sum.nulos_m || 0) + (blancosNulos._sum.nulos_h || 0);

    // Agregar votos blancos y nulos al resultado final
    const result = [
      ...candidatosVotos,
      {
        candidato: { id: null, nombre: 'Blancos', color: null },
        votos: blancos,
      },
      { candidato: { id: null, nombre: 'Nulos', color: null }, votos: nulos },
    ];

    // Retornar los resultados ordenados por ID de candidato
    return result.sort((a, b) => (a.candidato.id || 0) - (b.candidato.id || 0));
  }

  /*async getVotosPorMunicipiosYCandidatos() {
    const municipiosList = await this.prisma.municipio.findMany({
      select: { id: true, descripcion: true },
      where: { activo: true },
      orderBy: { id: 'asc' },
    });

    const candidatosList = await this.prisma.candidato.findMany({
      select: { id: true, nombre: true, color: true },
      where: { activo: true },
      orderBy: { id: 'asc' },
    });

    const arrayData = [];

    await Promise.all(
      candidatosList.map(async (candidato) => {
        const arrayVotosPorCandidato = [];

        await Promise.all(
          municipiosList.map(async (municipio) => {
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

            arrayVotosPorCandidato.push({ municipio, votos });
          }),
        );

        arrayData.push({
          candidato,
          data: arrayVotosPorCandidato.sort(
            (a, b) => a.municipio.id - b.municipio.id,
          ),
        });
      }),
    );

    arrayData.sort((a, b) => a.candidato.id - b.candidato.id);

    return arrayData;
  }*/

  async getVotosPorMunicipiosYCandidatos() {
    // Obtener la lista de municipios activos
    const municipiosList = await this.prisma.municipio.findMany({
      select: { id: true, descripcion: true },
      where: { activo: true },
      orderBy: { id: 'asc' },
    });

    // Obtener la lista de candidatos activos
    const candidatosList = await this.prisma.candidato.findMany({
      select: { id: true, nombre: true, color: true },
      where: { activo: true },
      orderBy: { id: 'asc' },
    });

    const arrayData = [];

    // Procesar votos por candidato y municipio
    await Promise.all(
      candidatosList.map(async (candidato) => {
        const arrayVotosPorCandidato = await Promise.all(
          municipiosList.map(async (municipio) => {
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

            return { municipio, votos };
          }),
        );

        arrayData.push({
          candidato,
          data: arrayVotosPorCandidato.sort(
            (a, b) => a.municipio.id - b.municipio.id,
          ),
        });
      }),
    );

    // Agregar votos blancos y nulos por municipio
    const votosBlancosNulos = await Promise.all(
      municipiosList.map(async (municipio) => {
        const sumResult = await this.prisma.acta.aggregate({
          _sum: {
            blancos_m: true,
            blancos_h: true,
            nulos_m: true,
            nulos_h: true,
          },
          where: {
            mesa: {
              recinto: {
                id_municipio: municipio.id,
              },
            },
          },
        });

        // Sumar blancos y nulos
        const blancos =
          (sumResult._sum.blancos_m || 0) + (sumResult._sum.blancos_h || 0);
        const nulos =
          (sumResult._sum.nulos_m || 0) + (sumResult._sum.nulos_h || 0);

        return {
          municipio,
          votosBlancos: blancos,
          votosNulos: nulos,
        };
      }),
    );

    // Agregar blancos y nulos como entradas separadas en arrayData
    arrayData.push(
      {
        candidato: { id: null, nombre: 'Blancos', color: null },
        data: votosBlancosNulos.map((item) => ({
          municipio: item.municipio,
          votos: item.votosBlancos,
        })),
      },
      {
        candidato: { id: null, nombre: 'Nulos', color: null },
        data: votosBlancosNulos.map((item) => ({
          municipio: item.municipio,
          votos: item.votosNulos,
        })),
      },
    );

    // Ordenar resultados por ID de candidato
    return arrayData.sort(
      (a, b) => (a.candidato.id || 0) - (b.candidato.id || 0),
    );
  }
}

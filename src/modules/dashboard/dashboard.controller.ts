import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('votos_por_candidatos')
  async getVotosPorCandidatos() {
    return this.dashboardService.getVotosPorCandidatos();
  }

  @Get('votos_por_municipios_y_candidatos')
  async getVotosPorMunicipiosYCandidatos() {
    return this.dashboardService.getVotosPorMunicipiosYCandidatos();
  }
}

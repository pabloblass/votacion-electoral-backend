import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DashboardService } from './dashboard.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DashboardGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  constructor(public readonly dashboardService: DashboardService) {}

  async handleConnection(client: any) {
    console.log('Cliente conectado:', client.id);

    // Enviar estadisticas iniciales al cliente conectado
    const votosPorCandidatos =
      await this.dashboardService.getVotosPorCandidatos();
    const votosPorMunicipiosYCandidatos =
      await this.dashboardService.getVotosPorMunicipiosYCandidatos();

    client.emit('actualizar_votos_por_candidatos', votosPorCandidatos);
    client.emit(
      'actualizar_votos_por_municipios_y_candidatos',
      votosPorMunicipiosYCandidatos,
    );
  }

  handleDisconnect(client: any) {
    console.log('Cliente desconectado:', client.id);
  }

  // Emitir actualizacion de votos por candidatos
  emitUpdateVotosPorCandidatos(data: any) {
    console.log('Actualizar votos por candidatos');
    this.server.emit('actualizar_votos_por_candidatos', data);
  }

  // Emitir actualizacion de votos por municipios y candidatos
  emitUpdateVotosPorMunicipiosYCandidatos(data: any) {
    console.log('Actualizar votos por municipios y candidatos');
    this.server.emit('actualizar_votos_por_municipios_y_candidatos', data);
  }
}

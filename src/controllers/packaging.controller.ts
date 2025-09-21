import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { PackagingService } from '../services/packaging.service';
import { PedidosRequestDto, PedidosResponseDto } from '../dto/packaging.dto';

@ApiTags('packaging')
@Controller('packaging')
export class PackagingController {
  constructor(private readonly packagingService: PackagingService) {}

  @Post('process')
  @ApiOperation({
    summary: 'Processar pedidos de embalagem',
    description:
      'Recebe uma lista de pedidos e retorna a melhor forma de embalá-los usando as caixas disponíveis',
  })
  @ApiBody({
    type: PedidosRequestDto,
    description: 'Lista de pedidos com produtos e suas dimensões',
  })
  @ApiResponse({
    status: 200,
    description: 'Pedidos processados com sucesso',
    type: PedidosResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos',
  })
  public async processarPedidos(
    @Body() pedidosRequest: PedidosRequestDto,
  ): Promise<PedidosResponseDto> {
    const result = await this.packagingService.processarPedidos(pedidosRequest);

    return result;
  }
}

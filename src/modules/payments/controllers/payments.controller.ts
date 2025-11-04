import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from '../services/payments.service';
import { JwtAuthGuard } from 'src/shared/guards';
import { RequestUser } from 'src/shared/decorators';
import { AuthenticatedUser } from 'src/shared/types/routes';
import { CreateCheckoutProDto } from '../dto/create-checkout-pro.dto';
import { CreatePixDto } from '../dto/create-pix.dto';

@ApiTags('Pagamentos')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout-pro')
  @ApiOperation({
    summary: 'Criar sessão Checkout Pro (Mercado Pago)',
    description: 'Cria uma sessão de pagamento usando Checkout Pro com todos os métodos disponíveis (cartão, Pix, boleto, etc.)'
  })
  @ApiResponse({ status: 201, description: 'Sessão criada com sucesso. Retorna initPoint para redirecionar usuário.' })
  @ApiResponse({ status: 404, description: 'Senhas não encontradas' })
  @ApiResponse({ status: 409, description: 'Algumas senhas não estão disponíveis' })
  async createCheckoutPro(
    @Body() dto: CreateCheckoutProDto,
    @RequestUser() user: AuthenticatedUser,
  ) {
    return this.paymentsService.createCheckoutProSession({
      ...dto,
      userId: user.userId,
    });
  }

  @Post('pix')
  @ApiOperation({
    summary: 'Criar pagamento direto via Pix',
    description: 'Cria um pagamento Pix direto sem redirecionamento. Retorna QR Code para pagamento.'
  })
  @ApiResponse({ status: 201, description: 'Pagamento Pix criado. Retorna QR Code e dados do pagamento.' })
  @ApiResponse({ status: 404, description: 'Senhas não encontradas' })
  @ApiResponse({ status: 409, description: 'Algumas senhas não estão disponíveis' })
  async createPix(
    @Body() dto: CreatePixDto,
    @RequestUser() user: AuthenticatedUser,
  ) {
    return this.paymentsService.createPixPayment({
      ...dto,
      userId: user.userId,
      payer: {
        email: dto.email,
        first_name: dto.first_name,
        last_name: dto.last_name,
        identification: dto.doc_type && dto.doc_number ? { type: dto.doc_type, number: dto.doc_number } : undefined,
      },
    });
  }
}

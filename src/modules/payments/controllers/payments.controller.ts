import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { JwtAuthGuard } from 'src/shared/guards';
import { RequestUser } from 'src/shared/decorators';
import { AuthenticatedUser } from 'src/shared/types/routes';
import { CreateCheckoutProDto } from '../dto/create-checkout-pro.dto';
import { CreatePixDto } from '../dto/create-pix.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout-pro')
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

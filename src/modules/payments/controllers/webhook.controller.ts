import { Controller, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { Response, Request } from 'express';

@Controller('webhooks/mp')
export class WebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async handle(@Req() req: Request, @Res() res: Response) {
    try {
      const body: any = req.body;

      const type = body?.type || body?.topic;
      const action = body?.action;

      let paymentId: string | number | undefined =
        body?.data?.id ??
        body?.id ??
        (typeof body?.resource === 'string'
          ? body.resource.split('/').pop()
          : undefined);

      if (
        (type === 'payment' || action?.startsWith('payment.')) &&
        paymentId
      ) {
        await this.paymentsService.processMpPaymentById(paymentId);
      }

      return res.status(200).send('OK');
    } catch (e) {
      return res.status(200).send('OK');
    }
  }
}

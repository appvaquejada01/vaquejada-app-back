import { Controller, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { Response, Request } from 'express';

@Controller('webhooks/mp')
export class WebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async handle(@Req() req: Request, @Res() res: Response) {
    const body: any = req.body ?? {};
    const query: any = req.query ?? {};

    const type = body?.type || body?.topic || query?.type || query?.topic;
    const action = body?.action || query?.action;

    const paymentId =
      body?.data?.id ??
      body?.id ??
      query?.data?.id ??
      query?.id ??
      (typeof body?.resource === 'string'
        ? body.resource.split('/').pop()
        : undefined);

    console.log('[MP WEBHOOK] headers:', req.headers);
    console.log('[MP WEBHOOK] query:', query);
    console.log('[MP WEBHOOK] body:', body);
    console.log('[MP WEBHOOK] parsed:', { type, action, paymentId });

    try {
      if ((type === 'payment' || action?.startsWith('payment.')) && paymentId) {
        await this.paymentsService.processMpPaymentById(paymentId);
      } else {
        console.log('[MP WEBHOOK] ignored: missing paymentId/type');
      }
    } catch (e: any) {
      console.error('[MP WEBHOOK] ERROR processing:', e?.message || e, e?.response?.data);
    }

    return res.status(200).send('OK');
  }
}

import { Controller, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { Response, Request } from 'express';
import { PaymentStatusEnum } from '../enums/payment-status.enum';

const closeStatuses = ['rejected', 'cancelled', 'expired'] as const;
type CloseStatus = typeof closeStatuses[number];

type CloseEnum =
  | PaymentStatusEnum.REJECTED
  | PaymentStatusEnum.CANCELLED
  | PaymentStatusEnum.EXPIRED;

function isCloseStatus(s: string): s is CloseStatus {
  return (closeStatuses as readonly string[]).includes(s);
}

const enumMap: Record<CloseStatus, CloseEnum> = {
  rejected: PaymentStatusEnum.REJECTED,
  cancelled: PaymentStatusEnum.CANCELLED,
  expired:  PaymentStatusEnum.EXPIRED,
};

@Controller('webhooks/mp')
export class WebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async handle(@Req() req: Request, @Res() res: Response) {
    try {
      const body: any = req.body;

      const status = (body?.data?.status || body?.status || body?.action || '')
        .toString()
        .toLowerCase();

      const externalRef: string =
        body?.data?.external_reference || body?.external_reference;

      if (externalRef && status) {
        if (status === 'approved') {
          await this.paymentsService.markApproved(
            externalRef,
            String(body?.data?.id ?? '')
          );
        } else if (isCloseStatus(status)) {
          const mapped: CloseEnum = enumMap[status];
          await this.paymentsService.markClosed(externalRef, mapped);
        }
      }

      return res.status(200).send('OK');
    } catch {
      return res.status(200).send('OK'); 
    }
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ConnectionTypeEnum,
  typeOrmForFeatureToConnection,
} from 'src/utils/database';

import { PaymentsController } from './controllers/payments.controller';
import { WebhookController } from './controllers/webhook.controller';
import { PaymentsService } from './services/payments.service';
import { MercadopagoClientProvider } from './services/mercadopago.client';

import { Payment } from 'src/entities/payment.entity';
import { Subscription, Password } from 'src/entities';

@Module({
  imports: [
    typeOrmForFeatureToConnection([Subscription, Password], ConnectionTypeEnum.DEFAULT),
    TypeOrmModule.forFeature([Payment]),
  ],
  controllers: [PaymentsController, WebhookController],
  providers: [PaymentsService, MercadopagoClientProvider],
  exports: [PaymentsService],
})
export class PaymentsModule {}

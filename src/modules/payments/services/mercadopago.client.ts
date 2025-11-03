import { Provider } from '@nestjs/common';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

export const MP_CLIENT = 'MP_CLIENT';

export const MercadopagoClientProvider: Provider = {
  provide: MP_CLIENT,
  useFactory: () => {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('MP_ACCESS_TOKEN não configurado');
    }
    const cfg = new MercadoPagoConfig({ accessToken });
    return {
      payments: new Payment(cfg),
      preferences: new Preference(cfg),
    };
  },
};

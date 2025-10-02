import {
  Get,
  Param,
  Query,
  Controller,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserRoleEnum } from 'src/modules/user/enums';
import { RequestUser, Roles } from 'src/shared/decorators';
import { AuthenticatedUser } from 'src/shared/types/routes';
import { JwtAuthGuard, RolesGuard } from 'src/shared/guards';

import {
  GetSubscriptionDto,
  ListSubscriptionDto,
  QueryListSubscriptionDto,
} from '../dto';
import {
  SubscriptionGetDocumentation,
  SubscriptionListDocumentation,
} from '../docs';
import { GetSubscriptionService, ListSubscriptionService } from '../services';

@ApiTags('subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionController {
  constructor(
    private readonly listSubscriptionService: ListSubscriptionService,
    private readonly getSubscriptionService: GetSubscriptionService,
  ) {}

  @Get()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER, UserRoleEnum.RUNNER)
  @SubscriptionListDocumentation()
  async findAll(
    @Query() query: QueryListSubscriptionDto,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<ListSubscriptionDto[]> {
    return this.listSubscriptionService.findAll(query, user);
  }

  @Get(':subscriptionId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER, UserRoleEnum.RUNNER)
  @SubscriptionGetDocumentation()
  async findOne(
    @Param('subscriptionId', new ParseUUIDPipe({ version: '4' }))
    subscriptionId: string,
  ): Promise<GetSubscriptionDto> {
    return this.getSubscriptionService.findOne(subscriptionId);
  }
}

import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  Patch,
  Delete,
  UsePipes,
  UseGuards,
  Controller,
  UploadedFile,
  ParseFilePipe,
  ParseUUIDPipe,
  ValidationPipe,
  UseInterceptors,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { UserRoleEnum } from 'src/modules/user/enums';
import { PaginatedResponseDto } from 'src/shared/dto';
import { RequestUser, Roles } from 'src/shared/decorators';
import { AuthenticatedUser } from 'src/shared/types/routes';
import { JwtAuthGuard, RolesGuard } from 'src/shared/guards';

import {
  GetEventService,
  ListEventService,
  UpdateEventService,
  CreateEventService,
  DeleteEventService,
  UpdateEventStatusService,
  UploadEventBannerService,
} from '../services';
import {
  CreateEventDto,
  UpdateEventDto,
  EventResponseDto,
  QueryListEventDto,
  ListEventResponseDto,
  CreateEventResponseDto,
} from '../dto';
import {
  EventCreateDocumentation,
  EventUpdateDocumentation,
  EventDeleteDocumentation,
  EventFindAllDocumentation,
  EventFindOneDocumentation,
  EventChangeStatusDocumentation,
} from '../docs';
import {
  UploadBannerDto,
  UploadBannerResponseDto,
} from '../dto/upload-banner.dto';
import { EventStatusEnum } from '../enums';

@ApiTags('events')
@ApiBearerAuth()
@Controller('events')
export class EventController {
  constructor(
    private readonly getEventService: GetEventService,
    private readonly listEventService: ListEventService,
    private readonly createEventService: CreateEventService,
    private readonly updateEventService: UpdateEventService,
    private readonly deleteEventService: DeleteEventService,
    private readonly updateStatusService: UpdateEventStatusService,
    private readonly uploadEventBannerService: UploadEventBannerService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
  @EventCreateDocumentation()
  async create(
    @Body() createEventDto: CreateEventDto,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<CreateEventResponseDto> {
    return this.createEventService.create(createEventDto, user.userId);
  }

  @Post('with-banner')
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
  @UseInterceptors(FileInterceptor('banner'))
  @UsePipes(new ValidationPipe({ transform: true }))
  @EventCreateDocumentation()
  async createEventWithBanner(
    @Body() createEventDto: CreateEventDto,
    @RequestUser() user: AuthenticatedUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    banner?: Express.Multer.File,
  ): Promise<CreateEventResponseDto> {
    return this.createEventService.create(createEventDto, user.userId, banner);
  }

  @Get()
  @EventFindAllDocumentation()
  async findAll(
    @Query() query: QueryListEventDto,
  ): Promise<PaginatedResponseDto<ListEventResponseDto>> {
    return this.listEventService.list(query);
  }

  @Get(':id')
  @EventFindOneDocumentation()
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<EventResponseDto> {
    return this.getEventService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
  @EventUpdateDocumentation()
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateEventDto: UpdateEventDto,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<EventResponseDto> {
    return this.updateEventService.update(id, updateEventDto, user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
  @EventDeleteDocumentation()
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.deleteEventService.delete(id, user.userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
  @EventChangeStatusDocumentation()
  async changeStatus(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query('status') status: EventStatusEnum,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.updateStatusService.updateStatus(id, status, user.userId);
  }

  @Post('upload-banner')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload de banner para evento',
    type: UploadBannerDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadBanner(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UploadBannerResponseDto> {
    return this.uploadEventBannerService.uploadBanner(file);
  }
}

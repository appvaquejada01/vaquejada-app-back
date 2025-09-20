import {
  IsUUID,
  IsArray,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import { Category, Event, User } from 'src/entities';
import { CategoryNameEnum } from 'src/modules/category/enums';

interface IMappedUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface IMappedCategory {
  id: string;
  name: CategoryNameEnum;
  startAt: string;
  endAt: string;
  observation: string;
  passQuantity: number;
  inscriptionPrice: number;
}

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  startAt: string;

  @IsNotEmpty()
  @IsDateString()
  endAt: string;

  @IsNotEmpty()
  @IsDateString()
  purchaseClosedAt: string;

  @IsNotEmpty()
  @IsNumber()
  inscriptionPrice: number;

  @IsNotEmpty()
  @IsNumber()
  inscriptionLimit: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsArray()
  @IsUUID('4', { each: true })
  judgeIds: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  speakerIds: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  runnerIds: string[];

  @IsNotEmpty()
  @IsUUID('4')
  organizerId: string;

  @IsArray()
  @IsString({ each: true })
  categories: string[];
}

export class CreateEventResponseDto {
  id: string;
  name: string;
  startAt: string;
  endAt: string;
  purchaseClosedAt: string;
  inscriptionPrice: number;
  inscriptionLimit: number;
  description: string;
  address: string;
  city: string;
  state: string;
  organizerId: string;
  judges: IMappedUser[];
  speakers: IMappedUser[];
  runners: IMappedUser[];
  categories: IMappedCategory[];

  static fromEntity(
    event: Event,
    judges: User[],
    speakers: User[],
    runners: User[],
    categories: Category[],
  ): CreateEventResponseDto | PromiseLike<CreateEventResponseDto> {
    const dto = new CreateEventResponseDto();

    dto.id = event.id;
    dto.name = event.name;
    dto.city = event.city;
    dto.state = event.state;
    dto.address = event.address;
    dto.startAt = event.startAt;
    dto.endAt = event.endAt;
    dto.organizerId = event.organizerId;
    dto.description = event.description;
    dto.purchaseClosedAt = event.purchaseClosedAt;
    dto.inscriptionPrice = event.inscriptionPrice;
    dto.inscriptionLimit = event.inscriptionLimit;
    dto.judges = judges?.map((judge) => this.mapUser(judge));
    dto.speakers = speakers?.map((speaker) => this.mapUser(speaker));
    dto.runners = runners?.map((runner) => this.mapUser(runner));
    dto.categories = categories?.map((category) => this.mapCategory(category));

    return dto;
  }

  private static mapUser(user: User): IMappedUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  private static mapCategory(category: Category): IMappedCategory {
    return {
      id: category.id,
      name: category.name,
      startAt: category.startAt,
      endAt: category.endAt,
      observation: category.observation,
      passQuantity: category.passQuantity,
      inscriptionPrice: category.inscriptionPrice,
    };
  }
}

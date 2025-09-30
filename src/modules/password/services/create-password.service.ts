import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Category, Event, Password } from 'src/entities';

import { PasswordStatusEnum } from '../enums';
import { CreatePasswordDto, PasswordResponseDto } from '../dto';

@Injectable()
export class CreatePasswordService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Password)
    private passwordRepository: Repository<Password>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  public async create(
    dto: CreatePasswordDto,
    userId: string,
  ): Promise<PasswordResponseDto[]> {
    this.validateDto(dto);

    await this.validateEventAndCategory(dto);

    const passwordsNumbers = this.generatePasswordNumbers(dto);

    await this.checkExistingPasswords(dto, passwordsNumbers);

    // Criar todas as senhas de uma vez
    const createdPasswords = await this.createPasswordsBatch(
      dto,
      passwordsNumbers,
      userId,
    );

    return createdPasswords.map(PasswordResponseDto.fromEntity);
  }

  private validateDto(dto: CreatePasswordDto): void {
    if (dto.finalPassword < dto.initialPassword) {
      throw new BadRequestException(
        'finalPassword deve ser maior ou igual a initialPassword',
      );
    }

    if (dto.finalPassword - dto.initialPassword > 500) {
      throw new BadRequestException(
        'Não é possível criar mais de 500 senhas de uma vez',
      );
    }

    if (dto.price <= 0) {
      throw new BadRequestException('O preço deve ser maior que zero');
    }
  }

  private async validateEventAndCategory(
    dto: CreatePasswordDto,
  ): Promise<void> {
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .where('event.id = :eventId', { eventId: dto.eventId })
      .getOne();

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id = :categoryId', { categoryId: dto.categoryId })
      .getOne();

    if (!category) {
      throw new NotFoundException(
        'Categoria não encontrada ou não pertence a este evento',
      );
    }
  }

  private generatePasswordNumbers(dto: CreatePasswordDto): string[] {
    const passwordsNumbers: string[] = [];

    for (let i = dto.initialPassword; i <= dto.finalPassword; i++) {
      const number = i.toString();
      passwordsNumbers.push(number);
    }

    return passwordsNumbers;
  }

  private async checkExistingPasswords(
    dto: CreatePasswordDto,
    passwordsNumbers: string[],
  ): Promise<void> {
    const existingPasswords = await this.passwordRepository
      .createQueryBuilder('password')
      .select('password.number')
      .where('password.eventId = :eventId', { eventId: dto.eventId })
      .andWhere('password.categoryId = :categoryId', {
        categoryId: dto.categoryId,
      })
      .andWhere('password.number IN (:...numbers)', {
        numbers: passwordsNumbers,
      })
      .getMany();

    if (existingPasswords.length > 0) {
      const existingNumbers = existingPasswords.map((p) => p.number);
      throw new ConflictException(
        `Já existem senhas com esses números para esta categoria: ${existingNumbers.join(', ')}`,
      );
    }
  }

  private async createPasswordsBatch(
    dto: CreatePasswordDto,
    passwordsNumbers: string[],
    userId: string,
  ): Promise<Password[]> {
    const passwordEntities = passwordsNumbers.map((number) => {
      return this.passwordRepository.create({
        eventId: dto.eventId,
        categoryId: dto.categoryId,
        number: number,
        price: dto.price,
        status: PasswordStatusEnum.AVAILABLE,
        createdAt: new Date(),
        createdUserId: userId,
        createdFunctionName: 'CreatePasswordService.create',
      });
    });

    return await this.passwordRepository.save(passwordEntities);
  }

  // Método auxiliar para buscar senhas de uma categoria
  public async findPasswordsByCategory(
    eventId: string,
    categoryId: string,
  ): Promise<PasswordResponseDto[]> {
    const passwords = await this.passwordRepository.find({
      where: {
        eventId,
        categoryId,
      },
      order: {
        number: 'ASC',
      },
    });

    return passwords.map(PasswordResponseDto.fromEntity);
  }

  // Método para contar senhas por status
  public async getPasswordStats(
    eventId: string,
    categoryId: string,
  ): Promise<{
    total: number;
    available: number;
    used: number;
    reserved: number;
  }> {
    const passwords = await this.passwordRepository.find({
      where: { eventId, categoryId },
    });

    return {
      total: passwords.length,
      available: passwords.filter(
        (p) => p.status === PasswordStatusEnum.AVAILABLE,
      ).length,
      used: passwords.filter((p) => p.status === PasswordStatusEnum.USED)
        .length,
      reserved: passwords.filter(
        (p) => p.status === PasswordStatusEnum.RESERVED,
      ).length,
    };
  }
}

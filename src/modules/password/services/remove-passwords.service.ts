import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Password } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class RemovePasswordsService {
  constructor(
    @InjectRepository(Password)
    private readonly passwordRepository: Repository<Password>,
  ) {}

  async remove(eventId: string, categoryId: string): Promise<void> {
    const passwords = await this.passwordRepository.find({
      where: {
        event: { id: eventId },
        category: { id: categoryId },
      },
    });

    if (passwords.length > 0) {
      await this.passwordRepository.remove(passwords);
    }
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { Repositories } from 'libs/_common/database/database-repository.enum';
import { IRepository } from 'libs/_common/database/repository.interface';
import { CreatMessageDto } from './message/dto/craete-message.dto';
import { Message } from './message/entity/message.entity';

@Injectable()
export class PresenceService {
  constructor(
    @Inject(Repositories.MessagesRepository)
    private readonly messageRepo: IRepository<Message>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getAll() {
    return await this.messageRepo.findAll();
  }

  async create(input: CreatMessageDto) {
    const { friendId, message } = input;
    return await this.messageRepo.createOne({
      // userID: '54498448-b3ab-4fd6-9261-a591e7e64356',
      friendId,
      message,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly dataSource: DataSource,
    ) {}

    async createUser(userDto: Pick<User, 'userId' | 'username' | 'name'>): Promise<User> {
        const isUserExist: boolean = await this.isUserExist(userDto.userId);
        if (!isUserExist) {
            return this.userRepository.save(userDto);
        }
    }

    private async isUserExist(userId: number): Promise<boolean> {
        return this.userRepository.exist({ where: { userId } });
    }
}

/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { User } from './user';
import userRoles from './../shared/security/roles_usuario';

@Injectable()
export class UserService {
    private users: User[] = [
        new User(1, "admin", "admin", userRoles.ADMIN),
        new User(2, "lectorCompleto", "lectorCompleto", userRoles.FULL_READER),
        new User(3, "lectorLimitado", "lectorLimitado", userRoles.LIMITED_READER),
        new User(4, "escritor", "escritor", userRoles.WRITER),
        new User(5, "eliminador", "eliminador", userRoles.DELETE),
        
    ];

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
}
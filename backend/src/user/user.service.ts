import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  /**
   * Register a new user in the system with an encrypted password.
   * Check if the email already exists before creating an account.
   * The password is hashed using scrypt with a random salt for security.
   * @param createUserDto The data for the new user to be created.
   * @returns The data for the created user (without a password for security).
   * @throws ConflictException If the email is already in use.
   */
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const userAlreadyRegistered = await this.findOneByEmail(
      createUserDto.email,
    );

    if (userAlreadyRegistered) {
      throw new HttpException(
        `Email ${createUserDto.email} already registered`,
        HttpStatus.CONFLICT,
      );
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;
    const saltAndHash = `${salt}.${hash.toString('hex')}`;

    const dbUser = this.userRepository.create({
      ...createUserDto,
      password: saltAndHash,
    });

    const savedUser = await this.userRepository.save(dbUser);
    console.log('Signed up', savedUser);
    const { password: _, ...result } = savedUser;

    return result;
  }
  /**
   * Searches for a specific user by their unique email.
   * Uses email search as an alternative to the numeric ID.
   * @param email The unique email to search for in the system.
   * @returns A promise that resolves to the User entity of the found user or null if it does not exist.
   */
  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return undefined;
    }
    return user;
  }
}

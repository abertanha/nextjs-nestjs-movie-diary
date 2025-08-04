import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { EmailService } from '../email/email.service';
import { SendConfirmationDto } from '../email/dto/confirmation.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}
  /**
   * Registers a new user in the system and sends a verification email.
   * - Checks if the email already exists to prevent duplicates.
   * - Hashes the password using scrypt with a random salt for security.
   * - Generates a unique email verification token.
   * - Saves the new user with an 'unverified' status.
   * - Calls the EmailService to send the confirmation link.
   * @param createUserDto The data for the new user to be created.
   * @returns A promise that resolves to the created user's data (without the password).
   * @throws HttpException (Conflict) If the email is already in use.
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

    const emailVerificationToken = randomBytes(32).toString('hex');

    const dbUser = this.userRepository.create({
      ...createUserDto,
      password: saltAndHash,
      emailVerificationToken,
    });

    const savedUser = await this.userRepository.save(dbUser);

    try {
      const confirmationDto: SendConfirmationDto = {
        email: savedUser.email,
        token: savedUser.emailVerificationToken,
      };
      await this.emailService.sendUserConfirmation(confirmationDto);
    } catch (error) {
      console.error('Failed to send the confirmation email:', error);
    }

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
  /**
   * Finds a user by their email verification token and activates the account.
   * On success, the user's 'isEmailVerified' flag is set to true,
   * and the verification token is cleared to prevent reuse.
   * @param token The email verification token to validate.
   * @returns A promise that resolves to the updated User entity.
   * @throws NotFoundException if no user is found with the provided token.
   */
  async activateUserAccount(token: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new HttpException(
        'Invalid or expired verification Token.',
        HttpStatus.NOT_FOUND,
      );
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = '';

    return this.userRepository.save(user);
  }
}

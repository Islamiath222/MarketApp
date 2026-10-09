import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/user.entity';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import { AccountStatus } from '@marketapp/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    // Normalize
    const email = dto.email.toLowerCase().trim();
    const phone = this.normalizePhone(dto.phone);

    // Uniqueness checks
    const existing = await this.userRepo.findOne({
      where: [{ email }, { phone }],
    });
    if (existing) {
      if (existing.email === email) {
        throw new ConflictException('An account with this email already exists');
      }
      throw new ConflictException(
        'An account with this phone number already exists'
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = this.userRepo.create({
      fullName: dto.fullName,
      email,
      phone,
      passwordHash,
      accountStatus: AccountStatus.PENDING_VERIFICATION,
    });

    await this.userRepo.save(user);

    // TODO: send email verification OTP
    // TODO: send phone OTP

    const { passwordHash: _, ...safeUser } = user;
    return {
      data: { user: safeUser },
      success: true,
      message: 'Account created. Please verify your email and phone number.',
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.accountStatus === AccountStatus.SUSPENDED) {
      throw new UnauthorizedException(
        'Your account has been suspended. Please contact support.'
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await this.userRepo.save(user);

    const payload = { sub: user.id, email: user.email, roles: user.roles };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    const { passwordHash: _, ...safeUser } = user;
    return {
      data: { accessToken, refreshToken, user: safeUser },
      success: true,
    };
  }

  async verifyEmail(token: string) {
    // TODO: implement token verification against store
    return { success: true, message: 'Email verified successfully' };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newAccessToken = this.jwtService.sign({
        sub: payload.sub,
        email: payload.email,
        roles: payload.roles,
      });
      return { data: { accessToken: newAccessToken }, success: true };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    // TODO: add refresh token to blocklist
    return { success: true };
  }

  async validateUser(email: string, password: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  private normalizePhone(phone: string): string {
    // Normalize to E.164 format for Nigerian numbers
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('234')) return `+${cleaned}`;
    if (cleaned.startsWith('0')) return `+234${cleaned.slice(1)}`;
    return `+234${cleaned}`;
  }
}

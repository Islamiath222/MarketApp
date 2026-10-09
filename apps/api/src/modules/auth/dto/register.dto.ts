import { IsEmail, IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Amaka Okonkwo' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'amaka@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+2348012345678', description: 'Nigerian phone number' })
  @IsString()
  @Matches(/^(\+234|0)[789]\d{9}$/, {
    message: 'Phone must be a valid Nigerian number (e.g. +2348012345678 or 08012345678)',
  })
  phone: string;

  @ApiProperty({ example: 'SecureP@ss123', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}

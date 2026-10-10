import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'amaka@example.com or +2348012345678' })
  @IsString()
  @IsNotEmpty({ message: 'Email or phone number is required' })
  email: string;

  @ApiProperty({ example: 'SecureP@ss123' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

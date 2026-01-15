import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserTypeDTO {
  @IsNotEmpty()
  @IsString()
  type: string;
}

export class UpdateUserTypeDto {
  @IsNotEmpty()
  @IsString()
  type: string;
}

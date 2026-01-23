import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTalentDTO {
  @IsNotEmpty()
  @IsString()
  talent: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class UpdateTalentDTO {
  @IsNotEmpty()
  @IsString()
  talent: string;
}

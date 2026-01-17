import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBookingDTO {
  @IsNotEmpty()
  @IsString()
  talentId: string;

  @IsNotEmpty()
  @IsString()
  start: string;

  @IsNotEmpty()
  @IsString()
  end: string;
}

export class UpdateBookingDto {
  @IsNotEmpty()
  @IsString()
  start: string;

  @IsNotEmpty()
  @IsString()
  end: string;
}

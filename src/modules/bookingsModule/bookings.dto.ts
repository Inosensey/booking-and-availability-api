import {
  IsString,
  IsNotEmpty,
  IsISO8601,
  ValidateIf,
  IsIn,
} from 'class-validator';

export class CreateBookingDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  talentId: string;

  @IsISO8601()
  @IsNotEmpty()
  @IsString()
  start: string;

  @IsISO8601()
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o: CreateBookingDTO) => new Date(o.start) < new Date(o.end))
  end: string;
}

export class UpdateStatusBookingDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['accept', 'reject'])
  action: string;
}

export class RescheduleBookingDto {
  @IsISO8601()
  @IsNotEmpty()
  @IsString()
  start: string;

  @IsISO8601()
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o: CreateBookingDTO) => new Date(o.start) < new Date(o.end))
  end: string;
}

import { IsUrl } from 'class-validator';

export class CreateAppDto {
  @IsUrl()
  url: string;
  name: string;
}

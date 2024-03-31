import { IsNotEmpty, IsString } from 'class-validator';
import { isUnique } from 'src/validators/unique-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @isUnique({ tableName: 'category', column: 'name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  image: string;
}

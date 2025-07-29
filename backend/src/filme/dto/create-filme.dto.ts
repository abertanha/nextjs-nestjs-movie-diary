import {
  Length,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  Min,
  Max,
} from 'class-validator';

export class CreateFilmeDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsNotEmpty()
  @IsString()
  diretor: string;

  @IsNumber()
  @IsNotEmpty()
  ano: number;

  @IsNotEmpty()
  @IsString()
  genero: string;

  @IsNumber()
  @IsNotEmpty()
  duracao: number;

  @IsString()
  @IsNotEmpty()
  elenco: string;

  @IsString()
  @IsNotEmpty()
  classificacao: string;

  @IsString()
  @IsNotEmpty()
  @Length(100)
  sinopse: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  notaUsuario: number;

  @IsOptional()
  @IsUrl()
  posterUrl?: string | null;

  @IsOptional()
  @IsUrl()
  backdropUrl?: string | null;
}

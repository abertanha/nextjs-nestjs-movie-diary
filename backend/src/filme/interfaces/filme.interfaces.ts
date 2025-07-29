import { IsUUID } from 'class-validator';

export class FilmeRouteParameters {
  @IsUUID()
  id!: string;
}

export interface FilmeDetalhado {
  titulo: string;
  diretor: string | null;
  ano: string;
  genero: string | null;
  duracao: string | null;
  elenco: string | null;
  sinopse: string | null;
  classificacao: string;
  popularidade: number;
  posterUrl: string | null;
  backdropUrl: string | null;
}

export interface FilmeApiResponse {
  data: {
    results: FilmeDetalhado[];
  };
}

export interface FilmeDetails {
  genres: string[];
  runtime: number;
  posterPath: string | null;
  backdropPath: string | null;
}

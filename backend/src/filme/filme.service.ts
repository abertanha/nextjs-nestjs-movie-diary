import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreditResult,
  TMDBCreditsResponse,
  TMDBMovie,
  TMDBMovieDetailsResponse,
} from './interfaces/tmdb.interfaces';
import {
  FilmeDetalhado,
  FilmeApiResponse,
  FilmeDetails,
} from './interfaces/filme.interfaces.js';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Filme } from './entities/filme.entity';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FilmeService {
  private readonly API_KEY: string | undefined;
  constructor(
    @InjectRepository(Filme)
    private readonly filmeRepository: Repository<Filme>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.API_KEY = this.configService.get<string>('API_KEY');
    if (!this.API_KEY) {
      console.error('API_KEY do TMDB não foi encontrada!');
      throw new HttpException(
        'TMDB API Key não encontrada',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createFilmeDto: CreateFilmeDto): Promise<Filme> {
    const novoFilme = this.filmeRepository.create(createFilmeDto);
    return await this.filmeRepository.save(novoFilme);
  }

  async findAll(): Promise<Filme[]> {
    return await this.filmeRepository.find();
  }

  async findOne(id: string): Promise<Filme> {
    const filmeEncontrado = await this.filmeRepository.findOneBy({ id });

    if (!filmeEncontrado) {
      throw new HttpException(
        `Filme com id: ${id} não encontrado!`,
        HttpStatus.NOT_FOUND,
      );
    }

    return filmeEncontrado;
  }

  async update(id: string, dadosParaAtualizar: UpdateFilmeDto): Promise<Filme> {
    await this.filmeRepository.update(id, dadosParaAtualizar);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.filmeRepository.delete(id);

    if (result.affected === 0) {
      throw new HttpException(
        `Filme com id ${id} não encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
  async searchByTitleApi(query: string): Promise<FilmeApiResponse> {
    // url para chamada da api
    console.log(`Chamada a API TMDB para gerar uma sugestões com "${query}"`);
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${this.API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR&page=1`;
    const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/'; // TO DO REVER ESSAS TRES CONSTANTES
    const POSTER_SIZE = 'w500';
    const BACKDROP_SIZE = 'w1280';

    let apiResponse: { data: { results: TMDBMovie[] } };
    try {
      apiResponse = await firstValueFrom(
        this.httpService.get<{ results: TMDBMovie[] }>(url),
      );
    } catch (error) {
      console.error(
        `Erro ao buscar filmes no TMDB (query: ${query}):`,
        error.response?.data || error.message,
      );
      throw new HttpException(
        `Falha ao buscar filmes no TMDB`,
        HttpStatus.FAILED_DEPENDENCY,
      );
    }
    const filmesDetalhadosPromises: Promise<FilmeDetalhado | null>[] =
      apiResponse.data.results.slice(0, 10).map(async (filme: TMDBMovie) => {
        const [details, credits]: [FilmeDetails, CreditResult] =
          await Promise.all([
            this.getMovieDetails(filme.id.toString()),
            this.searchForDetailsApi(filme.id.toString()),
          ]);

        const posterUrl: string | null = details.posterPath
          ? `${TMDB_IMAGE_BASE_URL}${POSTER_SIZE}${details.posterPath}`
          : null;
        const backdropUrl: string | null = details.backdropPath
          ? `${TMDB_IMAGE_BASE_URL}${BACKDROP_SIZE}${details.backdropPath}`
          : null;

        const diretoresNomes: string[] = credits.directors.map((d) => d.name);
        const elencoNomes: string[] = credits.actors.map((a) => a.name);

        const filmeDetalhadoResultante: FilmeDetalhado = {
          titulo: filme.title,
          diretor: diretoresNomes.length > 0 ? diretoresNomes.join(', ') : null,
          ano: filme.release_date?.split('-')[0] || 'N/A',
          genero: details.genres.join(', ') || null,
          duracao: details.runtime ? `${details.runtime} minutos` : null,
          elenco: elencoNomes.length > 0 ? elencoNomes.join(', ') : null,
          sinopse: filme.overview || null,
          classificacao: filme.adult ? '18+' : 'Livre/Outra',
          popularidade: filme.popularity,
          posterUrl: posterUrl,
          backdropUrl: backdropUrl,
        };

        return filmeDetalhadoResultante;
      });

    const filmesCompletosComNulls = await Promise.all(filmesDetalhadosPromises);
    const filmesCompletos = filmesCompletosComNulls.filter(
      (filme): filme is FilmeDetalhado => filme !== null,
    );

    const resultadosOrdenados = filmesCompletos.sort(
      (a, b) => (b.popularidade || 0) - (a.popularidade || 0), // Lida com popularidade nula/undefined
    );
    return { data: { results: resultadosOrdenados } };
  }

  async searchByTitle(titulo: string): Promise<Filme[]> {
    return this.filmeRepository
      .createQueryBuilder('filme')
      .where('LOWER(filme.titulo) LIKE LOWER(:titulo)', {
        titulo: `%${titulo}%`,
      })
      .getMany();
  }
  private async searchForDetailsApi(movieId: string) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${this.API_KEY}&language=pt-BR`;

    const apiResponse = await firstValueFrom(
      this.httpService.get<TMDBCreditsResponse>(url),
    );

    const topActors = apiResponse.data.cast
      //.sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3)
      .map((person) => ({
        name: person.name,
        popularity: person.popularity,
      }));

    const directors = apiResponse.data.crew
      .filter((member) => member.known_for_department === 'Directing')
      .slice(0, 1)
      .sort((a, b) => b.popularity - a.popularity)
      .map((director) => ({
        name: director.name,
      }));

    return { actors: topActors, directors: directors };
  }
  private async getMovieDetails(movieId: string): Promise<FilmeDetails> {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.API_KEY}&language=pt-BR`;
    try {
      const apiResponse = await firstValueFrom(
        this.httpService.get<TMDBMovieDetailsResponse>(url),
      );

      const genres = apiResponse.data.genres.map((genre) => genre.name);
      const runtime = apiResponse.data.runtime;
      const posterPath = apiResponse.data.poster_path;
      const backdropPath = apiResponse.data.backdrop_path;

      return { genres, runtime, posterPath, backdropPath };
    } catch (error) {
      console.error(
        `Erro ao buscar detalhes completos do filme TMDB (id: ${movieId}):`,
        error.response?.data || error.message,
      );
      throw new HttpException(
        `Falha ao buscar detalhes do filme ${movieId} no TMDB`,
        HttpStatus.FAILED_DEPENDENCY,
      );
    }
  }
}

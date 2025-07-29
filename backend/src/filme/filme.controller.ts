import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FilmeService } from './filme.service';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { FilmeRouteParameters } from './interfaces/filme.interfaces';
import { UpdateFilmeDto } from './dto/update-filme.dto';
import { Filme } from './entities/filme.entity';

@Controller('filme')
export class FilmeController {
  constructor(private readonly filmeService: FilmeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFilmeDto: CreateFilmeDto): Promise<Filme> {
    return this.filmeService.create(createFilmeDto);
  }

  @Get()
  async findAll(): Promise<Filme[]> {
    return this.filmeService.findAll();
  }
  @Get('/tmdb/movie')
  async searchByTitleApi(@Query('titulo') titulo: string) {
    return this.filmeService.searchByTitleApi(titulo);
  }
  @Get('/:id')
  async findOne(@Param() params: FilmeRouteParameters): Promise<Filme> {
    return this.filmeService.findOne(params.id);
  }
  @Get()
  async searchByTitle(@Query('q') titulo: string): Promise<Filme[]> {
    return this.filmeService.searchByTitle(titulo);
  }

  @Patch('/:id')
  async update(
    @Param() params: FilmeRouteParameters,
    @Body() dadosAtualizar: UpdateFilmeDto,
  ) {
    return this.filmeService.update(params.id, dadosAtualizar);
  }

  @Delete('/:id')
  async remove(@Param() params: FilmeRouteParameters): Promise<void> {
    return this.filmeService.remove(params.id);
  }
}

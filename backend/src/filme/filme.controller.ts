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
  UseGuards,
} from '@nestjs/common';
import { FilmeService } from './filme.service';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { FilmeRouteParameters } from './interfaces/filme.interfaces';
import { UpdateFilmeDto } from './dto/update-filme.dto';
import { Filme } from './entities/filme.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('filme')
@UseGuards(JwtAuthGuard)
export class FilmeController {
  constructor(private readonly filmeService: FilmeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createFilmeDto: CreateFilmeDto,
    @GetUser() user: User,
  ): Promise<Filme> {
    return this.filmeService.create(createFilmeDto, user);
  }

  @Get()
  async findAll(@GetUser() user: User): Promise<Filme[]> {
    return this.filmeService.findAll(user);
  }
  @Get('/tmdb/movie')
  async searchByTitleApi(@Query('titulo') titulo: string) {
    return this.filmeService.searchByTitleApi(titulo);
  }
  @Get('/:id')
  async findOne(
    @Param() params: FilmeRouteParameters,
    @GetUser() user: User,
  ): Promise<Filme> {
    return this.filmeService.findOne(params.id, user);
  }
  @Get()
  async searchByTitle(@Query('q') titulo: string): Promise<Filme[]> {
    return this.filmeService.searchByTitle(titulo);
  }

  @Patch('/:id')
  async update(
    @Param() params: FilmeRouteParameters,
    @Body() updateData: UpdateFilmeDto,
    @GetUser() user: User,
  ) {
    return this.filmeService.update(params.id, updateData, user);
  }

  @Delete('/:id')
  async remove(
    @Param() params: FilmeRouteParameters,
    @GetUser() user: User,
  ): Promise<void> {
    return this.filmeService.remove(params.id, user);
  }
}

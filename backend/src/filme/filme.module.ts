import { Module } from '@nestjs/common';
import { FilmeService } from './filme.service';
import { FilmeController } from './filme.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Filme } from './entities/filme.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Filme]), HttpModule],
  controllers: [FilmeController],
  providers: [FilmeService, ConfigService],
})
export class FilmeModule {}

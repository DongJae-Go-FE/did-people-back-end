import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateChurchgoerDto } from './dto/create-churchgoer.dto';
import { ChurchgoerQueryDto } from './dto/churchgoer-query.dto';
import { UpdateChurchgoerDto } from './dto/update-churchgoer.dto';
import { ChurchgoersService } from './churchgoers.service';
import type { RequestUser } from './churchgoers.service';

@ApiTags('churchgoers')
@ApiBearerAuth()
@Controller('churchgoers')
export class ChurchgoersController {
  constructor(private readonly churchgoersService: ChurchgoersService) {}

  @Get()
  @ApiOperation({ summary: '본당 인원 목록 조회' })
  findAll(
    @Query() query: ChurchgoerQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.churchgoersService.findAll(query, user);
  }

  @Get(':id')
  @ApiOperation({ summary: '본당 인원 단건 조회' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: RequestUser,
  ) {
    return this.churchgoersService.findOne(id, user);
  }

  @Post()
  @ApiOperation({ summary: '본당 인원 등록' })
  create(@Body() dto: CreateChurchgoerDto, @CurrentUser() user: RequestUser) {
    return this.churchgoersService.create(dto, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: '본당 인원 수정' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChurchgoerDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.churchgoersService.update(id, dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: '본당 인원 삭제' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: RequestUser,
  ) {
    return this.churchgoersService.remove(id, user);
  }
}

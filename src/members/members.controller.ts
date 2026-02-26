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
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateMemberDto } from './dto/create-member.dto';
import { MemberQueryDto } from './dto/member-query.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersService } from './members.service';
import type { RequestUser } from './members.service';

@ApiTags('members')
@ApiBearerAuth()
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @ApiOperation({ summary: '목록 조회' })
  findAll(@Query() query: MemberQueryDto, @CurrentUser() user: RequestUser) {
    return this.membersService.findAll(query, user);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: '단건 조회' })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: RequestUser) {
    return this.membersService.findOne(id, user);
  }

  @Post()
  @ApiOperation({ summary: '등록' })
  create(@Body() dto: CreateMemberDto, @CurrentUser() user: RequestUser) {
    return this.membersService.create(dto, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: '수정' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMemberDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.membersService.update(id, dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: '삭제' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: RequestUser) {
    return this.membersService.remove(id, user);
  }
}

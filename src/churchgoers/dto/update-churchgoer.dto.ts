import { PartialType } from '@nestjs/swagger';
import { CreateChurchgoerDto } from './create-churchgoer.dto';

export class UpdateChurchgoerDto extends PartialType(CreateChurchgoerDto) {}

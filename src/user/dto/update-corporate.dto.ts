import { CreateCorporateDto } from './create-corporate.dto';

import { PartialType } from '@nestjs/mapped-types';

export class UpdateCorporateDto extends PartialType(CreateCorporateDto) {}

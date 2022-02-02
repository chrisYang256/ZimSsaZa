import { PickType } from '@nestjs/swagger';
import { Reviews } from 'src/entities/Reviews';

export class CreateReviewDto extends PickType(Reviews, ['content', 'star']) {}

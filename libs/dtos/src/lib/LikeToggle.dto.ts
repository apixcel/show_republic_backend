import { IsMongoId, IsIn, IsString, IsNotEmpty } from 'class-validator';

export class ToggleLikeDto {
    @IsMongoId({ message: 'Invalid postId' })
    @IsString()
    @IsNotEmpty()
    postId!: string;

    @IsIn(['like', 'dislike'], { message: 'Action must be either "like" or "dislike"' })
    action!: 'like' | 'dislike';
}

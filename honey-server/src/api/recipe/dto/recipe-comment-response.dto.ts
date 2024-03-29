import { RecipeComment, User } from '@prisma/client';
import { AuthUserDto } from '~/api/auth/dto/auth-user.dto';

type RecipeCommentRelation = RecipeComment & {
  user: User;
  mentionUser: User;
};

export class RecipeCommentResponseDto {
  id: number;
  parentCommentId: number | null;
  content: string;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
  user: AuthUserDto;
  mentionUser: AuthUserDto | null;

  constructor(comment: RecipeCommentRelation) {
    this.id = comment.id;
    this.parentCommentId = comment.parentCommentId ?? null;
    this.content = comment.content;
    this.replyCount = comment.replyCount;
    this.createdAt = comment.createdAt.toString();
    this.updatedAt = comment.updatedAt.toString();
    this.user = new AuthUserDto(comment.user);
    this.mentionUser = comment.mentionUser
      ? new AuthUserDto(comment.mentionUser)
      : null;
  }
}

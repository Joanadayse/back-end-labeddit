import z from "zod";

export interface PostCommentInputDTO {
  token: string;
  postId: string;
  comments: string;
}

export interface PostCommentOutPUTDTO {
  message: string;
}

export const PostCommentSchema = z
  .object({
    token: z.string().min(1),
    postId: z.string().min(1).nonempty(),
    comments: z.string().min(2).nonempty(),
  })
  .transform((data) => data as PostCommentInputDTO);
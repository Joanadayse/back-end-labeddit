import z from "zod"

export interface likeOrDislikePostsInputDTO{
    postId: string,
    token:string,
    like: boolean
    
}
export type likeOrDislikePostsOutputDTO= undefined

export const likeOrDislikePostsScherma= z.object({
    postId: z.string().min(1),
    token:z.string().min(1),
    like: z.boolean()
}).transform(data => data as likeOrDislikePostsInputDTO)
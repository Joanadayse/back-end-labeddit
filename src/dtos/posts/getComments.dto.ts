import { z } from "zod";
import { CommentsModel}  from "../../models/Posts";



export interface GetCommentsInputDTO{
   postId:string
}

export type GetCommentsOutputDTO= CommentsModel[]


export const GetCommentsScherma= z.object({
    postId: z.string().min(1)
}).transform(data=>data as GetCommentsInputDTO)
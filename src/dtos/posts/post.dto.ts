import { Post } from "../../models/Posts"


export interface GetPostByIdInputDTO {
    id: string,
    token: string | undefined
}

export interface GetPostCreatorOutputDTO {
    messsage: string,
    post: {
        id: string,
        content: string,
        likes: number,
        dislikes: number,
        createdAt: string,
        updatedAt: string,
        creator: {
            id: string,
            nickName: string
        }
    } 
}

export interface CreatePostInputDTO { token: string | undefined, content: unknown }

export interface CreatePostOutputDTO { message: string, }

export interface EditPostInputDTO { idToEdit: string, token: string | undefined, content: unknown }

export interface EditPostOutputDTO { message: string }

export interface DeletePostInputDTO { idToDelete: string, token: string | undefined }

export interface DeletePostOutputDTO { message: string }

export interface LikeOrDislikePostInputDTO { idToLikeOrDislike: string, token: string | undefined, like: unknown }

export class PostDTO extends Post {
    public getPostOutput(post: Post): GetPostCreatorOutputDTO {
        const dto: GetPostCreatorOutputDTO = {
            messsage: "Lista dos posts com seu respectivo criador.",            
            post: {
                id: post.getId(),
                content: post.getContent(),
                likes: post.getLikes(),
                dislikes: post.getDislikes(),
                createdAt: post.getCreatedAt(),
                updatedAt: post.getUpdatedAt(),
                creator: post.getCreator()     
            } 
        }
    return dto
    }
}
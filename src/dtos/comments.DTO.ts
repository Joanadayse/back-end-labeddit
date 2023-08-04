export interface GetCommentsInputDTO {
    token: string | undefined,
    idToReply: string
}

export interface GetPostWithCommentsOutputDTO {
    post: {
        id: string,
        content: string,
        likes: number,
        dislikes: number,
        replies: number,
        createdAt: string,
        updatedAt: string,
        creator: {
            id: string,
            nickName: string
        }
        comments: {
            id: string,
            postId: string,
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
}

export interface GetCommentsOutputDTO { id: string,content: string,likes: number,dislikes: number,commentCreatedAt: string,commentUpdatedAt: string,commentCreatorId: string,postId: string,commentCreatorNickName: string }

export interface CreateCommentInputDTO { token: string | undefined, content: unknown, idToComment: string }

export interface CreateCommentOutputDTO { message: string }

export interface DeleteCommentInputDTO { idToDelete: string, token: string | undefined }

export interface DeleteCommentOutputDTO { message: string }

export interface LikeOrDislikeCommentInputDTO { idCommentToLikeOrDislike: string, token: string | undefined, like: unknown }
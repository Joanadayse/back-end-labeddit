export enum USER_ROLES { NORMAL = "NORMAL", ADMIN = "ADMIN" }

export interface TokenPayLoad { id: string, nickName: string, role: USER_ROLES }

export interface UserDB { id: string, nick_name: string, email: string, password: string, role: USER_ROLES, created_at: string }

export interface UserModel { id: string, nickName: string, email: string, password: string, role: USER_ROLES, createdAt: string }

export interface PostDB { id: string, content: string, likes: number, dislikes: number, replies: number, created_at: string, updated_at: string, creator_id: string}

export interface CreatorPost { id: string, nickName: string    }

export interface PostCreatorModel {
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
}

export interface LikeDislikePostDB { user_id: string, post_id: string, like: number }

export interface LikeDislikePostCommentDB { user_id: string, comment_id: string, like: number }

export enum POST_LIKE { ALREADY_LIKED = "ALREADY LIKED", ALREADY_DISLIKED = "ALREADY DISLIKED" }

export interface PostWithCreatorDB extends PostDB { creator_nick_name: string }

export interface CommentDB { id: string, content: string, likes: number, dislikes: number, created_at: string, updated_at: string, creator_id: string, post_id: string }

export interface CommentWithCreatorNameDB extends CommentDB {    
    comment_creator_nick_name: string
}

export interface CommentModel {
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
    postId: string
}

export interface PostWithCommentsDB extends PostWithCreatorDB {comments: CommentDB[] }

export interface PostWithCommentsModel {    
        id: string,
        content: string,
        likes: number,
        dislikes: number,
        replies: number,
        createdAt: string
        updatedAt: string
        postCreator: {
            id: string
            nickName: string
        },
            comments: {
                id: string
                content: string
                likes: number
                dislikes: number
                createdAt: string
                updatedAt: string
                creator: {
                    id: string
                    nickName: string
                },
                postId: string
            }
}
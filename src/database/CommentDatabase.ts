
import { GetCommentsOutputDTO } from "../dtos/comments.DTO"
import { CommentDB, CommentWithCreatorNameDB, LikeDislikePostCommentDB, PostWithCommentsDB, PostWithCreatorDB, POST_LIKE } from "../types"
import { BaseDatabase } from "./BaseDatabase"
import { PostDatabase } from "./PostDatabase"

export class CommentDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_COMMENTS = "comments"
    public static TABLE_POST_COMMENTS = "post_comments"
    public static TABLE_LIKES_DISLIKES_POST_COMMENT = "likes_dislikes_post_comment"

    public getPostComments = async (postId: string): Promise<GetCommentsOutputDTO[] | undefined> => {
        
        const postComments: GetCommentsOutputDTO[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)        
            .select(
                "comments.id",
                "comments.content",
                "comments.likes",
                "comments.dislikes",
                "comments.created_at AS commentCreatedAt",
                "comments.updated_at AS commentUpdatedAt",
                "comments.creator_id AS commentCreatorId",
                "comments.post_id AS postId",
                "users.nick_name AS commentCreatorNickName",
            )
            .join("users", "comments.creator_id", "=", "users.id")
            .where("comments.post_id", postId)
                
        return postComments 
    }

    public insert = async (commentDB: CommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .insert(commentDB)
    }

    public searchCommentById = async (id: string): Promise<CommentDB | undefined> => {
        const result: CommentDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .select()
            .where({ id })
        return result[0]        
    }

    public deleteComment = async (idToDelete: string): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .delete()
            .where({ id: idToDelete })
    }

    public getCommentWithCreator = async (idCommentToLikeOrDislike: string): Promise<CommentWithCreatorNameDB | undefined> => {
        
        const result: CommentWithCreatorNameDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)        
            .select(
                "comments.id",
                "comments.content",
                "comments.likes",
                "comments.dislikes",
                "comments.created_at",
                "comments.updated_at",
                "comments.post_id",
                "comments.creator_id",
                "users.nick_name AS comment_creator_nick_name",
            )
            .join("users", "comments.creator_id", "=", "users.id")
            .where(`comments.id`, idCommentToLikeOrDislike)
            return result[0]
    }


    public likeOrDislikeComment = async (likeDislikePostCommentDB: LikeDislikePostCommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_POST_COMMENT)
            .insert(likeDislikePostCommentDB)
    }

    public searchLikeDislike = async (likeDislikeDBToFind: LikeDislikePostCommentDB): Promise<POST_LIKE | null> => {
        const [ likeDislikeDB ]: LikeDislikePostCommentDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_POST_COMMENT)
            .select()
            .where({
                user_id: likeDislikeDBToFind.user_id,
                comment_id: likeDislikeDBToFind.comment_id
            })
        if(likeDislikeDB) {
            return likeDislikeDB.like === 1 ? POST_LIKE.ALREADY_LIKED : POST_LIKE.ALREADY_DISLIKED
        } else {
            return null
        }
    }

    public removeLikeDislike = async (likeDislikeDB :LikeDislikePostCommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_POST_COMMENT)
            .delete()
            .where({
                user_id: likeDislikeDB.user_id,
                comment_id: likeDislikeDB.comment_id
            })
    }

    public updateLikeDislike = async (likeDislikeDB: LikeDislikePostCommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_POST_COMMENT)
            .update(likeDislikeDB)
            .where({
                user_id: likeDislikeDB.user_id,
                comment_id: likeDislikeDB.comment_id
            })
    }

    public updateComment = async (idToEdit: string, updatedCommentDB: CommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .update(updatedCommentDB)
            .where({ id: idToEdit })    
    }
}
import { LikeDislikePostDB, PostDB, PostWithCreatorDB, POST_LIKE, UserDB } from "../types"
import { BaseDatabase } from "./BaseDatabase"


export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_COMMENTS = "comments"
    public static TABLE_LIKES_DISLIKES_POSTS = "likes_dislikes_post"

    public getAllPosts = async (): Promise<PostDB[]> => {
        const postsDB = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select()

        return postsDB
    }

    public getPostsByContent = async (q: string): Promise<PostDB[]> => {
        const postDB = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .where("content", "LIKE", `%${q}%`)

        return postDB

    }
     
    // public getPostWithCreator = async (q: string | undefined): Promise<{ postsDB: PostDB[]; creatorsDB: UserDB[]; }> => {
    //     let postsDB: PostDB[]

    //     if(q) {
    //         postsDB = await this.getPostsByContent(q)
    //     } else {
    //         postsDB = await this.getAllPosts()
    //     }

    //     const creatorsDB = await BaseDatabase
    //         .connection(UserDatabase.TABLE_USERS)
    //         .select()

    //     return{
    //         postsDB,
    //         creatorsDB
    //     }
    // }

    public getPost = async (q: string | undefined): Promise<PostDB[]> => {
        let postsDB: PostDB[]

        if(q) {
            postsDB = await this.getPostsByContent(q)
        } else {
            postsDB = await this.getAllPosts()
        }
       
        return postsDB   
    }

    // public getPostWithCreator = async (q: string | undefined): Promise<{ postsDB: PostDB[]; creatorsDB: UserDB[]; }> => {
    //     let postsDB: PostDB[]

    //     if(q) {
    //         postsDB = await this.getPostsByContent(q)
    //     } else {
    //         postsDB = await this.getAllPosts()
    //     }

    //     const creatorsDB = await BaseDatabase
    //         .connection(UserDatabase.TABLE_USERS)
    //         .select()

    //     return{
    //         postsDB,
    //         creatorsDB
    //     }
    // }


    public insert = async (postDB: PostDB): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(postDB)
    }  

    public searchPostById = async (id: string): Promise<PostDB | undefined> => {
        const result: PostDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select()
            .where({ id })

        return result[0]        
    }

    public updatePost = async (idToEdit: string, updatedPostDB: PostDB): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .update(updatedPostDB)
            .where({ id: idToEdit })    
    }

    public deletePost = async (idToDelete: string): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .delete()
            .where({ id: idToDelete })
    }

    public getPostWithCreatorById = async (postId: string): Promise<PostWithCreatorDB | undefined> => {
        const result: PostWithCreatorDB[] =  await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                "posts.id",
                "posts.creator_id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.replies",
                "posts.created_at",
                "posts.updated_at",
                "users.nick_name AS creator_nick_name"
            )
            .join("users", "posts.creator_id", "=", "users.id")
            .where(`posts.id`, postId )
            
            return result[0]
    }

    public likeOrDislikePost = async (likeDislikePostDB: LikeDislikePostDB): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES_POSTS)
            .insert(likeDislikePostDB)
    }

    public searchLikeDislike = async (likeDislikePostDBToFind: LikeDislikePostDB): Promise<POST_LIKE | null> => {
        const [ likeDislikePostDB ]: LikeDislikePostDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES_POSTS)
            .select()
            .where({
                user_id: likeDislikePostDBToFind.user_id,
                post_id: likeDislikePostDBToFind.post_id
            })

        if(likeDislikePostDB) {
            return likeDislikePostDB.like === 1 ? POST_LIKE.ALREADY_LIKED : POST_LIKE.ALREADY_DISLIKED
        } else {
            return null
        }

    }

    public removeLikeDislike = async (likeDislikePostDB :LikeDislikePostDB): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES_POSTS)
            .delete()
            .where({
                user_id: likeDislikePostDB.user_id,
                post_id: likeDislikePostDB.post_id
            })
    }

    public updateLikeDislike = async (likeDislikePostDB: LikeDislikePostDB): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES_POSTS)
            .update(likeDislikePostDB)
            .where({
                user_id: likeDislikePostDB.user_id,
                post_id: likeDislikePostDB.post_id
            })
    }
    

}
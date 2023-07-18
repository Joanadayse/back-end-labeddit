import { POST_LIKE, PostDB, PostDBWithCreatorName, likeOrDislikeDB } from "../models/Posts";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase{
    public static TABLE_POST= "post"
    public static TABLE_LIKES_DISLIKES= "likes_dislikes"
    public static TABLE_COMMENTS= "posts_comments"

    public insertPost = async (newPost: PostDB): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_POST).insert(newPost);
      };
    public updatePost = async (newPost: PostDB): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_POST).update(newPost).where({id: newPost.id});
      };

      public getPostEndCreatorName = async (): Promise<PostDBWithCreatorName[]> => {
        const result = await BaseDatabase.connection(PostDatabase.TABLE_POST)
          .select(
            `${PostDatabase.TABLE_POST}.id`,
            `${PostDatabase.TABLE_POST}.creator_id`,
            `${PostDatabase.TABLE_POST}.content`,
            `${PostDatabase.TABLE_POST}.likes`,
            `${PostDatabase.TABLE_POST}.dislikes`,
            `${PostDatabase.TABLE_POST}.created_at`,
            `${PostDatabase.TABLE_POST}.updated_at`,
            `${UserDatabase.TABLE_USERS}.name as creator_name`,
           
          )
          .join(
            `${UserDatabase.TABLE_USERS}`,
            `${PostDatabase.TABLE_POST}.creator_id`,
            "=",
            `${UserDatabase.TABLE_USERS}.id`
          );
        return result as PostDBWithCreatorName[];
      };
      public findPostCreatorName = async (id:string): Promise<PostDBWithCreatorName | undefined> => {
        const [result] = await BaseDatabase.connection(PostDatabase.TABLE_POST)
          .select(
            `${PostDatabase.TABLE_POST}.id`,
            `${PostDatabase.TABLE_POST}.creator_id`,
            `${PostDatabase.TABLE_POST}.content`,
            `${PostDatabase.TABLE_POST}.likes`,
            `${PostDatabase.TABLE_POST}.dislikes`,
            `${PostDatabase.TABLE_POST}.created_at`,
            `${PostDatabase.TABLE_POST}.updated_at`,
            `${UserDatabase.TABLE_USERS}.name as creator_name`,
           
          )
          .join(
            `${UserDatabase.TABLE_USERS}`,
            `${PostDatabase.TABLE_POST}.creator_id`,
            "=",
            `${UserDatabase.TABLE_USERS}.id`
          )
          .where({[`${PostDatabase.TABLE_POST}.id`]:id})

        return result as PostDBWithCreatorName | undefined;
      };

      public deletePost= async(id:string):Promise<void>=>{
        await BaseDatabase.connection(PostDatabase.TABLE_POST).delete().where({id});
      }

      public findPosts= async(id:string | undefined)=>{
        let postDB;

        if(id){
          const result: PostDB[] = await BaseDatabase.connection(PostDatabase.TABLE_POST).where({id})
          postDB= result
        }else{
          const result: PostDB[] = await BaseDatabase.connection(PostDatabase.TABLE_POST)
          postDB=result          
        }
        return postDB
      }

      public findPostById= async(id:string):Promise<PostDB | undefined>=>{
        const [result] = await BaseDatabase.connection(PostDatabase.TABLE_POST).where({id})
        return result as PostDB | undefined
      }

      public findLikeDislike= async(likeDislikeDB: likeOrDislikeDB): Promise<POST_LIKE | undefined>=>{
           const [result] = await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).select()
           .where({
            user_id:likeDislikeDB.user_id,
            post_id:likeDislikeDB.post_id
           })
           if (result === undefined) {
            return undefined;
          } else if (result.like === 1) {
            return POST_LIKE.ALREADY_LIKED;
          } else {
            return POST_LIKE.ALREADY_DISLIKED;
          }
        
      }

      public removeLikeDislike= async(likeDislikeDB: likeOrDislikeDB):Promise<void>=>{
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).delete().where({
          user_id:likeDislikeDB.user_id,
          post_id:likeDislikeDB.post_id
        })
      }

      public updateLikeDislike= async(likeDislikeDB:likeOrDislikeDB):Promise<void>=>{
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).update(likeDislikeDB).where({
          user_id:likeDislikeDB.user_id,
          post_id:likeDislikeDB.post_id
        })
      }
      public insertLikeDislike= async(likeDislikeDB:likeOrDislikeDB):Promise<void>=>{
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).insert(likeDislikeDB)
      }
      


      public insertCommentIntoDatabase = async (
        userId: string,
        postId: string,
        comments: string
      ) => {
        await BaseDatabase.connection(PostDatabase.TABLE_COMMENTS).insert({
          user_id: userId,
          post_id: postId,
          comments: comments,
        });
      };

      public findCommentsByPostId = async (postId: string) => {
        const comments = await BaseDatabase.connection(PostDatabase.TABLE_COMMENTS).where({ post_id: postId }); 
        return comments;
      };

      // public getComments = async ():Promise<PostDBWithComments[]>=> {
      //   const comments = await BaseDatabase.connection(PostDatabase.TABLE_POST)
      //     .select(
      //       `${PostDatabase.TABLE_POST}.id`,
      //       `${PostDatabase.TABLE_POST}.creator_id`,
      //       `${PostDatabase.TABLE_POST}.content`,
      //       `${PostDatabase.TABLE_POST}.likes`,
      //       `${PostDatabase.TABLE_POST}.dislikes`,
      //       `${PostDatabase.TABLE_POST}.created_at`,
      //       `${PostDatabase.TABLE_POST}.updated_at`,
      //       `${PostDatabase.TABLE_COMMENTS}.comments`,
      //     )
      //     .join(
      //       `${PostDatabase.TABLE_COMMENTS}`,
      //       `${PostDatabase.TABLE_POST}.id`,
      //       "=",
      //       `${PostDatabase.TABLE_COMMENTS}.post_id`
      //     );
    
      //   return comments as PostDBWithComments[]
      // };



}
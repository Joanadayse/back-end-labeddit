import { PostDB } from "../models/Posts";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase{
    public static TABLE_POST= "post"
    public static TABLE_LIKES_DISLIKES= "likes_dislikes"

    public insertPost = async (newPost: PostDB): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_POST).insert(newPost);
      };
}
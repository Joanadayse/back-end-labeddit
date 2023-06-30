import { PostDatabase } from "../database/PostDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/posts/createPosts.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Post } from "../models/Posts";
import { HashManager } from "../services/HashManager";
import { TokenManager } from "../services/TokenManager";
import { IdGenerator } from "../services/idGenerator";

export class PostBusiness{
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}

    public createPost = async (
        input: CreatePostInputDTO
      ): Promise<CreatePostInputDTO> => {
        const { content, token } = input;
    
        const payload = this.tokenManager.getPayload(token);
    
        if (!payload) {
          throw new UnauthorizedError();
        }
    
        const id = this.idGenerator.generate();
    
        const post = new Post(
          id,
        content,
          0,
          0,
          new Date().toISOString(),
          new Date().toISOString(),
          payload.id,
          payload.name
        );
        const postDB = post.toDBModel();
        await this.postDatabase.insertPost(postDB);
    
        const output: CreatePostOutputDTO = undefined;
    
        return output;
      };
}
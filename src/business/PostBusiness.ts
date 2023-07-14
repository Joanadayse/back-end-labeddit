import { PostDatabase } from "../database/PostDatabase";
import { PostCommentInputDTO, PostCommentOutPUTDTO } from "../dtos/posts/createPostComents.dto";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/posts/createPosts.dto";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/posts/deletePost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/posts/editPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/posts/getPosts.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFountError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Post } from "../models/Posts";
import { USER_ROLES } from "../models/User";
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


    public getPost= async(input:GetPostsInputDTO): Promise<GetPostsOutputDTO>=>{
      const { token } = input;

      const payload = this.tokenManager.getPayload(token);
      if (!payload) {
        throw new UnauthorizedError();
      }

      const PostEndCreatorName = await this.postDatabase.getPostEndCreatorName();

      const PostModel = PostEndCreatorName.map((post) => {
        const posts = new Post(
          post.id, 
          post.content,
          post.likes,
          post.dislikes,
          post.created_at,
          post.updated_at,
          post.creator_id,
          post.creator_name,
          // post.userId,
          // post.postId,
          // post.comments
        
  );
  
        return posts.toBusinessModel();
      });
      const output: GetPostsOutputDTO = PostModel;

      return output;
    }


    public addComments= async(input:PostCommentInputDTO):Promise<PostCommentOutPUTDTO>=>{
      const {token, postId, comments}= input

      const payload= this.tokenManager.getPayload(token)

      if (!payload) {
        throw new BadRequestError("Token is invalid");
      }

      const userId= payload.id

      await this.postDatabase.insertCommentIntoDatabase(userId,postId,comments)

      const output: PostCommentOutPUTDTO={
        message:"Comentatio adicionado com sucesso!"

      }

      return output


    }

  //   public getComments= async(input:GetCommentsInputDTO):Promise<GetCommentsOutputDTO>=>{
  //     const { postId } = input;

  
  //     if (!postId) {
  //       throw new UnauthorizedError();
  //     }

  //     const PostComments = await this.postDatabase.findCommentsByPostId(postId);

  //     const ComentsModel = PostComments.map((post) => {
  //       const posts = new Post(
  //         post.id, 
  //         post.content,
  //         post.likes,
  //         post.dislikes,
  //         post.created_at,
  //         post.updated_at,
  //         post.creator_id,
  //         post.creator_name,
  //         post.userId,
  //         post.postId,
  //         post.comments
        
  // );
  
  //       return posts.toCommentsModel();
  //     });
  //     const output: GetCommentsOutputDTO = ComentsModel;

  //     return output;
  //   }


  public editPost = async (
    input: EditPostInputDTO
  ): Promise<EditPostOutputDTO> => {
    const { content, token , idToEdit} = input;
    

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postsDB=await this.postDatabase.findPostById(idToEdit)

    if (!postsDB) {
      throw new NotFoundError("Post com esse 'id' não existe");
    }
    if (payload.id=== postsDB.creator_id) {
      throw new ForbiddenError("somente quem criou o post pode editar!");
    }

    const post = new Post(
      postsDB.id,
    postsDB.content,
      postsDB.likes,
      postsDB.dislikes,
      postsDB.created_at,
      postsDB.updated_at,
      payload.id,
      payload.name   
    );


    post.seTcontent(content)
    const updatePostDB=post.toDBModel();
    await this.postDatabase.updatePost(updatePostDB);

    const output: EditPostOutputDTO = undefined;

    return output;
  };
  public deletPost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const {  token , idToDelete} = input;
    

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postsDB=await this.postDatabase.findPostById(idToDelete)

    if (!postsDB) {
      throw new NotFoundError("Post com esse 'id' não existe");
    }

    if (payload.role!== USER_ROLES.ADMIN) {
      if (payload.id !== postsDB.creator_id) {
        throw new ForbiddenError("somente quem criou o post pode deletar!");
      }      
    }


    await this.postDatabase.deletePost(idToDelete);

    const output: DeletePostOutputDTO = undefined;

    return output;
  };

 
    }

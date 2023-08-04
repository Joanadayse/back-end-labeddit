import { PostDatabase } from "../database/PostDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { CreatePostInputDTO, CreatePostOutputDTO, DeletePostInputDTO, DeletePostOutputDTO, EditPostInputDTO, EditPostOutputDTO, GetPostByIdInputDTO, LikeOrDislikePostInputDTO } from "../dtos/posts/post.dto"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFountError"
import { Post } from "../models/Posts"

import { TokenManager } from "../services/TokenManager"
import { IdGenerator } from "../services/idGenerator"
import { 
        CreatorPost, 
        LikeDislikePostDB, 
        PostCreatorModel, 
        PostDB, 
        PostWithCreatorDB, 
        POST_LIKE, 
        TokenPayLoad, 
        UserDB, 
        USER_ROLES 
    } from "../types"


export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator
    ) {}

    public getPosts = async (input: any): Promise<PostCreatorModel[]> => {
        
        const { q, token } = input

              
        if(token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("token inválido")
        }
       
        const postsDB: PostDB[] = await this.postDatabase.getPost(q)

        const creatorsDB: UserDB[] = await this.userDatabase.findUsers(q)

     
        const posts: PostCreatorModel[] = postsDB.map((postDB) => {
            const userSearch = creatorsDB.find((creatorDB) => creatorDB.id === postDB.creator_id)
                if(!userSearch) {
                    throw new BadRequestError("usuário não econtrado")
                }

                const user: TokenPayLoad = {
                    id: userSearch.id,
                    nickName: userSearch.nick_name,
                    role: userSearch.role
                }
            
            const post = new Post(
                postDB.id,
                postDB.content,
                postDB.likes,
                postDB.dislikes,
                postDB.replies,
                postDB.created_at,
                postDB.updated_at,
                user            
                )

            const postToBusinesModel = post.toBusinessModel()
                      
            return postToBusinesModel
        })
    
                
        return posts
    }

    public getPostById = async (input: GetPostByIdInputDTO): Promise<PostCreatorModel> => {
        
        const { id, token } = input

                
        if(token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("token inválido")
        }

        const postWithCreatorDB: PostWithCreatorDB | undefined = 
            await this.postDatabase.getPostWithCreatorById(id)

        if(!postWithCreatorDB) {
            throw new NotFoundError("'id' do post não encontrado.")   
        }

        const userId = payload.id
        const creatorId = postWithCreatorDB.creator_id
        const creatorNickName = postWithCreatorDB.creator_nick_name
                                        
        function getCreator(creatorId: string, creatorNickName: string): CreatorPost {
            return {
                id: creatorId,
                nickName: creatorNickName
            }
         }

        const post = new Post(
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.replies,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            getCreator(creatorId, creatorNickName)
        )

        const postToBusinesModel = post.toBusinessModel()
                    
        return postToBusinesModel       
    
    }

    public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {
        
        const { content, token } = input
       
        if(token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("token inválido")
        }

        if(typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        if(content.length < 4) {
            throw new BadRequestError("'content' deve possuir no mínimo 4 caracteres")            
        }

        const id = this.idGenerator.generate()
        const creatorId = payload.id
        const creatorNickName = payload.nickName
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()

        function getCreator(creatorId: string, creatorNickName: string): CreatorPost {
            return {
                id: creatorId,
                nickName: creatorNickName
            }
         }
        const post = new Post(
            id,
            content,
            0,
            0,
            0,
            createdAt,
            updatedAt,
            getCreator(creatorId, creatorNickName)
        )

        const postDB = post.toDBModel()

        await this.postDatabase.insert(postDB)

        const output: CreatePostOutputDTO = {
            message: "Post criado com sucesso!"
        }

        return output

    }

    public editPost = async (input: EditPostInputDTO): Promise<EditPostOutputDTO> => {
        
        const { idToEdit, content, token } = input
       
        if(token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("token inválido")
        }

        if(typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        const postDB: PostDB | undefined = await this.postDatabase.searchPostById(idToEdit)

        if(!postDB) {
            throw new NotFoundError("'id' do post não encontrado.")            
        }

        const creatorId = payload.id
        const creatorNickName = payload.nickName

        if(postDB.creator_id !== creatorId) {
            throw new BadRequestError("Somente o criador do post pode editá-lo.")
        }
        

        function getCreator(creatorId: string, creatorNickName: string): CreatorPost {
            return {
                id: creatorId,
                nickName: creatorNickName
            }
         }

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.replies,
            postDB.created_at,
            postDB.updated_at,
            getCreator(creatorId, creatorNickName)
        )

        post.setContent(content)
        post.setUpdatedAt(new Date().toISOString())

        const updatedPostDB = post.toDBModel()

        await this.postDatabase.updatePost(idToEdit, updatedPostDB)

        const output: EditPostOutputDTO = {
            message: "Post editado com sucesso"
        }

        return output
    }

    public deletePost = async (input: DeletePostInputDTO): Promise<DeletePostOutputDTO> => {
        
        const { idToDelete, token } = input
       
        if(token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("token inválido")
        }

        
        const postDB: PostDB | undefined = await this.postDatabase.searchPostById(idToDelete)

        if(!postDB) {
            throw new NotFoundError("'id' do post não encontrado.")            
        }

        const creatorId = payload.id

        if(payload.role !== USER_ROLES.ADMIN
            && postDB.creator_id !== creatorId
            ) {
            throw new BadRequestError("Somente o criador do post ou admistrador pode apagá-lo.")
        }   

        await this.postDatabase.deletePost(idToDelete)

        const output: DeletePostOutputDTO = {
            message: "Post apagado com sucesso!"
        }

        return output
    }

    public likeOrDislikePost = async (input: LikeOrDislikePostInputDTO): Promise<void> => {
        
        const { idToLikeOrDislike, token, like } = input
       
        if(token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("token inválido")
        }

        if(typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser boolean")            
        }
        
        const postWithCreatorDB = await this.postDatabase.getPostWithCreatorById(idToLikeOrDislike)

        if(!postWithCreatorDB) {
            throw new NotFoundError("'id' do post não encontrado.")            
        }

        const userId = payload.id
        const creatorId = postWithCreatorDB.creator_id
        const creatorNickName = postWithCreatorDB.creator_nick_name
        
        if(postWithCreatorDB.creator_id === userId) {
            throw new BadRequestError("O criador do post não pode dar like ou dislike em seu próprio post")
        }   
        
        const convertedId = like ? 1 : 0

        const likeDislikePostDB: LikeDislikePostDB = {
            user_id: userId,
            post_id: postWithCreatorDB.id,
            like: convertedId
        }
        
        function getCreator(creatorId: string, creatorNickName: string): CreatorPost {
            return {
                id: creatorId,
                nickName: creatorNickName
            }
         }

        const post = new Post(
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.replies,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            getCreator(creatorId, creatorNickName)
        )

        const likeDislikeAlreadyExists = await this.postDatabase.searchLikeDislike(likeDislikePostDB)

        if(likeDislikeAlreadyExists === POST_LIKE.ALREADY_LIKED) {

            if(like) {
                await this.postDatabase.removeLikeDislike(likeDislikePostDB)
                post.removeLike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislikePostDB)
                post.removeLike()
                post.addDislike()
            }
        } else if(likeDislikeAlreadyExists === POST_LIKE.ALREADY_DISLIKED) {

            if(like) {
                await this.postDatabase.updateLikeDislike(likeDislikePostDB)
                post.removeDislike()
                post.addLike()
            } else {
                await this.postDatabase.removeLikeDislike(likeDislikePostDB)
                post.removeDislike()
            }

        } else {
            await this.postDatabase.likeOrDislikePost(likeDislikePostDB)
            like ? post.addLike() : post.addDislike()
        }

        const updatedPostDB = post.toDBModel()
        await this.postDatabase.updatePost(idToLikeOrDislike, updatedPostDB)

    }
}
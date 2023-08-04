import { CommentDatabase } from "../database/CommentDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { CreateCommentInputDTO, CreateCommentOutputDTO, DeleteCommentInputDTO, DeleteCommentOutputDTO, GetCommentsInputDTO, GetCommentsOutputDTO, LikeOrDislikeCommentInputDTO } from "../dtos/comments.DTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFountError"

import { Comment } from "../models/Comments"
import { Post } from "../models/Posts"
import { TokenManager } from "../services/TokenManager"
import { IdGenerator } from "../services/idGenerator"

import { 
    CommentDB,
        CreatorPost, 
        LikeDislikePostCommentDB, 
        PostWithCreatorDB, 
        POST_LIKE, 
        USER_ROLES
} from "../types"


export class CommentBusiness {
    constructor(
        private commentDatabase: CommentDatabase,
        private postDatabase: PostDatabase,
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator
    ) {}

    

    public getPostComments = async (input: GetCommentsInputDTO) => {
        
        const { token, idToReply } = input

        if(token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("token inválido")
        }

        const postWithCreatorDB: GetCommentsOutputDTO[] | undefined = 
            await this.commentDatabase.getPostComments(idToReply)

        
        if(!postWithCreatorDB) {
            throw new NotFoundError("'id' do post não encontrado.")   
        }
      

        console.log(postWithCreatorDB)

        return postWithCreatorDB
    }



    public createComment = async (input: CreateCommentInputDTO): Promise<CreateCommentOutputDTO> => {
        
        const { content, token, idToComment } = input
       
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

        const postWithCreatorDB: PostWithCreatorDB | undefined = await this.postDatabase.getPostWithCreatorById(idToComment)

        if(!postWithCreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const commentId = this.idGenerator.generate()
        const commentCreatorId = payload.id
        const commentCreatornickName = payload.nickName
        const commentCreatedAt = new Date().toISOString()
        const commentUpdatedAt = new Date().toISOString()

        function getCreator(postCreatorId: string, postCreatornickName: string): CreatorPost {
            return {
                id: postCreatorId,
                nickName: postCreatornickName
            }
        }

        const updatedPost = new Post (
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.replies,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            getCreator(postWithCreatorDB.creator_id, postWithCreatorDB.creator_nick_name)
        )

        console.log(updatedPost)

        updatedPost.addReply()

        const updatedPostDB = updatedPost.toDBModel()

        await this.postDatabase.updatePost(idToComment, updatedPostDB)
      
        const comment = new Comment(
            commentId,
            content,
            0,
            0,
            commentCreatedAt,
            commentUpdatedAt,
            commentCreatorId,
            commentCreatornickName,
            updatedPostDB.id,
            updatedPostDB.creator_id,
            updatedPostDB.content,
            updatedPostDB.likes,
            updatedPostDB.dislikes,
            updatedPostDB.replies,
            updatedPostDB.created_at,
            updatedPostDB.updated_at
        )        

        const commentDB = comment.toDBModel()

        await this.commentDatabase.insert(commentDB)

        const output: CreateCommentOutputDTO = {
            message: "Comentário criado com sucesso"
        }

        return output
    }

    public deleteComment = async (input: DeleteCommentInputDTO): Promise<DeleteCommentOutputDTO> => {
        
        const { idToDelete, token } = input
       
        if(token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("token inválido")
        }
        
        const commentDB: CommentDB | undefined = await this.commentDatabase.searchCommentById(idToDelete)

        console.log(commentDB)
        
        if(!commentDB) {
            throw new NotFoundError("'id' do comment não encontrado.")            
        }

        const creatorId = payload.id

        if(payload.role !== USER_ROLES.ADMIN
            && commentDB.creator_id !== creatorId
            ) {
            throw new BadRequestError("Somente o criador do comment ou admistrador pode apagá-lo.")
        }
        
        const postWithCreatorDB: PostWithCreatorDB | undefined = await this.postDatabase.getPostWithCreatorById(commentDB.post_id)

        if(!postWithCreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        function getCreator(postCreatorId: string, postCreatornickName: string): CreatorPost {
            return {
                id: postCreatorId,
                nickName: postCreatornickName
            }
        }

        const updatedPost = new Post (
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.replies,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            getCreator(postWithCreatorDB.creator_id, postWithCreatorDB.creator_nick_name)
        )

        console.log(updatedPost)

        updatedPost.removeReply()

        const updatedPostDB = updatedPost.toDBModel()

        await this.postDatabase.updatePost(commentDB.post_id, updatedPostDB)

        await this.commentDatabase.deleteComment(idToDelete)   
        
        const output: DeleteCommentOutputDTO = {
            message: "Comentário apagado com sucesso"
        }

        return output

    }

    public likeOrDislikeComment = async (input: LikeOrDislikeCommentInputDTO): Promise<void> => {
        
        const { idCommentToLikeOrDislike, token, like } = input
       
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
        
        const commentWithCreatorDB = await this.commentDatabase.getCommentWithCreator(idCommentToLikeOrDislike)

        console.log(commentWithCreatorDB)

        if(!commentWithCreatorDB) {
            throw new NotFoundError("'id' do comment não encontrado.")            
        }

        const userId = payload.id
              
        if(commentWithCreatorDB.creator_id === userId) {
            throw new BadRequestError("O criador do commentário não pode dar like ou dislike em seu próprio commentário")
        }   

        const postWithCreatorDB: PostWithCreatorDB | undefined = await this.postDatabase.getPostWithCreatorById(commentWithCreatorDB.post_id)

        if(!postWithCreatorDB) {
            throw new BadRequestError("'id' não encontrado")
        }

       
        function getCreator(postCreatorId: string, postCreatornickName: string): CreatorPost {
            return {
                id: postCreatorId,
                nickName: postCreatornickName
            }
        }

        const post = new Post (
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.replies,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            getCreator(postWithCreatorDB.creator_id, postWithCreatorDB.creator_nick_name)
        )
        
        const convertedId = like ? 1 : 0

        const likeDislikePostCommentDB: LikeDislikePostCommentDB = {
            user_id: userId,
            comment_id: commentWithCreatorDB.id,
            like: convertedId
        }        
        
        const comment = new Comment(
            commentWithCreatorDB.id,
            commentWithCreatorDB.content,
            commentWithCreatorDB.likes,
            commentWithCreatorDB.dislikes,
            commentWithCreatorDB.created_at,
            commentWithCreatorDB.updated_at,
            commentWithCreatorDB.creator_id,
            commentWithCreatorDB.comment_creator_nick_name,
            commentWithCreatorDB.post_id,
            postWithCreatorDB.creator_id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.replies,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at
        )              

        const likeDislikeAlreadyExists = await 
            this.commentDatabase.searchLikeDislike(likeDislikePostCommentDB)

        if(likeDislikeAlreadyExists === POST_LIKE.ALREADY_LIKED) {

            if(like) {
                await this.commentDatabase.removeLikeDislike(likeDislikePostCommentDB)
                comment.removeLike()
            } else {
                await this.commentDatabase.updateLikeDislike(likeDislikePostCommentDB)
                comment.removeLike()
                comment.addDislike()
            }
        } else if(likeDislikeAlreadyExists === POST_LIKE.ALREADY_DISLIKED) {

            if(like) {
                await this.commentDatabase.updateLikeDislike(likeDislikePostCommentDB)
                comment.removeDislike()
                comment.addLike()
            } else {
                await this.commentDatabase.removeLikeDislike(likeDislikePostCommentDB)
                comment.removeDislike()
            }

        } else {
            await this.commentDatabase.likeOrDislikeComment(likeDislikePostCommentDB)
            like ? comment.addLike() : comment.addDislike()
        }

        const updatedCommentDB = comment.toDBModel()
        await this.commentDatabase.updateComment(idCommentToLikeOrDislike, updatedCommentDB)
    }
}
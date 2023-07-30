import { LikeDislikeDatabase } from "../database/LikeDislikeDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { EditPostLikesInputDTO, LikeDislike } from "../dtos/likeDislike/likeDislike.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFountError";
import { Post } from "../models/Posts";
import { TokenManager } from "../services/TokenManager";
import { TLikesdislikesDB } from "../types";

export class LikiDislikeBusiness {
    constructor(
        private postDatabase : PostDatabase,
        private likesDislikesDatabase : LikeDislikeDatabase,
        private tokenManager: TokenManager
    ){}

  public async editLikeDislikeId(input : EditPostLikesInputDTO) : Promise<void>{
        const { id , token } = input;
        const updatedLike = input.like;

        const payload = this.tokenManager.getPayload(token);
        if (payload === null){
            throw new BadRequestError("Token inválido");
        } 

        const userId = payload.id;

        const postDB = await this.postDatabase.findPostId(id);
        if (!postDB){
            throw new NotFoundError(" Não existe um post com esse 'id'");
        }

        const postId = postDB.id as string;

        if (postDB.creator_id === userId){
            throw new BadRequestError("Usuário não pode dar like ou dislike no próprio post");
        }

        const likesDislikesDB = await this.likesDislikesDatabase.LikeUserPostId(userId, postId);

        let deltaLikes = 0;
        let deltaDislikes = 0;

        if (!likesDislikesDB){
            const newLikesDislikes = new LikeDislike(userId, postId);

            if (updatedLike){
                newLikesDislikes.setLike(1);
                deltaLikes = 1;
            } else {
                newLikesDislikes.setLike(0);
                deltaDislikes = 1;
            }

            const newLikesDislikesDB : TLikesdislikesDB = {
                user_id : newLikesDislikes.getUserId(),
                post_id : newLikesDislikes.getPostId(),
                like : newLikesDislikes.getLike()
            }

            await this.likesDislikesDatabase.createLike(newLikesDislikesDB);
        } else {
            const like = likesDislikesDB.like;

            if ((updatedLike === Boolean(like))){
                
                await this.likesDislikesDatabase.deleteLikeByUserAndPostId(userId, postId);

                if (updatedLike){
                    deltaLikes = -1;
                } else {
                    deltaDislikes = -1;
                }

            } else {
               
                const updatedLike = Number(!like);
                const updatedLikesDislikes = new LikeDislike(userId, postId, updatedLike);

                const updatedLikesDislikesDB : TLikesdislikesDB = {
                    user_id: updatedLikesDislikes.getUserId(),
                    post_id: updatedLikesDislikes.getPostId(),
                    like: updatedLikesDislikes.getLike()
                }

                await this.likesDislikesDatabase.updateLikeByUserAndPostId(
                    updatedLikesDislikesDB,
                    userId,
                    postId
                );

                deltaLikes = updatedLike ? 1 : -1;
                deltaDislikes = updatedLike ? -1 : 1;
            }
        }

        const updatedPost = new Post(
            postId,
            postDB.content,
            postDB.likes + deltaLikes,
            postDB.dislikes + deltaDislikes,
            postDB.created_at,
            postDB.updated_at,
            {
                id: postDB.creator_id,
                name: "" 
            }
        )

        const updatedPostDB = updatedPost.toDBModelBusiness();
        await this.postDatabase.edittePost(updatedPostDB, postId);
    }}
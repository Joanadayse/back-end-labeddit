import express from "express";
import { LikiDislikeBusiness } from "../business/LikiDislikeBusiness";
import { LikeDislikeController } from "../controller/LikeDislikeController";
import { LikeDislikeDatabase } from "../database/LikeDislikeDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { LikeDislikeDTO } from "../dtos/likeDislike/likeDislike.dto";
import { TokenManager } from "../services/TokenManager";


const likeDislikeController = new LikeDislikeController(
    new LikiDislikeBusiness(
        new PostDatabase(),
        new LikeDislikeDatabase(),
        new TokenManager()
    ),
    new LikeDislikeDTO()
);

export const likeDislikeRouter = express.Router();

likeDislikeRouter.put("/:id/like", likeDislikeController.editLikeDislike);



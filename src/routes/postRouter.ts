import express from "express";

import { PostController } from "../controller/PostController";

import { UserDatabase } from "../database/UserDatabase";

import { TokenManager } from "../services/TokenManager";
import { PostBusiness } from "../business/PostBusiness";
import { PostDatabase } from "../database/PostDatabase";
import { PostDTO } from "../dtos/posts/post.dto";
import { IdGenerator } from "../services/idGenerator";

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new UserDatabase(),
        new PostDTO(),
        new IdGenerator(),
        new TokenManager()
    ),
    new PostDTO()
);

export const postRouter = express.Router();

postRouter.get("/", postController.getPosts);
postRouter.post("/", postController.createPost);
postRouter.put("/:id", postController.editPost);
// postRouter.delete("/:id", postController.deletePost);
import { CommentDB, CommentModel, PostWithCommentsModel } from "../types";

export class Comment {
    constructor(
        private id: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private createdAt: string,
        private updatedAt: string,
        private creatorId: string,
        private creatorNickName: string,
        private postId: string,
        private postCreatorId: string,
        private postContent: string,
        private postLikes: number,
        private postDislikes: number,
        private postReplies: number,
        private postCreatedAt: string,
        private postUpdatedAt: string
    ) {}

    public getId(): string {
        return this.id
    }

    public setId(value: string): void {
        this.id = value
    }

    public getContent(): string {
        return this.content
    }

    public setContent(value: string): void {
        this.content = value
    }

    public getLikes(): number {
        return this.likes
    }

    public setLikes(value: number): void {
        this.likes = value
    }

    public addLike() {
        this.likes += 1
    }

    public removeLike() {
        this.likes -= 1
    }
    
    public addDislike() {
        this.dislikes += 1
    }

    public removeDislike() {
        this.dislikes -= 1
    }
        
    public getDislikes(): number {
        return this.dislikes
    }

    public setDislikes(value: number): void {
        this.dislikes = value
    }

    public getCreatedAt(): string {
        return this.createdAt
    }

    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public getUpdatedAt(): string {
        return this.updatedAt
    }

    public setUpdatedAt(value: string): void {
        this.updatedAt = value
    }
    
    public getCreatorId(): string {
        return this.creatorId
    }

    public setCreatorId(value: string): void {
        this.creatorId = value
    }
    
    public getCreatorNickName(): string {
        return this.creatorNickName
    }

    public setCreatorNickName(value: string): void {
        this.creatorNickName = value
    }

    public getPostId(): string {
        return this.postId
    }

    public setPostId(value: string): void {
        this.postId = value
    }
    
    public getPostCreatorId(): string {
        return this.postCreatorId
    }

    public setPostCreatorId(value: string): void {
        this.postCreatorId = value
    } 
    
    public getPostContent(): string {
        return this.postContent
    }

    public setPostContent(value: string): void {
        this.postContent = value
    }
    
    public getPostLikes(): number {
        return this.postLikes
    }

    public setPostLikes(value: number): void {
        this.postLikes = value
    }
    
    public getPostDislikes(): number {
        return this.postDislikes
    }

    public setPostDislikes(value: number): void {
        this.postDislikes = value
    }
    
    public getPostReplies(): number {
        return this.postReplies
    }

    public setPostReplies(value: number): void {
        this.postReplies = value
    }

    public getPostCreatedAt(): string {
        return this.postCreatedAt
    }

    public setPostCreatedAt(value: string): void {
        this.postCreatedAt = value
    }

    public getPostUpdatedAt(): string {
        return this.postUpdatedAt
    }

    public setPostUpdatedAt(value: string): void {
        this.postUpdatedAt = value
    }   

    public toDBModel(): CommentDB {
        return { id: this.id, creator_id: this.creatorId, content: this.content, likes: this.likes, dislikes: this.dislikes, created_at: this.createdAt, updated_at: this.updatedAt, post_id: this.postId } }

    public toBusinesModel(): PostWithCommentsModel {
        return {
            id: this.postId,
            content: this.postContent,
            likes: this.postLikes,
            dislikes: this.postDislikes,
            replies: this.postReplies,
            createdAt: this.postCreatedAt,
            updatedAt: this.postUpdatedAt,
            postCreator: {
                id: this.postCreatorId,
                nickName: this.creatorNickName
            },
            comments: {
                id: this.id,
                content: this.content,
                likes: this.likes,
                dislikes: this.dislikes,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
                creator: {
                    id: this.creatorId,
                    nickName: this.creatorNickName
                },
                postId: this.postId
            }
        }
    }
}
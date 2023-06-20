import { PostDatabase } from "../database/PostDatabase";
import { HashManager } from "../services/HashManager";
import { TokenManager } from "../services/TokenManager";
import { IdGenerator } from "../services/idGenerator";

export class PostBusiness{
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}
}
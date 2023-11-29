
import Post from "../db/models/post";

import {
    InvalidInputError,
    OriginalPostIdMissingError
} from "../errors";

import {
    CreatePostParams,
    PostType,
    Post as TSOAPostModel
} from "./models/posts-models";


export default  class PostService {

    public async createPost ( 
        userId: string,
        params: CreatePostParams
    ) : Promise<TSOAPostModel> {
         
        switch (params.type) {
            case PostType.post: {
                const newPost = await Post.create({ userId, 
                 text: params.text,
                 type: params.type,
                });
                return newPost.toJSON() as TSOAPostModel;
            }
                
            case PostType.repost:
            case PostType.reply: {
                if(!params.originalPostId || params.originalPostId == ""){
                    throw new OriginalPostIdMissingError();
                }
               
                const newPost = await Post.create({
                    userId,
                    text: params.text,
                    type: params.type,
                    originalPostId: params.originalPostId,
                });

                return newPost.toJSON() as TSOAPostModel;
            } 

        
            default:
                throw new InvalidInputError("type", "PostType");
        }

    }



}


import { StatusCodes } from "http-status-codes";
import PostsService from "../services/posts-service";

import {
  Body,
  Controller,
  OperationId,
  Post,
  Patch,
  Get,
  Delete,
  Request,
  Response,
  Route,
  Security,
  Tags,
  Path,
} from "tsoa";

import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import AuthenticatedUser from "../middleware/models/authenticated-user";
import {
  CreatePostParams,
  CreateReactionParams,
  Post as PostModel,
  Reaction as ReactionModel,
  Attachment as AttachmentModel
} from "../services/models/posts-models";
import PostService from "../services/posts-service";

@Route("/api/v1/posts")
@Tags("Posts")
export class PostsController extends Controller {
  /**
   * Creates a new post, allows you to reply to an existing post or simply repost the original post.
   * For replies and reposts, the original post ID must be specified.
   * For a new post, the original post ID will be ignored.
   */
  @Post("")
  @OperationId("createPost")
  @Security("jwt")
  @Response(StatusCodes.CREATED)
  @Response(StatusCodes.BAD_REQUEST, "Original post ID is missing")
  public async createPost(
    @Request() request: ExpressRequest,
    @Body() body: CreatePostParams
  ): Promise<PostModel> {
    const user = request.user as AuthenticatedUser;
    return new PostsService().createPost(user.id, body);
  }

   

  @Post("/react/{postId}")
  @OperationId("reactToPost")
  @Security("jwt")
  @Response(StatusCodes.CREATED)
  @Response(StatusCodes.NOT_FOUND, "Post not found")
  public async reactToPost(
    @Path() postId: string,
    @Request() request: ExpressRequest,
    @Body() body: CreateReactionParams
  ): Promise<ReactionModel>{
    const user = request.user as AuthenticatedUser;
    const userId = user.id;
    return new PostService().reactToPost(userId, postId, body);

  }


  @Delete("/react/{postId}")
  @OperationId("reactToPost")
  @Security("jwt")
  @Response(StatusCodes.CREATED)
  @Response(StatusCodes.NOT_FOUND, "Reaction not found")
  public async unreactToPost(
    @Path() postId: string,
    @Request() request: ExpressRequest
  ): Promise<ReactionModel>{
    const user = request.user as AuthenticatedUser;
    const userId = user.id;
    return new PostService().unreactToPost(userId, postId);

  }


   
  @Patch("/{postId}")
  @OperationId("attachToPost")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.INTERNAL_SERVER_ERROR, "Could not attach photo to post")
  @Response(StatusCodes.NOT_FOUND, "Post not found")
  public async attachToPost(
    @Path() postId: string,
    @Request() request: ExpressRequest
  ): Promise<AttachmentModel>{
    const user = request.user as AuthenticatedUser;
    const userId = user.id;
    return new PostService().attachToPost(userId, postId, request as any);
  }


  
  @Get("/attachment/{postId}")
  @OperationId("getPostAttachment")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.NOT_FOUND,"Photo not found")
  public async getPostAttachment(
    @Path() postId: string,
    @Request() request: ExpressRequest
  ): Promise<void>{
    const photoInfo = await new PostService().getPostAttachment(postId);
    const response = request.res  as ExpressResponse;

    return new Promise<void>((resolve, reject)=>{
       response.sendFile(photoInfo.photoName, photoInfo.options,(err)=>{
        if(err){
          reject(err);
        }else{
          resolve();
        }
       });
    });
  }


  /**
   * Deletes a post belonging to the current user.
   */
  @Delete("/{postId}")
  @OperationId("deletePost")
  @Security("jwt")
  @Response(StatusCodes.OK, "Post deleted")
  @Response(StatusCodes.NOT_FOUND, "Post not found")
  public async deletePost(
    @Path() postId: string,
    @Request() request: ExpressRequest
  ): Promise<PostModel> {
    const user = request.user as AuthenticatedUser;
    const userId = user.id;
    return new PostsService().deletePost(userId, postId);
  }
}


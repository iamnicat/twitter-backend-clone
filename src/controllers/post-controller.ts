

import { StatusCodes } from "http-status-codes";
import PostsService from "../services/posts-service";

import {
  Body,
  Controller,
  OperationId,
  Post,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";

import { Request as ExpressRequest } from "express";
import AuthenticatedUser from "../middleware/models/authenticated-user";
import {
  CreatePostParams,
  Post as PostModel,
} from "../services/models/posts-models";

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
}


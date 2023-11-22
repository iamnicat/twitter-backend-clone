import { StatusCodes } from "http-status-codes";
import {
  Body,
  Controller,
  Get,
  OperationId,
  Path,
  Post,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";
import { Profile } from "../services/models/profile-models";
import ProfileService from "../services/profile-service";
import { Request as ExpressRequest } from "express";

@Route("/api/v1/profile")
@Tags("Profile")
export class ProfileController extends Controller {
  
  @Response(StatusCodes.OK)
  @Get("info/{userId}")
  @OperationId("getProfile")
  @Security("jwt")
  public async get(@Path() userId: string): Promise<Profile> {
    this.setStatus(StatusCodes.OK);
    return new ProfileService().get(userId);
  }


  @Response(StatusCodes.OK)
  @Post("info")
  @OperationId("setProfile")
  @Security("jwt")
  public async setProfile(
    @Request() request: ExpressRequest,
    @Body() requestBody: Profile
  ) : Promise<Profile>{
    this.setStatus(StatusCodes.OK);
    const user = request.user as { id: string};
    return new ProfileService().set(user.id, requestBody);
  }

}
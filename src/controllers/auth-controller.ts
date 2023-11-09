import { StatusCodes } from "http-status-codes";

import { Body, Controller, Delete, OperationId, Post, Route, Tags, Security, Request } from "tsoa";

import {
  LoginParams,
  UserAndCredentials,
  UserCreationParams,
  RefreshParams,
} from "../services/models/auth-models";

import AuthService from "../services/auth-service";
import { Request as ExpressRequest } from "express";
import AuthenticatedUser from "src/middleware/models/authenticated-user";
@Route("/api/v1/auth")
@Tags("Auth")
export class AuthController extends Controller {
  @Post("register")
  @OperationId("registerUser")
  public async register(
    @Body() requestBody: UserCreationParams
  ): Promise<UserAndCredentials> {
    this.setStatus(StatusCodes.CREATED);
    return new AuthService().register(requestBody);
  }


  // TODO: remove this dummy endpoint later when
  // we have proper endpoints that use our
  // authentication mechanism
  @Post("dummy")
  @OperationId("dummy")
  @Security("jwt")
  public async dummy(): Promise<void> {
    this.setStatus(StatusCodes.OK);
    return Promise.resolve();
  }

  @Post("login")
  @OperationId("loginUser")
  public async login(
    @Body() requestBody: LoginParams
  ): Promise<UserAndCredentials>{
    this.setStatus(StatusCodes.OK);
    return new AuthService().login(requestBody);
  }


  
  @Delete()
  @Security("jwt")
  @OperationId("logoutUser")
  public async logout(@Request() request: ExpressRequest): Promise<void> {
    this.setStatus(StatusCodes.NO_CONTENT);
    const user = request.user as { jti: string };
    await new AuthService().logout(user.jti);
  }


  @Post("refresh")
  @Security("jwt_without_verification")
  @OperationId("refreshUser")
  public async refresh(
    @Request() request: ExpressRequest,
    @Body() requestBody: RefreshParams
  ): Promise<UserAndCredentials> {
    this.setStatus(StatusCodes.OK);
    const user = request.user as AuthenticatedUser;
    return new AuthService().refresh(requestBody, user);
  }

}




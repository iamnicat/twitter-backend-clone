import { StatusCodes } from "http-status-codes";

import { Body, Controller, OperationId, Post, Route, Tags } from "tsoa";

import {
  UserAndCredentials,
  UserCreationParams,
} from "../services/models/auth-models";

import AuthService from "../services/auth-service";

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
}
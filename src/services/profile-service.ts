import Profile from "../db/models/profile";
import { 
    Profile as ProfileModel,
    ProfilePhotoInfo 
       } from "./models/profile-models";
import { UploadedFile } from "express-fileupload";
import { mkdir, stat, unlink } from "node:fs/promises";
import {
  getProfilePhotosRootDir,
  getUserIdProfilePhotoPath,
  getUserIdProfilePhotoName,
} from "../controllers/utils";

import { 
    InvalidMimeTypeError,
    PhotoNotFoundError,
    UserProfileNotFoundError,   
} from "../errors";

export default class ProfileService{
 
   public async get(userId: string) : Promise<ProfileModel>{
    const profile = await Profile.findOne( {userId} );
    if(!profile){
        throw new UserProfileNotFoundError();
    }
    return profile.toJSON() as ProfileModel;
   }


   public async set(
    userId: string,
    profileModel: ProfileModel
   ) : Promise<ProfileModel>{
    const profile = await Profile.findOneAndUpdate(
        { userId },
        {
            userId,
            bio: profileModel.bio,
            location: profileModel.location,
            website: profileModel.website
        },
        { upsert: true, new: true, runValidators: true}
    );
    return profile.toJSON() as ProfileModel
   }

   public async setPhoto(
    userId: string,
    req: { files: { photo: UploadedFile  } }
   ): Promise<void> {

    const { photo } = req.files;

    if(photo.mimetype != "image/jpeg"){
        throw new InvalidMimeTypeError();
    }

    const uploadDir = getProfilePhotosRootDir();
    const uploadPath = getUserIdProfilePhotoPath(userId);

    return new Promise<void>(async (resolve, reject) => {
          
        try {
             await mkdir(uploadDir, {recursive: true});
             await photo.mv(uploadPath);
             resolve();
        } catch  {
            reject();
        }

    });

   }
    
    
    public async getPhoto (userId: string) : Promise<ProfilePhotoInfo> {
        
        const photoPath = getUserIdProfilePhotoPath(userId);

        try {
            const status = await stat(photoPath);
            const  isFile =  status.isFile();
            
            if(!isFile){
                throw new Error();
            }

            const photoName = getUserIdProfilePhotoName(userId);
            const options = {
                root: getProfilePhotosRootDir(),
                dotFiles: "deny",
                headers: {
                    "x-timestamp": Date.now(),
                    "x-sent": true,
                },
            };
            return {
                photoName,
                options,
            };

        } catch  {
             throw new PhotoNotFoundError();
        }



        
    }


    public async deletePhoto (userId: string) : Promise<void>{

    const photoPath = getUserIdProfilePhotoPath(userId);


     try {
        await unlink(photoPath);
     } catch  {
        throw new PhotoNotFoundError();
     }

    }


}
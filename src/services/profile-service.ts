import Profile from "../db/models/profile";
import { UserProfileNotFoundError } from "../errors";
import { Profile as ProfileModel } from "./models/profile-models";

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

}
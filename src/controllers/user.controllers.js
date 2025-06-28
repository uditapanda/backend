import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {User} from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    //get user details from frontend

    if (!req.body) {
       throw new ApiError(400, "No data received in request body"); //to give error if user sent nothing
    }


    const {fullName, username, email, password} = req.body
    //console.log("email:", email);

    //validation (not empty, valid email)

    /*if (fullName === ""){
        throw new ApiError(400, "Full name is required")
    }*/
    if ([fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "ALL FIELDS ARE REQUIRED!!")
    }

    if(typeof email !== "string" || !email.includes("@") || !email.includes(".")){
        throw new ApiError(400, "Please enter a valid email address")
    }

    //check if user already exists: check either email or username or both
    
    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    })  

    console.log("Checking for existing user with:", { email, username });

    
    if (existingUser) {
        throw new ApiError(409, "User already exists with this email or username")
    }

    //check for avatar n images


    const avatarLocalPath = req.files?.avatar[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    let coverImageLocalPath;
    if(
       req.files && 
       Array.isArray(req.files.coverImage) &&
       req.files.coverImage.length > 0
       ){
        coverImageLocalPath = req.files.coverImage[0].path
    }



    //if exists, upload them to cloudinary, avatar check too

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    } 


    //create user object, create entry in database

    const user = await User.create({
        fullname: fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //check if user is created successfully
    
    const createdConfirmedUser = await User.findById(user._id).select(
        "-password -refreshToken" //remove password and refreshtoken field from response
    )

    //check for user creation

    if(!createdConfirmedUser){
        throw new ApiError(500, "User creation failed while registering")
    }

    //return response

    return res.status(201).json(
        new ApiResponse(200, createdConfirmedUser, "User created successfully")
    )

})

export { registerUser };
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { Video } from "../models/video.model.js";


const uploadVideo = asyncHandler( async (req, res) => {
    const { title, description, isPublished } = req.body

    if (
        [title, description, isPublished].some(field => field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if (!videoLocalPath && !thumbnailLocalPath) {
        throw new ApiError(400, "video file and thumbnail is required")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        owner: req.user._id,
        title, 
        description,
        duration: videoFile.duration.toFixed(2),
        isPublished,
    })

    if (!video) {
        throw new ApiError(500, "Something went wrong while uploading video")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "video uploaded successfully"))

})

const getVideoByTitle = asyncHandler( async (req, res) => {
    const title = req.params.title

    if (!title) {
        throw new ApiError(400, "invalid request")
    }

    const video = await Video.findOne({title})

    req.body = video

    return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully"))

})


export {
    uploadVideo,
    getVideoByTitle,
}

/*

    get data from user
    validation: non empty

*/
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 3, query, sortBy, sortType, userId } = req.query

    let matchStage = {}
    if (query) {
        matchStage = { $match: { $text: { $search: query } } }
    }
    if (userId) {
        matchStage = { $match: { userId } }
    }

    let sortStage = {}
    if (sortBy && sortType) {
        sortStage = { $sort: { [sortBy]: sortType === 'asc' ? 1 : -1 } }
    }
    else{
        sortStage = { $sort: { createdAt: -1 } }
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    }

    const allVideos = await Video.aggregatePaginate([ matchStage, sortStage ], options)

    return res
    .status(200)
    .json(new ApiResponse(200, {allVideos, total: allVideos.length}, "videos fetched successfully"))

})

const publishAVideo = asyncHandler( async (req, res) => {
    const { title, description } = req.body

    if (!title && !description) {
        throw new ApiError(401, "title or desciption field is required")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if (!videoLocalPath) {
        throw new ApiError(400, "video file is required")
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!video) {
        throw new ApiError(400, "something went wrong while uploading video on cloudinary")
    }

    const videoFile = await Video.create({
        videoFile: video.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: video.duration.toFixed(2),
        isPublished: true,
        owner: req.user._id
    })

    return res
    .status(200)
    .json(new ApiResponse(200, videoFile, "video uploaded successfully"))

})

const getVideoById = asyncHandler( async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "video not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully"))

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    let videoLocalPath;

    if (req.files && Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0) {
        videoLocalPath = req.files.videoFile[0].path
    }

    let thumbnailLocalPath;

    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailLocalPath = req.files.thumbnail[0].path
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    const videoFile = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: req.body?.title,
                description: req.body?.description,
                video: video?.url,
                thumbnail: thumbnail?.url
            }
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, videoFile, "video updated successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(401, 'video not found')
    }

    await Video.findByIdAndDelete(video._id)
    
    return res
    .status(200)
    .json(new ApiResponse(200, {}, "video deleted successsfully"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)

    if (!video){
        throw new ApiError(404, "video not found")
    }


    video.isPublished = !video.isPublished
    await video.save({ validateBeforeSave: false })

    return res
    .status(200)
    .json(new ApiResponse(200, video, 'video updated successfully'))

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
}
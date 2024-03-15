import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const toggleVideoLike = asyncHandler( async(req, res) => {
    const { videoId } = req.params

    try {
        const isLiked = await Like.findOne({
            $and: [{ video: videoId }, { likedBy: req.user._id }]
        })

        console.log(isLiked);
    
        if (!isLiked) {
            const videoLike = await Like.create({
                video: videoId,
                likedBy: req.user._id
            })

            return res
            .status(200)
            .json(new ApiResponse(200, videoLike, "video liked"))

        }else{
            await Like.findOneAndDelete({
                $and: [{ video: videoId }, { likedBy: req.user._id }]
            })
            
            return res
            .status(200)
            .json(new ApiResponse(200, {}, "video unliked"))
        }
    } catch (error) {
        throw new ApiError(500, error.message || "internal server error")
    }
    
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    try {
        
        const isLiked = await Like.findOne({
            $and: [{ comment: commentId }, { likedBy: req.user._id }]
        })

        console.log(isLiked);

        if (!isLiked) {
            const commentLike = await Like.create({
                comment: commentId,
                likedBy: req.user._id,
            })

            return res
            .status(200)
            .json(new ApiResponse(200, commentLike, "comment liked"))

        }else{
            await Like.findOneAndDelete({
                $and: [{ comment: commentId }, { likedBy: req.user._id }]
            })

            return res
            .status(200)
            .json(new ApiResponse(200, {}, "comment unliked"))
        }

    } catch (error) {
        throw new ApiError(500, error.message || "internal server error")
    }

})

const toggleTweetLike = asyncHandler( async (req, res) => {
    const { tweetId } = req.params

    try {
        const isLiked = await Like.findOne({
            $and: [{ tweet: tweetId }, { likedBy: req.user._id }]
        })

        if (!isLiked) {
            const tweetLike = await Like.create({
                tweet: tweetId,
                likedBy: req.user._id,
            })

            return res
            .status(200)
            .json(new ApiResponse(200, tweetLike, "tweet liked"))

        }else{
            await Like.findOneAndDelete({
                $and: [{ tweet: tweetId }, { likedBy: req.user._id }]
            })

            return res
            .status(200)
            .json(new ApiResponse(200, {}, "tweet unliked"))
        }
        
    } catch (error) {
        throw new ApiError(500, error.message || "internal server error")
    }

})

const getLikedVideos = asyncHandler( async (req, res) => {
    
    const aggregatePipeline = [
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: 'videos',
                localField: 'video',
                foreignField: '_id',
                as: 'likedVideos'
            }
        },
        {
            $unwind: '$likedVideos'
        },
        {
            $replaceRoot: {
                newRoot: "$likedVideos"
            }
        }
    ]

    const likedVideos = await Like.aggregate(aggregatePipeline)

    if (likedVideos.length === 0) {
        return res
        .status(200)
        .json(new ApiResponse(200, {}, "no videos liked"))
    }


    return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "videos fetched successfully"))

})

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos,
}
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js'
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const getVideoComments = asyncHandler( async (req, res) => {
    const { page = 1, limit = 3,  } = req.query
    const { videoId } = req.params

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    }

    const comments = await Comment.aggregatePaginate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
    ], options)

    return res
    .status(200)
    .json(new ApiResponse(200, comments, "comments fetchec successfully"))

})


const addComment = asyncHandler( async (req, res) => {
    const { content } = req.body
    const { videoId } = req.params

    if (!content) {
        throw new ApiError(400, "content is required")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    if (!comment) {
        throw new ApiError(500, "something went wrong while creating comment")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment added successfully"))

})

const updateComment = asyncHandler( async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "content is required")
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content,
            }
        },
        {
            new: true,
        }
    )

    if(!comment){
        throw new ApiError(500, "something went wrong while updating comment")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment updated successfully"))

})

const deleteComment = asyncHandler( async (req, res) => {
    const { commentId } = req.params

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(401, "comment not found")
    }

    await Comment.findByIdAndDelete(comment._id)

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "comment deleted successfully"))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
}
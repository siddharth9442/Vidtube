import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const updateViewsCount = async (req, res, next) => {
    const video = await Video.findOne({ title: req.params.title})

    if (!video) {
        throw new ApiError(400, "video not found")
    }

    video.views++
    await video.save({ validateBeforeSave: false })

    return res
    .status(200)
    .json(new ApiResponse(200, video, "views updated successfully"))
}

export {
    updateViewsCount
}
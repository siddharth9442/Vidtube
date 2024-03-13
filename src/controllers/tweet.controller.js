import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUserTweets = asyncHandler( async (req, res) => {
    const { userId } = req.params

    const allTweets = await Tweet.find({ owner: userId })

    if (!allTweets) {
        throw new ApiError(401, "no tweets found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, allTweets, "all tweets fetched successfully"))

})

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "content is required")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    if (!tweet) {
        throw new ApiError(500, "something went wrong while creating tweet")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "tweet created successfully"))

})

const updateTweet = asyncHandler( async (req, res) => {
    const { tweetId } = req.params
    const { content } = req.body

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content,
            }
        },
        {
            new: true
        }
    )

    if (!tweet) {
        throw new ApiError(500, "something went wrong while updating tweet")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "tweet updated successfully"))

})

const deleteTweet = asyncHandler( async (req, res) => {
    const { tweetId } = req.params

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(401, "no tweet found")
    }

    await Tweet.findOneAndDelete(tweet._id)

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "tweet deleted successfully"))

})

export {
    createTweet,
    updateTweet,
    deleteTweet,
    getUserTweets,
}
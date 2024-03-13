import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    try {
        const isSubscribed = await Subscription.findOne({
            $and: [{ channel: channelId }, { subscriber: req.user._id }]
        })

        if (isSubscribed) {
            const channel = await Subscription.findOneAndDelete({
                $and: [{ channel: channelId }, { subscriber: req.user._id }]
            })
    
            return res
            .status(200)
            .json(new ApiResponse(200, { channel }, "channel unsubscribed successfully"))
        }
        else{
            const channelSubscription = await Subscription.create({
                subscriber: req.user._id,
                channel: channelId
            })
    
            return res
            .status(200)
            .json(new ApiResponse(200, { channelSubscription }, "channel subscribed successfully"))
        }
    } catch (error) {
        throw new ApiError(500, "internal server error")
    }

})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    const channelSubscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'subscriber',
                foreignField: '_id',
                as: 'subscriberDetails',
                
            },
        },
        {
            $unwind: '$subscriberDetails'
        },
        {
            $project: {
                _id: '$subscriberDetails._id',
                username: '$subscriberDetails.username',
                email:  '$subscriberDetails.email',
            }
        }
    ])

    if (!channelSubscribers) {
        throw new ApiError(400, "no subscribers found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, channelSubscribers, "subscribers fetched successfully"))

})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const subscribedChannel = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'channel',
                foreignField: '_id',
                as: 'channelDetails'
            }
        },
        {
            $unwind: '$channelDetails'
        },
        {
            $project: {
                _id: '$channelDetails._id',
                username: '$channelDetails.username',
                email: '$channelDetails.email'
            }
        }
    ])

    if (!subscribedChannel) {
        throw new ApiError(401, 'no channel is subscribed')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, subscribedChannel, "subscribed channels fetched successfully"))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
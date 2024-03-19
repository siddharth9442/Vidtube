import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from '../models/like.model.js';
import { Subscription } from '../models/subscription.model.js'

const getChannelStats = asyncHandler(async (req, res) => {

    try {
        const channelId = req.user._id
    
        const totalVideos = await Video.countDocuments({ owner: channelId })
    
        const totalViews = await Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: '$views' }
                }
            },
        ])
    
        const totalLikes = await Like.countDocuments({
            video: {
                $in: await Video.find({ owner: channelId }).distinct('_id')
            }
        })
    
        // const subscriptionStats = await User.aggregate([
        //     {
        //         $match: {
        //             _id: new mongoose.Types.ObjectId(channelId)
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'subscriptions',
        //             localField: '_id',
        //             foreignField: 'channel',
        //             as: 'subscribers'
        //         }
        //     },
        //     {
        //         $addFields: {
        //             totalSubscribers: {
        //                 $size: '$subscribers'
        //             }
        //         }
        //     }
        // ])
    
        const subscribers = await Subscription.countDocuments({ channel: channelId })
    
        const stats = {
            totalVideos: totalVideos,
            totalViews: totalViews[0]?.totalViews,
            totalLikes: totalLikes,
            subscribers: subscribers,
        }
    
        return res
        .status(200)
        .json(new ApiResponse(200, stats, "channel stats fetched successfully"))
    } catch (error) {
        throw new ApiError(500, error.message || "Internal server error")
    }

})

export {
    getChannelStats,
}
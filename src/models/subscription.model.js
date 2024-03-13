import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref: "User", 
    }
}, { timestamps: true })


subscriptionSchema.static('isSubscribed', async function(channelId, userId){
    const isSubscribed = await this.findOne({
        $and: [{ channel: channelId }, { subscriber: userId }]
    })

    if (!isSubscribed) {
        return null
    }

    return isSubscribed

})



export const Subscription = mongoose.model("Subscription", subscriptionSchema)
import mongoose, { Schema } from "mongoose";
import { string } from "prop-types";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: string,
        required: true,
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

export const Playlist = mongoose.model('Model', playlistSchema)
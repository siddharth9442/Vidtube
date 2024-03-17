import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from '../models/video.model.js'

const createPlaylist = asyncHandler( async (req, res) => {
    const { name, description } = req.body

    if (!name || !description) {
        throw new ApiError(401, "name or description is required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    if (!playlist) {
        throw new ApiError(500, "something went wrong while creating playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist created successfully"))

})

const getUserPlaylists = asyncHandler( async (req, res) => {
    const { userId } = req.params

    const playlists = await Playlist.find({ owner: userId })

    if (!playlists) {
        throw new ApiError(401, "no playlist found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlists, "user playlists fetched successfully"))

})

const getPlaylistById = asyncHandler( async (req, res) => {
    const { playlistId } = req.params

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, 'playlist not found')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist fetched successfully"))

})

const addVideoToPlaylist = asyncHandler( async (req, res) => {
    const { playlistId, videoId } = req.params

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "playlist not found")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "no video found")
    }

    if (playlist.video.includes(video._id)) {
        throw new ApiError(401, "video already exist")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist._id,
        {
            $push: {
                video: [ video._id ]
            }
        },
        {
            new: true
        }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500, "error while adding video to playlist")
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "video added successfully")) 

})

const removeVideoFromPlaylist = asyncHandler( async (req, res) => {
    const { playlistId, videoId } = req.params

    const playlist = await Playlist.findById(playlistId)

    const index = playlist.video.indexOf(videoId)

    if (!playlist) {
        throw new ApiError(500, "error while removing video from playlist")
    }

    if(index !== -1){
        playlist.video.splice(index, 1)
    }

    await playlist.save()

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "video removed successfully"))

})

const deletePlaylist = asyncHandler( async (req, res) => {
    const { playlistId } = req.params

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, 'playlist not found')
    }

    await Playlist.findByIdAndDelete(playlist._id)

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "playlist deleted successfully"))
    
})

const updatePlaylist = asyncHandler( async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!name || !description) {
        throw new ApiError(401, "update fields are required")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "playlist not found")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name,
                description
            }
        },
        {
            new: true
        }
    )

    if (!updatedPlaylist) {
        throw new ApiError(505, "error while updating playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "playlist updated"))

})


export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
}
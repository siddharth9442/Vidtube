import { Router } from 'express'
import { 
    addVideoToPlaylist,
    createPlaylist, 
    deletePlaylist, 
    getPlaylistById, 
    getUserPlaylists, 
    removeVideoFromPlaylist,
    updatePlaylist
} from '../controllers/playlist.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(verifyJWT)

router.route('/create-playlist').post(createPlaylist)

router.route('/user/:userId').get(getUserPlaylists)

router
    .route('/:playlistId')
    .get(getPlaylistById)
    .post(deletePlaylist)
    .patch(updatePlaylist)

// router.route('/:playlistId').post(deletePlaylist)

// router.route('/:playlistId').post(updatePlaylist)

router.route('/add-video/:videoId/:playlistId').post(addVideoToPlaylist)

router.route('/remove-video/:videoId/:playlistId').post(removeVideoFromPlaylist)

export default router
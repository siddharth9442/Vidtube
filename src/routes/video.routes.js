import { Router } from 'express'
import { 
    deleteVideo, 
    getAllVideos, 
    getVideoById, 
    publishAVideo, 
    togglePublishStatus, 
    updateVideo 
} from '../controllers/Video.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

router.route('/upload-video').post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
)

router.route('/all-videos').get(verifyJWT, getAllVideos)

router.route('/:videoId').get(verifyJWT, getVideoById)

router.route('/update-video/:videoId').patch(
    verifyJWT,
    upload.fields([
        {
            name: 'videoFile',
            maxCount: 1,
        },
        {
            name: 'thumbnail',
            maxCount: 1
        }
    ]),
    updateVideo
)

router.route('/delete-video/:videoId').delete(verifyJWT, deleteVideo)

router.route('/toggle-publish/:videoId').put(verifyJWT, togglePublishStatus)


export default router;
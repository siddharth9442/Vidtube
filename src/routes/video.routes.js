import { Router } from 'express'
import { getVideoByTitle, uploadVideo } from '../controllers/Video.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { updateViewsCount } from '../middlewares/views.middleware.js'

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
    uploadVideo
)

router.route('/:title').get(verifyJWT, updateViewsCount, getVideoByTitle)

export default router;
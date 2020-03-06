import * as express from 'express'
import * as path from 'path'
import * as controllers from './controllers/web'

const router = express.Router()

router.use("/auth/accept", controllers.accept)
router.use("/auth", controllers.redirectStravaAuth)

// Serve frontend content
router.use("/", express.static(path.join(__dirname, 'web/public')))

export default router
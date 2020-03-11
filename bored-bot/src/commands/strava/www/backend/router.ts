import * as controllers from './WebControllers'
import * as express from 'express'
import * as path from 'path'

// Where the front-end static files are located
const PUBLIC_PATH = path.join(__dirname, '../frontend/public')

const router = express.Router()

router.get("/auth", controllers.redirectStravaAuth)
router.post("/auth/accept", controllers.acceptStravaCode)

router.post("/webhook", controllers.postActivity)

// Serve frontend content
router.use("/", express.static(PUBLIC_PATH))

export default router
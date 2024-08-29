import { logger } from "./application/logging.js"
import { web } from "./application/web.js"

web.listen(3000, () => {
    logger.info('server running on port Localhost:3000')
})
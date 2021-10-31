const router = require('express').Router()
const homeRoutes = require('./home-routes')
const dashRoutes = require('./dash-routes.js')
const apiRoutes = require('./api/index.js')

router.use('/', homeRoutes)
router.use('/dash', dashRoutes)
router.use('/api', apiRoutes)

module.exports = router;

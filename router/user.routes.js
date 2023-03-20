import express from 'express'

import userController from '../controllers/user.controller.js'

const router = express.Router()

router.route('/register').post(userController.register)
router.route('/login').post(userController.login)
router.route('/logout').get(userController.logout)
router.route('/refresh').get(userController.refresh)

export default router

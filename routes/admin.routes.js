const Router = require('express')
const router = new Router()
const adminController = require('../controller/admin.controller')

router.get('/profile/admin/:id', adminController.getAdminInfo)

router.get('/projects', adminController.getAllProjects)
router.get('/project/:id', adminController.getProjectById)
router.get('/admin/teams', adminController.getAllTeams)

router.post('/project/task/:id', adminController.addTaskToProject)
module.exports = router


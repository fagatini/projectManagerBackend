const Router = require('express')
const router = new Router()
const customerController = require('../controller/customer.controller')

router.get('/profile/customer/:id', customerController.getCustomerInfo)
router.post('/profile/customer/:id', customerController.editCustomerInfo)

router.get('/profile/customer/projects/:id', customerController.getMyProjects)

router.get('/project/:id', customerController.getProjectById)
router.post('/project', customerController.createProject)
router.put('/project/:id', customerController.changeProject)

router.get('/project/task/:id', customerController.getProjectTasks)

module.exports = router
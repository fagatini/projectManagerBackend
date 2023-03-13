const Router = require('express')
const router = new Router()

const employeeController = require('../controller/employee.controller')

router.get('/employee/profile/:id', employeeController.getEmployeeInfo)
router.post('/employee/profile/:id', employeeController.editEmployeeInfo)
router.get('/employee/tasks/:id', employeeController.getMyTasks)

router.post('/employee/task/:id', employeeController.getTaskDone)

module.exports = router

const Router = require('express')
const router = new Router()
const emplGroupController = require('../controller/emplGroup.controller')

router.get('/profile/employee/teams/:id', emplGroupController.getMyTeams)
router.get('/group/:id', emplGroupController.getGroupInfo)

router.post('/group', emplGroupController.createGroup)
router.put('/group/:id', emplGroupController.changeGroup)
router.put('/profile/employee/teams/:id', emplGroupController.leaveFromTeam)
router.delete('/group/:id', emplGroupController.deleteGroup)

router.get('/employee', emplGroupController.getAllEmployee)
router.post('/employee', emplGroupController.inviteEmployeeToGroup)

module.exports = router

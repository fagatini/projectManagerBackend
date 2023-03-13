const Router = require('express')
const router = new Router()
const accountController = require('../controller/account.controller')

router.post('/login', accountController.login)
router.post('/employee_reg', accountController.employee_reg)
router.post('/customer_reg', accountController.customer_reg)

module.exports = router

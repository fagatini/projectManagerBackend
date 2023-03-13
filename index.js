const express = require('express')

const accountRouter = require('./routes/account.routes')
const adminRouter = require('./routes/admin.routes')
const customerRouter = require('./routes/customer.routes')
const emplGroupRouter = require('./routes/emplGroup.routes')
const employeeRouter = require('./routes/employee.routes')

const PORT = process.env.PORT||8080
 
const app = express()

var cors = require("cors");
app.use(cors({ origin: "*" }));

app.use(express.static(__dirname));

app.use(express.json())
app.use("/app", accountRouter)
app.use("/app", adminRouter)
app.use("/app", customerRouter)
app.use("/app", emplGroupRouter)
app.use("/app", employeeRouter)

app.listen(PORT, () => console.log(`server started on post ${PORT}`));
const db = require('../db')

class EmployeeController {
    async getEmployeeInfo(req,res) {
        const id = req.params.id
        const account = await db.query(`SELECT * FROM account WHERE account_id = $1`, [id])
        const empl = await db.query(`SELECT * FROM Employee WHERE account_id = $1`, [id])
        res.json({employeeData: empl.rows[0], accountData: account.rows[0]})
    }

    async editEmployeeInfo(req,res) {
        const account_id = req.params.id;
        const { login, email, password, first_name, midle_name, second_name, post, experience } = req.body;

        const data = await db.query(
            `SELECT * FROM Account WHERE email = $1 and account_id != $2;`,
            [email, account_id]
        );

        const arr = data.rows;
        if (arr.length != 0) {
            return res.json({
                error: "Email is already used",
            });
        } else {
            const updatedAccount = await db.query(
                `UPDATE Account SET (login, email, password) = ($1, $2, $3) where account_id = $4`,
                [login, email, password, account_id]
            );
            const updatedEmployee = await db.query(
                `UPDATE Employee SET (first_name, midle_name, second_name, post, experience) = ($1, $2, $3, $4, $5) where account_id = $6`,
                [first_name, midle_name, second_name, post, experience,  account_id]
            );
        }
        res.json({message:"successed"})
    }

    async getMyTasks(req,res) {
        let acc_id = req.params.id
        let order_by = req.query.order_by
        let page_num = req.query.page_num
        let limit = req.query.limit
        let rowsToSkip = page_num * limit
        const projects = await db.query(
            `SELECT t.task_id, t.description, t.period, t.start_date, te.specialization, p.description as project_description FROM task t
            RIGHT JOIN Team te ON te.team_id = t.team_id
            RIGHT JOIN employee_in_team eit ON te.team_id = eit.team_id
            RIGHT JOIN Employee e ON e.employee_id = eit.employee_id
            RIGHT JOIN Account a ON e.account_id = a.account_id
            LEFT JOIN project p ON t.project_id = p.project_id
            WHERE a.account_id = $1 and t.state = 'in_progress'
            ORDER BY ${order_by} ASC LIMIT ${limit} OFFSET ${rowsToSkip}`,[acc_id])

        const count = await db.query(`SELECT count(task_id) FROM Task t
            RIGHT JOIN Team te ON te.team_id = t.team_id
            RIGHT JOIN employee_in_team eit ON te.team_id = eit.team_id
            RIGHT JOIN Employee e ON e.employee_id = eit.employee_id
            WHERE e.account_id = $1 and t.state = 'in_progress'`,[acc_id])
        res.json({rows:projects.rows, count: count.rows[0].count})
    }

    async getTaskDone(req, res) {
        console.log('re');
        const id = req.params.id
        const task = await db.query(
            "UPDATE task SET (state, start_date) = (\'done\', current_date) WHERE task_id = $1",
            [id]
        );
        res.json(task.rows[0]);
    }
}
module.exports = new EmployeeController()
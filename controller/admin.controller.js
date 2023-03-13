const db = require('../db')

class AdminController {
    async getAdminInfo(req, res) {
        const id = req.params.id
        const account = await db.query(`SELECT * FROM account WHERE account_id = $1`, [id])
        res.json(account.rows[0])
    }

    async getAllProjects(req, res) {
        let page_num = req.query.page_num
        let limit = req.query.limit
        let rowsToSkip = page_num * limit
        let search_text = req.query.search_text
        const projects = await db.query(`SELECT * FROM project WHERE title LIKE \'%${search_text}%\' ORDER BY project_id LIMIT ${limit} OFFSET ${rowsToSkip}`)
        const count = await db.query(`SELECT count(project_id) FROM project WHERE title LIKE \'%${search_text}%\'`)
        res.json({rows:projects.rows, count:count.rows[0].count})
    }

    async getProjectById(req, res) {
        const project_id = req.params.id
        const project = await db.query(
            `SELECT * FROM  project p 
        LEFT JOIN Customer c ON c.customer_id = p.customer_id
        LEFT JOIN Account a ON c.account_id = a.account_id
        WHERE project_id = $1`, [project_id])
        res.json(project.rows[0])
    }

    async addTaskToProject(req, res) {
        const { teamId, description, state, period, start_date } = req.body
        const projectId = req.params.id

        let taskId = await db.query(`SELECT max(task_id) FROM task`)
        taskId = taskId.rows[0].max + 1
        const task = await db.query(`INSERT INTO task VALUES($1,$2,$3,$4,$5,$6,$7)`, [taskId, teamId, projectId, description, state, period, start_date])
        res.json('successed')
    }

    async getAllTeams(req, res) {
        let page_num = req.query.page_num
        let limit = req.query.limit
        let rowsToSkip = page_num * limit
        let search_text = req.query.search_text
        const teams = await db.query(`SELECT * FROM team WHERE specialization LIKE \'%${search_text}%\' ORDER BY team_id LIMIT ${limit} OFFSET ${rowsToSkip}`)
        const count = await db.query(`SELECT count(team_id) FROM team WHERE specialization LIKE \'%${search_text}%\'`)
        res.json({rows:teams.rows, count:count.rows[0].count})
    }
}

module.exports = new AdminController()

const db = require('../db')

class EmplGroupController {
    async getMyTeams(req, res) {
        const acc_id = req.params.id
        const projects = await db.query(
            `SELECT te.team_id, te.specialization FROM Team te
            RIGHT JOIN employee_in_team eit ON te.team_id = eit.team_id
            RIGHT JOIN Employee e ON e.employee_id = eit.employee_id
            RIGHT JOIN Account a ON e.account_id = a.account_id
            WHERE a.account_id = $1
            ORDER BY te.team_id`,
            [acc_id])
        res.json(projects.rows)
    }

    async getGroupInfo(req, res) {
        const id = req.params.id
        const group = await db.query(`SELECT * FROM team WHERE team_id = $1`, [id])
        const members = await db.query(
            `SELECT * FROM Employee e
            RIGHT JOIN employee_in_team t ON t.employee_id = e.employee_id
            WHERE team_id = $1`, [id])
        res.json({
            mainInfo: group.rows[0],
            members: members.rows,
        });
    }

    async createGroup(req, res) {
        const { leader_acc_id, specialization } = req.body;
        const employeeId = await db.query('SELECT employee_id FROM employee WHERE account_id = $1', [leader_acc_id])
        let lead_id = employeeId.rows[0].employee_id

        let id = await db.query("SELECT max(team_id) FROM team");
        id = id.rows[0].max + 1;

        const newGroup = await db.query(
            `insert into team values ($1, $2)`,
            [id, specialization]
        );

        const newTeamMember = await db.query(
            `insert into employee_in_team values ($1, $2)`,
            [id, lead_id]
        );
        res.json({ team_id: id, specialization: specialization });
    }

    async deleteGroup(req, res) {
        const id = req.params.id
        const deletedMembers = await db.query(
            "DELETE FROM employee_in_team WHERE team_id = $1",
            [id]
        );
        const deletedTeam = await db.query(
            "DELETE FROM team WHERE team_id = $1",
            [id]
        );
        res.json(deletedTeam.rows[0]);
    }

    async changeGroup(req, res) {
        const { specialization } = req.body;
        const id = req.params.id
        const changedGroup = await db.query(
            "UPDATE team SET specialization = $2 WHERE team_id = $1",
            [id, specialization]
        );
        res.json(changedGroup.rows[0]);
    }

    async leaveFromTeam(req, res) {
        const acc_id = req.params.id
        const team_id = req.body.team_id
        const employeeId = await db.query('SELECT employee_id FROM employee WHERE account_id = $1', [acc_id])

        const empInTeam = await db.query(
            `DELETE FROM employee_in_team WHERE employee_id = $1 and team_id = $2`,
            [employeeId.rows[0].employee_id, team_id])
        res.json(empInTeam.rows[0])
    }

    async getAllEmployee(req, res) {
        let search_param = req.query.search_param
        let search_text = req.query.search_text
        let order_by = req.query.order_by
        let page_num = req.query.page_num
        let limit = req.query.limit
        let rowsToSkip = page_num * limit

        const empl = await db.query(`SELECT * FROM Employee 
        WHERE starts_with(${search_param}, \'${search_text}\')
        ORDER BY ${order_by} LIMIT ${limit} OFFSET ${rowsToSkip}`)

        const count = await db.query(`SELECT count(employee_id) FROM Employee WHERE starts_with(${search_param}, \'${search_text}\')`)
        res.json({ rows: empl.rows, count: count.rows[0].count })
    }

    async inviteEmployeeToGroup(req, res) {
        const { team_id, employee_id } = req.body

        const member = await db.query(`SELECT * FROM employee_in_team WHERE team_id = $1 and employee_id = $2`, [team_id, employee_id])
        if (member.rows.length === 0) {
            const newMember = await db.query(
                `insert into employee_in_team values ($1, $2)`,
                [team_id, employee_id]
            );
            res.json({message:'succes'})
        }
        else {
            res.json({error:'user already in team'})
        }
    }
}
    
module.exports = new EmplGroupController()

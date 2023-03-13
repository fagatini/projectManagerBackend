const db = require("../db");

class CustomerController {
    async getCustomerInfo(req, res) {
        const id = req.params.id;
        const account = await db.query(
            `SELECT * FROM account WHERE account_id = $1`,
            [id]
        );
        const customer = await db.query(
            `SELECT * FROM Customer WHERE account_id = $1`,
            [id]
        );
        res.json({ customerData: customer.rows[0], accountData: account.rows[0] });
    }

    async editCustomerInfo(req, res) {
        const account_id = req.params.id;
        const { login, email, password, first_name, second_name } = req.body;

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
            const updatedCustomer = await db.query(
                `UPDATE Customer SET (first_name, second_name) = ($1, $2) where account_id = $3`,
                [first_name, second_name, account_id]
            );
        }
        res.json({message:"successed"})
    }

    async getMyProjects(req, res) {
        const acc_id = req.params.id;
        const projects = await db.query(
            `SELECT p.project_id, p.title, p.description, p.priority FROM Project p
            LEFT JOIN Customer c ON c.customer_id = p.customer_id
            LEFT JOIN Account a ON c.account_id = a.account_id
            WHERE a.account_id = $1`,
            [acc_id]
        );
        res.json(projects.rows);
    }

    async getProjectById(req, res) {
        const project_id = req.params.id;
        const project = await db.query(
            `SELECT * FROM  project p 
            LEFT JOIN Customer c ON c.customer_id = p.customer_id
            LEFT JOIN Account a ON c.account_id = a.account_id
            WHERE project_id = $1`,
            [project_id]
        );
        res.json(project.rows[0]);
    }

    async getProjectTasks(req, res) {
        const project_id = req.params.id;
        const project = await db.query(
            `SELECT * FROM Task
        WHERE project_id = $1
        ORDER BY start_date`,
            [project_id]
        );
        res.json(project.rows);
    }

    async createProject(req, res) {
        const { accountId, title, description } = req.body;

        let customerId = await db.query(
            `SELECT customer_id FROM Customer WHERE account_id = $1`,
            [accountId]
        );
        customerId = customerId.rows[0].customer_id;

        let projectId = await db.query(`SELECT max(project_id) FROM project`);
        projectId = projectId.rows[0].max + 1;

        const project = await db.query(
            `INSERT INTO project VALUES($1,$2,$3,$4,null)`,
            [projectId, customerId, title, description]
        );
        res.json({
            project_id: projectId,
            title: title,
            description: description,
            priority: null,
        });
    }

    async changeProject(req, res) {
        const { id, title, description } = req.body;
        const project = await db.query(
            "UPDATE project SET description = $3, title = $2 WHERE project_id = $1",
            [id, title, description]
        );
        res.json("succes");
    }
}

module.exports = new CustomerController();

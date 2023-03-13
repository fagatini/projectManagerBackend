const db = require('../db')

class AccountController {
    async login(req,res){
        const { email, password } = req.body;
        try {
          const data = await db.query(
            `SELECT * FROM account WHERE email = $1;`,
            [email]
          );
          const user = data.rows;
          if (user.length === 0) {
            res.json({ error: "User is not exist" });
          } else {
              if (user[0].password == password) {
                res.json({
                  message: "User signed in",
                  id: user[0].account_id,
                  account_role: user[0].account_role,
                });
              } else {
                res.json({ error: "Incorrect password" });
              }
          }
        } catch (err) {
          res.status(500).json({ error: "database error" });
        }
    }
    
    async employee_reg(req,res){
      const {
        login,
        email,
        password,
        first_name,
        midle_name,
        second_name,
        post,
        experience
      } = req.body;
      try {
          let id = await db.query("SELECT max(account_id) FROM Account");
          id = id.rows[0].max + 1;
          const equalEmails = await db.query(`SELECT * FROM Account WHERE email = $1;`, [
            email
          ]);
          const equalLogins = await db.query(`SELECT * FROM Account WHERE login = $1;`, [
            login
          ]);
          if (equalEmails.rows.length != 0) {
            return res.json({
              error: "Email is already used",
          });
          } else if (equalLogins.rows.length != 0) {
            return res.json({
              error: "Login is already used",
            });
        } else {
          const newAccount = await db.query(
            `INSERT INTO Account values ($1, $2, $3, $4, $5);`,
            [
              id,
              login,
              email,
              password,
              'employee'
            ]
          );
          let emplId = await db.query("SELECT max(employee_id) FROM Employee");
          emplId = emplId.rows[0].max + 1;
          const newEmployee = await db.query(
            `INSERT INTO Employee values ($1, $2, $3, $4, $5, $6, $7);`,
            [
              emplId,
              id,
              first_name,
              midle_name,
              second_name,
              post,
              experience,
            ]
          );
          return res.json({
            message: "new user created",
            id: id,
          });
        }
      } catch (err) {
        res.status(500).json({ error: "database error" });
      }
    }

    async customer_reg(req,res){
      const {
        login,
        email,
        password,
        first_name,
        second_name,
      } = req.body;
      try {
          let id = await db.query("SELECT max(account_id) FROM Account");
          id = id.rows[0].max + 1;
          const equalEmails = await db.query(`SELECT * FROM Account WHERE email = $1;`, [
            email
          ]);
          const equalLogins = await db.query(`SELECT * FROM Account WHERE login = $1;`, [
            login
          ]);
          if (equalEmails.rows.length != 0) {
            return res.json({
              error: "Email is already used",
          });
          } else if (equalLogins.rows.length != 0) {
            return res.json({
              error: "Login is already used",
            });
        } else {
          const newAccount = await db.query(
            `INSERT INTO Account values ($1, $2, $3, $4, $5);`,
            [
              id,
              login,
              email,
              password,
              'customer'
            ]
          );
          let custlId = await db.query("SELECT max(customer_id) FROM customer");
          id = custlId.rows[0].max + 1;
          const newCustomer = await db.query(
            `INSERT INTO customer values ($1, $2, $3, $4);`,
            [
              custlId,
              id,
              first_name,
              second_name,
            ]
          );
          return res.json({
            message: "new user created",
            id: id,
          });
        }
      } catch (err) {
        res.status(500).json({ error: "database error" });
      }
    }
}

module.exports = new AccountController()
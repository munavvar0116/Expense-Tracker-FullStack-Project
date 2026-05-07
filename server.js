const express = require("express");
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {

        return res.sendStatus(401);

    }

    jwt.verify(token, "secretkey", (err, user) => {

        if (err) {

            return res.sendStatus(403);

        }

        req.user = user;

        next();

    });

}

const app = express();

app.use(express.static("public"));
app.use(express.json());


// HOME ROUTE
app.get("/", (req, res) => {
    res.send("Expense Tracker Backend Running 🚀");
});


// GET ALL EXPENSES
app.get("/expenses", authenticateToken, (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT * FROM expenses
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {

            console.log(err);

            res.status(500).send("Database Error");

        } else {

            res.json(result);

        }

    });

});


// ADD NEW EXPENSE
app.post("/expenses", authenticateToken, (req, res) => {

    const { title, amount } = req.body;

    const userId = req.user.id;

    const sql = `
        INSERT INTO expenses (title, amount, user_id)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [title, amount, userId], (err, result) => {

        if (err) {

            console.log(err);

            res.status(500).send("Database Error");

        } else {

            res.json({
                message: "Expense Added Successfully 🔥"
            });

        }

    });

});


// DELETE EXPENSE
app.delete("/expenses/:id", authenticateToken, (req, res) => {

    const expenseId = req.params.id;

    const userId = req.user.id;

    const sql = `
        DELETE FROM expenses
        WHERE id = ? AND user_id = ?
    `;

    db.query(sql, [expenseId, userId], (err, result) => {

        if (err) {

            console.log(err);

            res.status(500).send("Database Error");

        } else {

            res.json({
                message: "Expense Deleted Successfully"
            });

        }

    });

});
// REGISTER USER
app.post("/register", async (req, res) => {

    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";

    db.query(sql, [username, hashedPassword], (err, result) => {

        if (err) {
            console.log(err);
            res.status(500).send("Registration Failed");
        } else {
            res.json({
                message: "User Registered Successfully 🔥"
            });
        }

    });

});
// LOGIN USER
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], async (err, result) => {

        if (err) {
            console.log(err);
            res.status(500).send("Login Failed");
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { id: user.id },
            "secretkey",
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login Successful 🔥",
            token
        });

    });

});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
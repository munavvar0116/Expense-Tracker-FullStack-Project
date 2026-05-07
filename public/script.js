const token = localStorage.getItem("token");


// PROTECT DASHBOARD

if (!token) {

    window.location.href = "login.html";

}


// GET USER EXPENSES

async function getExpenses() {

    const response = await fetch("/expenses", {

        headers: {
            Authorization: `Bearer ${token}`
        }

    });

    const expenses = await response.json();

    const expenseList = document.getElementById("expense-list");

    expenseList.innerHTML = "";

    let total = 0;

    expenses.forEach(expense => {

        total += Number(expense.amount);

        expenseList.innerHTML += `

            <div class="expense">

                <div>

                    <h3>${expense.title}</h3>

                    <p>₹${expense.amount}</p>

                </div>

                <button onclick="deleteExpense(${expense.id})">
                    Delete
                </button>

            </div>

        `;

    });

    document.getElementById("totalAmount").innerText = total;

}


// REGISTER USER

async function registerUser() {

    const username = document.getElementById("username").value;

    const password = document.getElementById("password").value;

    const response = await fetch("/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            username,
            password
        })

    });

    const data = await response.json();

    alert(data.message);

}


// LOGIN USER

async function loginUser() {

    const username = document.getElementById("username").value;

    const password = document.getElementById("password").value;

    const response = await fetch("/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            username,
            password
        })

    });

    const data = await response.json();

    if (data.token) {

        localStorage.setItem("token", data.token);

        window.location.href = "dashboard.html";

    } else {

        alert(data.message);

    }

}


// ADD EXPENSE

async function addExpense() {

    const title = document.getElementById("title").value;

    const amount = document.getElementById("amount").value;

    await fetch("/expenses", {

        method: "POST",

        headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`

        },

        body: JSON.stringify({
            title,
            amount
        })

    });

    document.getElementById("title").value = "";

    document.getElementById("amount").value = "";

    getExpenses();

}


// DELETE EXPENSE

async function deleteExpense(id) {

    await fetch(`/expenses/${id}`, {

        method: "DELETE",

        headers: {
            Authorization: `Bearer ${token}`
        }

    });

    getExpenses();

}


// LOGOUT USER

function logoutUser() {

    localStorage.removeItem("token");

    window.location.href = "login.html";

}


// LOAD EXPENSES

getExpenses();
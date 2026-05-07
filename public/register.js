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

    window.location.href = "login.html";

}
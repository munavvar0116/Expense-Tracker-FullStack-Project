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
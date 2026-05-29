const loginform = document.getElementById("login_form")
const emailloginInput = document.getElementById("email-login-input")
const passwordloginInput = document.getElementById("password-login-input")
const statusLoginDiv = document.getElementById("status_login")

function displayLoginMsg(txt){
    statusLoginDiv.textContent = txt
}

loginform.addEventListener("submit", async (event) => {
    event.preventDefault()

    const email = emailloginInput.value.trim()
    const password = passwordloginInput.value.trim()

    if (!email || !password) {
        displayLoginMsg("Tous les champs sont requis")
        return
    }

    displayLoginMsg("Connexion en cours...")

    const url = "http://127.0.0.1:8000/users/login/"
    const data = {
        email: email,
        password: password
    }
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const result = await response.json()

        if (response.ok) {
            displayLoginMsg("Connexion réussie")
            loginform.reset()
        } else {
            displayLoginMsg(result.detail || "Erreur de connexion")
        }
    } catch (error) {
        displayLoginMsg("Erreur réseau")
    }
})

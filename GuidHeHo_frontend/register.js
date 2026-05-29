const registerForm = document.getElementById("register_form")
const firstnameInput = document.getElementById("firstname-input")
const lastnameInput = document.getElementById("lastname-input")
const emailInput = document.getElementById("email-input")
const passwordInput = document.getElementById("password-input")
const roleSelect = document.getElementById("id-role")
const registerStatusDiv = document.getElementById("status_register")

console.log("Register script loaded")


function displayRegisterMsg(txt){
    registerStatusDiv.textContent = txt
}

function getErrorMessage(result) {
    if (typeof result === "string") {
        return result
    }

    if (result.detail) {
        return result.detail
    }

    const messages = []

    for (const key in result) {
        const value = result[key]
        if (Array.isArray(value)) {
            messages.push(value.join(" "))
        } else {
            messages.push(value)
        }
    }

    return messages.join(" ")
}


registerForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const firstname = firstnameInput.value.trim()
    const lastname = lastnameInput.value.trim()
    const email = emailInput.value.trim()
    const password = passwordInput.value.trim()
    const role = roleSelect.value

    if (!firstname || !lastname || !email || !password || !role) {
        displayRegisterMsg("Tous les champs sont requis")
        return
    }

    displayRegisterMsg("Inscription en cours...")

    const url = "http://127.0.0.1:8000/users/register/"
    const data = {
        first_name: firstname,
        last_name: lastname,
        email: email,
        password: password,
        role: role
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
            displayRegisterMsg("Inscription réussie")
            registerForm.reset()
        } else {
            displayRegisterMsg(getErrorMessage(result))
        }
    } catch (error) {
        displayRegisterMsg("Erreur réseau")
    }
})

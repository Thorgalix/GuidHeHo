const searchForm = document.getElementById("search-bar")
const cityInput = document.getElementById("search-input-city")
const message = document.getElementById("search-input-message")
const results = document.getElementById("search-results")


function displaySearchMsg(txt){
    message.textContent = txt
}

function cleanResults() {
    results.innerHTML = ""
}

function guideCard(guide) {
    const firstname = guide.user.first_name
    const lastname = guide.user.last_name
    const city = guide.city
    const theme = guide.theme
    const price = guide.price_per_hour
    const rating = guide.average_rating
    const bio = guide.bio
    return(`
        <div class="guide-card">${firstname} ${lastname},
        ${city},
        ${theme},
        ${price}€/hour,
        ${bio}
        ${rating} étoile(s)</div>
        `)
}

function displayGuides(guides) {
    if(!guides || guides.length === 0){
        displaySearchMsg("Aucun guide trouvé")
        return
    }
    cleanResults()
    guides.forEach(guide => {
        const card = guideCard(guide)
        results.innerHTML += card
    });
}


// à ajouter : gestion de plusieurs filtres (nb de personnes, langues parlées, prix max, dates de résa(pas dispo encore)) et pagination
async function submitSearch(event) {
    event.preventDefault()
    const city = cityInput.value.trim()

    // If city is empty, fetch all guides; otherwise filter by city
    const url = city
        ? `http://127.0.0.1:8000/guides/?city=${encodeURIComponent(city)}`
        : `http://127.0.0.1:8000/guides/`

    displaySearchMsg(city ? "Recherche en cours..." : "Chargement de tous les guides...")
    cleanResults()

    try {
        const response = await fetch(url)
        if(!response.ok) {
            displaySearchMsg(`Erreur serveur: ${response.status}`)
            return
        }
        const data = await response.json()
        displayGuides(data)
        cityInput.value = ""
    } catch (error) {
        displaySearchMsg('Erreur réseau, impossible de contacter le serveur')
    }

}

searchForm.addEventListener('submit', submitSearch)

const searchForm = document.getElementById("search-bar")
const cityInput = document.getElementById("search-input-city")
const message = document.getElementById("search-input-message")
const results = document.getElementById("search-results")
const themeSelect = document.getElementById("search-input-theme") || {value: ''}
const languageSelect = document.getElementById("search-input-language") || {value: ''}
const priceMaxInput = document.getElementById("search-input-price-max")


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
    const languages = guide.languages || []
    const languageDisplay = Array.isArray(languages) ? languages.join(', ') : languages
    const themes = guide.themes || []
    const themeDisplay = Array.isArray(themes) ? themes.join(', ') : themes
    const price = guide.price_per_hour
    const rating = guide.average_rating
    const bio = guide.bio
    return(`
        <div class="guide-card">${firstname} ${lastname},
        ${city},
        ${languageDisplay},
        ${themeDisplay},
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


// à ajouter : gestion de plusieurs filtres (nb de personnes et dates de résa(pas dispo encore)) et pagination
async function submitSearch(event) {
    event.preventDefault()
    const city = cityInput.value.trim()
    const themeId = themeSelect.value
    const languageId = languageSelect.value
    const priceMax = priceMaxInput.value.trim()

    const params = new URLSearchParams()
    if(city) params.append('city', city)
    if(themeId) params.append('theme', themeId)
    if(languageId) params.append('language', languageId)
    if(priceMax) params.append('price_max', priceMax)

    const query = params.toString()

    // If city is empty, fetch all guides; otherwise filter by city
    const url = query ? `http://127.0.0.1:8000/guides/?${query}` : `http://127.0.0.1:8000/guides/`

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

async function loadThemes() {
    try {
        const response = await fetch('http://127.0.0.1:8000/guides/themes/')
        if(!response.ok) throw new Error(`Erreur serveur: ${response.status}`)
        const themes = await response.json()
        themeSelect.innerHTML = '<option value="">Tous les thèmes</option>'
        themes.forEach(theme => {
            const option = document.createElement('option')
            option.value = theme.id
            option.textContent = theme.name
            themeSelect.appendChild(option)
        })
    } catch (error) {
        console.error('Erreur lors du chargement des thèmes:', error)
    }
}

async function loadLanguages() {
    try {
        const response = await fetch('http://127.0.0.1:8000/guides/languages/')
        if(!response.ok) throw new Error(`Erreur serveur: ${response.status}`)
        const languages = await response.json()
        languageSelect.innerHTML = '<option value="">Toutes les langues</option>'
        languages.forEach(language => {
            const option = document.createElement('option')
            option.value = language.id
            option.textContent = language.name
            languageSelect.appendChild(option)
        })
    } catch (error) {
        console.error('Erreur lors du chargement des langues:', error)
    }
}

loadThemes()
loadLanguages()
searchForm.addEventListener('submit', submitSearch)

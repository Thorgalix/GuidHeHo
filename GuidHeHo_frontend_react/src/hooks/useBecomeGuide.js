import { useState, useEffect, useContext } from "react"
import { api } from "../services/api"
import { AuthContext } from "../context/AuthContext"
    
export function useBecomeGuide() {
    // States
    const { isAuthenticated } = useContext(AuthContext)

    const [bio, setBio] = useState("")
    const [city, setCity] = useState("")
    const [price, setPrice] = useState("")

    const [themes, setThemes] = useState([])
    const [languages, setLanguages] = useState([])

    const [selectedThemes, setSelectedThemes] = useState([])
    const [selectedLanguages, setSelectedLanguages] = useState([])

    const [message, setMessage] = useState("")

    const [slots, setSlots] = useState([
        { start_datetime: "", end_datetime: "", is_available: true }
    ])
    const [submitting, setSubmitting] = useState(false)
    const [submitSummary, setSubmitSummary] = useState("")

    // Comportements

    useEffect(() => {
        // On charge les listes de thèmes et de langues pour alimenter les cases à cocher.
        async function load() {
            try {
                const [t, l] = await Promise.all([
                    api.get("/api/guides/themes/"),
                    api.get("/api/guides/languages/")
                ])

                setThemes(t)
                setLanguages(l)
            } catch (err) {
                setMessage(err.message)
            }
        }

        load()
    }, [])

    // Ajoute un créneau vide au formulaire.
    function addSlot() {
        setSlots((prev) => [...prev, { start_datetime: "", end_datetime: "", is_available: true }])
    }

    // Supprime un créneau précis.
    function removeSlot(index) {
        setSlots((prev) => prev.filter((_, i) => i !== index))
    }

    // Met à jour un champ d'un créneau.
    function updateSlot(index, field, value) {
        setSlots((prev) =>
            prev.map((slot, i) =>
                i === index ? { ...slot, [field]: value } : slot
            )
        )
    }

    // Vérifie que tous les créneaux ont des dates cohérentes.
    function validateSlots(localSlots) {
        for (const slot of localSlots) {
            if (!slot.start_datetime || !slot.end_datetime) {
                return "Tous les créneaux doivent avoir une date de début et de fin."
            }
            if (new Date(slot.start_datetime) >= new Date(slot.end_datetime)) {
                return "La date de début doit être antérieure à la date de fin."
            }
        }
        return ""
    }

    // Active ou désactive une case à cocher dans une liste d'identifiants.
    function toggle(setter, value) {
        setter((prev) => {
            const id = Number(value)
            return prev.includes(id)
                ? prev.filter((v) => v !== id)
                : [...prev, id]
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setMessage("")
        setSubmitSummary("")
        setSubmitting(true)
        // Validation
        try {
            if (!bio || !city || !price) {
                setMessage("Tous les champs sont requis")
                return
        }
         const slotError = validateSlots(slots)
            if (slotError) {
                setMessage(slotError)
                return
            }
        
        // On crée d'abord le profil guide.
        await api.post("/api/guides/", {
            bio,
            city,
            price_per_hour: Number(price),
            themes: selectedThemes,
            languages: selectedLanguages
            })

            // Puis on crée les disponibilités associées.
            if (slots.length > 0) {
                const results = await Promise.allSettled(
                    slots.map((slot) => 
                        api.post("/api/availabilities/", {
                            start_datetime: new Date(slot.start_datetime).toISOString(),
                            end_datetime: new Date(slot.end_datetime).toISOString(),
                            is_available: true
                        })
                    )
                )
                const failures = results.filter((r) => r.status === "rejected").length
                const successes = results.length - failures

                if (failures === 0) {
                    setSubmitSummary(`Profil guide créé et ${successes} disponibilité(s) créée(s)`)
                } else {
                    setSubmitSummary(`Profil guide créé, mais ${failures} disponibilité(s) ont échoué à la création`)
                }
            } else {
                setSubmitSummary("Profil guide créé. Ajoute maintenant tes disponibilités.")
            }

            setBio("")
            setCity("")
            setPrice("")
            setSelectedThemes([])
            setSelectedLanguages([])
            setSlots([{ start_datetime: "", end_datetime: "", is_available: true }])
        } catch (err) {
            setMessage(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return {
        isAuthenticated,
        bio, setBio,
        city, setCity,
        price, setPrice,
        themes,
        languages,
        selectedThemes, setSelectedThemes,
        selectedLanguages, setSelectedLanguages,
        message,
        submitting,
        submitSummary,
        slots, addSlot, removeSlot, updateSlot,
        toggle,
        handleSubmit
    }
}

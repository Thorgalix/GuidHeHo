import { useState, useEffect, useContext } from "react"
import { api } from "../../../../services/api"
import { AuthContext } from "../../../../context/auth-context"

const WEEK_DAYS = [
    { index: 0, label: "Lundi" },
    { index: 1, label: "Mardi" },
    { index: 2, label: "Mercredi" },
    { index: 3, label: "Jeudi" },
    { index: 4, label: "Vendredi" },
    { index: 5, label: "Samedi" },
    { index: 6, label: "Dimanche" }
]

function createInterval() {
    return { start_time: "", end_time: "" }
}

function createSingleDay() {
    return { date: "", intervals: [createInterval()] }
}

function createWeekTemplate() {
    return WEEK_DAYS.map((day) => ({
        ...day,
        enabled: false,
        intervals: [createInterval()]
    }))
}

function addDaysToDate(dateString, days) {
    const [year, month, day] = dateString.split("-").map(Number)
    const baseUtc = new Date(Date.UTC(year, month - 1, day))
    baseUtc.setUTCDate(baseUtc.getUTCDate() + days)
    return baseUtc.toISOString().slice(0, 10)
}

function toIso(date, time) {
    return new Date(`${date}T${time}:00`).toISOString()
}

function sanitizePositiveInteger(value) {
    const digits = String(value).replace(/\D/g, "")

    if (!digits) return ""

    return String(Math.max(Number(digits), 1))
}

function sanitizePositiveDecimal(value) {
    const normalizedValue = String(value).replace(",", ".").replace(/[^\d.]/g, "")
    const [integerPart, ...decimalParts] = normalizedValue.split(".")

    if (!integerPart && decimalParts.length === 0) return ""

    const decimalPart = decimalParts.join("").slice(0, 2)
    const normalizedNumber = decimalPart ? `${integerPart || "0"}.${decimalPart}` : integerPart
    const number = Number(normalizedNumber)

    if (!Number.isFinite(number)) return ""

    return decimalPart ? String(Math.max(number, 1)) : String(Math.max(Math.trunc(number), 1))
}

function getOverlapError(intervals) {
    const normalized = intervals.map((it) => ({
        start: it.start_time,
        end: it.end_time
    }))

    for (const it of normalized) {
        if (!it.start || !it.end) {
            return "Tous les créneaux doivent avoir une heure de début et de fin."
        }
        if (it.start >= it.end) {
            return "L'heure de début doit être antérieure à l'heure de fin."
        }
    }

    normalized.sort((a, b) => a.start.localeCompare(b.start))
    for (let i = 1; i < normalized.length; i += 1) {
        if (normalized[i].start < normalized[i - 1].end) {
            return "Des créneaux se chevauchent dans une même journée."
        }
    }

    return ""
}

export function useBecomeGuide() {
    // States
    const { isAuthenticated, updateUser } = useContext(AuthContext)

    const [bio, setBio] = useState("")
    const [city, setCity] = useState("")
    const [price, setPrice] = useState("")

    const [themes, setThemes] = useState([])
    const [languages, setLanguages] = useState([])

    const [selectedThemes, setSelectedThemes] = useState([])
    const [selectedLanguages, setSelectedLanguages] = useState([])

    const [message, setMessage] = useState("")

    const [availabilityMode, setAvailabilityMode] = useState("week")
    const [singleDays, setSingleDays] = useState([createSingleDay()])
    const [weekStartDate, setWeekStartDate] = useState("")
    const [weekTemplate, setWeekTemplate] = useState(createWeekTemplate())
    const [submitting, setSubmitting] = useState(false)
    const [submitSummary, setSubmitSummary] = useState("")
    const [maxPeople, setMaxPeople] = useState("")

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

    function updateWeekDay(index, field, value) {
        setWeekTemplate((prev) => prev.map((day, i) => (i === index ? { ...day, [field]: value } : day)))
    }

    function addWeekInterval(dayIndex) {
        setWeekTemplate((prev) =>
            prev.map((day, i) =>
                i === dayIndex ? { ...day, intervals: [...day.intervals, createInterval()] } : day
            )
        )
    }

    function updateWeekInterval(dayIndex, intervalIndex, field, value) {
        setWeekTemplate((prev) =>
            prev.map((day, i) => {
                if (i !== dayIndex) return day
                return {
                    ...day,
                    intervals: day.intervals.map((interval, j) =>
                        j === intervalIndex ? { ...interval, [field]: value } : interval
                    )
                }
            })
        )
    }

    function removeWeekInterval(dayIndex, intervalIndex) {
        setWeekTemplate((prev) =>
            prev.map((day, i) => {
                if (i !== dayIndex) return day
                return {
                    ...day,
                    intervals: day.intervals.filter((_, j) => j !== intervalIndex)
                }
            })
        )
    }

    function addSingleDay() {
        setSingleDays((prev) => [...prev, createSingleDay()])
    }

    function removeSingleDay(dayIndex) {
        setSingleDays((prev) => prev.filter((_, i) => i !== dayIndex))
    }

    function updateSingleDay(dayIndex, field, value) {
        setSingleDays((prev) => prev.map((day, i) => (i === dayIndex ? { ...day, [field]: value } : day)))
    }

    function addSingleDayInterval(dayIndex) {
        setSingleDays((prev) =>
            prev.map((day, i) =>
                i === dayIndex ? { ...day, intervals: [...day.intervals, createInterval()] } : day
            )
        )
    }

    function updateSingleDayInterval(dayIndex, intervalIndex, field, value) {
        setSingleDays((prev) =>
            prev.map((day, i) => {
                if (i !== dayIndex) return day
                return {
                    ...day,
                    intervals: day.intervals.map((interval, j) =>
                        j === intervalIndex ? { ...interval, [field]: value } : interval
                    )
                }
            })
        )
    }

    function removeSingleDayInterval(dayIndex, intervalIndex) {
        setSingleDays((prev) =>
            prev.map((day, i) => {
                if (i !== dayIndex) return day
                return {
                    ...day,
                    intervals: day.intervals.filter((_, j) => j !== intervalIndex)
                }
            })
        )
    }

    function buildSlotsFromWeekTemplate() {
        if (!weekStartDate) {
            return { error: "Choisis une date de début de semaine.", slots: [] }
        }

        const enabledDays = weekTemplate.filter((day) => day.enabled)
        if (enabledDays.length === 0) {
            return { error: "Active au moins une journée disponible sur la semaine.", slots: [] }
        }

        const flattened = []
        for (const day of enabledDays) {
            const overlapError = getOverlapError(day.intervals)
            if (overlapError) {
                return { error: `${day.label} : ${overlapError}`, slots: [] }
            }

            const currentDate = addDaysToDate(weekStartDate, day.index)
            for (const interval of day.intervals) {
                flattened.push({
                    start_datetime: toIso(currentDate, interval.start_time),
                    end_datetime: toIso(currentDate, interval.end_time),
                    is_available: true
                })
            }
        }

        return { error: "", slots: flattened }
    }

    function buildSlotsFromSingleDays() {
        if (singleDays.length === 0) {
            return { error: "Ajoute au moins une journée de disponibilité.", slots: [] }
        }

        const flattened = []
        for (let i = 0; i < singleDays.length; i += 1) {
            const day = singleDays[i]
            if (!day.date) {
                return { error: `La journée ${i + 1} doit avoir une date.`, slots: [] }
            }

            const overlapError = getOverlapError(day.intervals)
            if (overlapError) {
                return { error: `Journée ${i + 1} : ${overlapError}`, slots: [] }
            }

            for (const interval of day.intervals) {
                flattened.push({
                    start_datetime: toIso(day.date, interval.start_time),
                    end_datetime: toIso(day.date, interval.end_time),
                    is_available: true
                })
            }
        }

        return { error: "", slots: flattened }
    }

    function buildAvailabilitySlots() {
        if (availabilityMode === "week") {
            return buildSlotsFromWeekTemplate()
        }
        return buildSlotsFromSingleDays()
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
            if (!bio || !city || !price || !maxPeople || selectedThemes.length === 0 || selectedLanguages.length === 0) {
                setMessage("Tous les champs sont requis")
                return
            }
            const sanitizedPrice = sanitizePositiveDecimal(price)
            const sanitizedMaxPeople = sanitizePositiveInteger(maxPeople)

            if (!sanitizedPrice || !sanitizedMaxPeople) {
                setMessage("Le prix et le nombre de personnes doivent être valides")
                return
            }

            const { error: slotError, slots } = buildAvailabilitySlots()
            if (slotError) {
                setMessage(slotError)
                return
            }

            // On crée d'abord le profil guide.
            await api.post("/api/guides/", {
                bio,
                city,
                price_per_hour: Number(sanitizedPrice),
                themes: selectedThemes,
                languages: selectedLanguages,
            })

            // On recharge l'utilisateur pour reflet immediat du role "guide".
            try {
                const freshUser = await api.get("/users/me/")
                updateUser(freshUser)
            } catch {
                // Le profil guide est deja cree; l'echec de refresh ne bloque pas le flux.
            }

            // Puis on crée les disponibilités associées.
            if (slots.length > 0) {
                const results = await Promise.allSettled(
                    slots.map((slot) =>
                        api.post("/api/availabilities/", {
                            start_datetime: slot.start_datetime,
                            end_datetime: slot.end_datetime,
                            is_available: true,
                            max_people: Number(sanitizedMaxPeople)
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
            setMaxPeople("")
            setSelectedThemes([])
            setSelectedLanguages([])
            setAvailabilityMode("week")
            setWeekStartDate("")
            setWeekTemplate(createWeekTemplate())
            setSingleDays([createSingleDay()])
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
        maxPeople, setMaxPeople,
        themes,
        languages,
        selectedThemes, setSelectedThemes,
        selectedLanguages, setSelectedLanguages,
        message,
        submitting,
        submitSummary,
        availabilityMode, setAvailabilityMode,
        weekStartDate, setWeekStartDate,
        weekTemplate,
        updateWeekDay, addWeekInterval, updateWeekInterval, removeWeekInterval,
        singleDays,
        addSingleDay, removeSingleDay, updateSingleDay,
        addSingleDayInterval, updateSingleDayInterval, removeSingleDayInterval,
        toggle,
        handleSubmit
    }
}

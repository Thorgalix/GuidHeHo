import { useState } from "react"
import { api } from "../../../services/api"

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



export function useGuideAvailabilitiesManager() {

    // states
    const [message, setMessage] = useState("")

    const [availabilityMode, setAvailabilityMode] = useState("week")
    const [singleDays, setSingleDays] = useState([createSingleDay()])
    const [weekStartDate, setWeekStartDate] = useState("")
    const [weekTemplate, setWeekTemplate] = useState(createWeekTemplate())
    const [submitting, setSubmitting] = useState(false)
    const [submitSummary, setSubmitSummary] = useState("")
    const [maxPeople, setMaxPeople] = useState("")


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


    function buildAvailabilitySlots() {
    if (availabilityMode === "week") {
        if (!weekStartDate) return { error: "Choisis une date de début de semaine.", slots: [] }
        const enabledDays = weekTemplate.filter((day) => day.enabled)
        if (enabledDays.length === 0) return { error: "Active au moins une journée.", slots: [] }
        const flattened = []
        for (const day of enabledDays) {
            const overlapError = getOverlapError(day.intervals)
            if (overlapError) return { error: `${day.label} : ${overlapError}`, slots: [] }
            const currentDate = addDaysToDate(weekStartDate, day.index)
            for (const interval of day.intervals) {
                flattened.push({
                    start_datetime: toIso(currentDate, interval.start_time),
                    end_datetime: toIso(currentDate, interval.end_time),
                    is_available: true,
                })
            }
        }
        return { error: "", slots: flattened }
    }
    // mode "day"
    if (singleDays.length === 0) return { error: "Ajoute au moins une journée.", slots: [] }
    const flattened = []
    for (let i = 0; i < singleDays.length; i++) {
        const day = singleDays[i]
        if (!day.date) return { error: `La journée ${i + 1} doit avoir une date.`, slots: [] }
        const overlapError = getOverlapError(day.intervals)
        if (overlapError) return { error: `Journée ${i + 1} : ${overlapError}`, slots: [] }
        for (const interval of day.intervals) {
            flattened.push({
                start_datetime: toIso(day.date, interval.start_time),
                end_datetime: toIso(day.date, interval.end_time),
                is_available: true,
            })
        }
    }
    return { error: "", slots: flattened }
}

async function handleSubmitAvailabilities(e) {
    e.preventDefault()
    setMessage("")
    setSubmitSummary("")
    setSubmitting(true)
    try {
        const { error: slotError, slots } = buildAvailabilitySlots()
        if (slotError) { setMessage(slotError); return }

        const results = await Promise.allSettled(
            slots.map((slot) =>
                api.post("/api/availabilities/", {
                    start_datetime: slot.start_datetime,
                    end_datetime: slot.end_datetime,
                    is_available: true,
                    max_people: Number(maxPeople)
                })
            )
        )
        const failures = results.filter((r) => r.status === "rejected").length
        const successes = results.length - failures
        setSubmitSummary(
            failures === 0
                ? `${successes} disponibilité(s) ajoutée(s) avec succès.`
                : `${successes} ajoutée(s), ${failures} en échec.`
        )
    } catch (err) {
        setMessage(err.message)
    } finally {
        setSubmitting(false)
    }
}

    return {
        message,
        availabilityMode, setAvailabilityMode,
        maxPeople, setMaxPeople,
        weekStartDate, setWeekStartDate,
        weekTemplate,
        updateWeekDay, addWeekInterval, updateWeekInterval, removeWeekInterval,
        singleDays,
        addSingleDay, removeSingleDay, updateSingleDay,
        addSingleDayInterval, updateSingleDayInterval, removeSingleDayInterval,
        handleSubmitAvailabilities,
        submitSummary, setSubmitSummary,
        submitting
    }
}

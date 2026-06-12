import { useEffect, useState } from "react"

export default function GuideBookingForm({ availabilities, onSubmit, status }) {
    const [selectedAvailabilityId, setSelectedAvailabilityId] = useState("") // choix utilisateur
    const [date, setDate] = useState("")
    const [people, setPeople] = useState("")
    const [message, setMessage] = useState("")

    const selectedAvailability = availabilities.find(
        (a) => a.id === Number(selectedAvailabilityId)
    )

    const minDate = selectedAvailability
        ? selectedAvailability.start_datetime.slice(0, 10)
        : undefined

    const maxDate = selectedAvailability
        ? selectedAvailability.end_datetime.slice(0, 10)
        : undefined

    // On récupère le créneau actuellement sélectionné pour borner la date.
    function formatAvailabilityLabel(availability) {
        const start = new Date(availability.start_datetime)
        const end = new Date(availability.end_datetime)

        const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
            weekday: "short",
            day: "2-digit",
            month: "short",
        })

        const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        })

        const sameDay = start.toDateString() === end.toDateString()

        if (sameDay) {
            return `${dateFormatter.format(start)} · ${timeFormatter.format(start)} → ${timeFormatter.format(end)}`
        }

        return `${dateFormatter.format(start)} · ${timeFormatter.format(start)} → ${dateFormatter.format(end)} · ${timeFormatter.format(end)}`
    }

    // Quand le créneau change, on réinitialise la date si elle devient invalide.
    useEffect(() => {
        if (!selectedAvailabilityId) {
            setDate("")
            return
        }
        if (date && (date < minDate || date > maxDate)) {
            setDate("")
        }
    }, [selectedAvailabilityId, date, minDate, maxDate])

    async function handleSubmit(e) {
        e.preventDefault()

        await onSubmit({
            availability: Number(selectedAvailabilityId),
            booking_date: date,
            number_of_people: Number(people),
            message: message.trim()
        })

        setDate("")
        setPeople("")
        setMessage("")
        setSelectedAvailabilityId("")
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Choose Availability:
                <select
                    value={selectedAvailabilityId}
                    onChange={(e) => setSelectedAvailabilityId(e.target.value)}
                >
                    <option value="">Select an availability</option>
                    {availabilities.map((availability) => (
                        <option key={availability.id} value={availability.id}>
                            {formatAvailabilityLabel(availability)}
                        </option>
                    ))}
                </select>
            </label>
            {availabilities.length === 0 && (<p>No availability for this guide.</p>)}


            <label>
                Date:
                <input type="date" value={date} min={minDate} max={maxDate} disabled={!selectedAvailabilityId} onChange={(e) => setDate(e.target.value)} />
            </label>

            <label>
                Number of people:
                <input
                    type="number"
                    value={people}
                    min="1"
                    onChange={(e) => setPeople(e.target.value)}
                />
            </label>

            <textarea
                placeholder="Message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <button type="submit" disabled={!selectedAvailabilityId || !date || !people}>
                Confirm booking
            </button>

            {status && <p>{status}</p>}
        </form>
    )

}
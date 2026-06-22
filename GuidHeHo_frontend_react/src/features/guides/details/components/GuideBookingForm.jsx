import { useState } from "react"

export default function GuideBookingForm({ availabilities, onSubmit, status }) {
    const [date, setDate] = useState("")
    const [selectedAvailabilityId, setSelectedAvailabilityId] = useState("")
    const [people, setPeople] = useState("")
    const [message, setMessage] = useState("")

    // On récupère toutes les dates disponibles.
    // new Set permet de supprimer les doublons.
    const availableDates = [...new Set(
        availabilities.map((availability) =>
            availability.start_datetime.slice(0, 10)
        )
    )].sort()

    // On récupère seulement les créneaux du jour sélectionné.
    const availabilitiesForSelectedDate = availabilities.filter((availability) => {
        const availabilityDate = availability.start_datetime.slice(0, 10)
        return availabilityDate === date
    })

    // On récupère le créneau actuellement sélectionné.
    const selectedAvailability = availabilities.find(
        (availability) => availability.id === Number(selectedAvailabilityId)
    )

    // Affiche une date propre pour l'utilisateur.
    function formatDateLabel(dateString) {
        const date = new Date(`${dateString}T00:00:00`)

        return new Intl.DateTimeFormat("fr-FR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(date)
    }

    // Affiche seulement les horaires du créneau.
    function formatTimeSlotLabel(availability) {
        const start = new Date(availability.start_datetime)
        const end = new Date(availability.end_datetime)

        const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        })

        return `${timeFormatter.format(start)} → ${timeFormatter.format(end)}`
    }

    function handleDateChange(e) {
        setDate(e.target.value)

        // Quand on change de date, on vide le créneau sélectionné.
        setSelectedAvailabilityId("")
    }

    function sanitizePeople(value) {
        const digits = value.replace(/\D/g, "")

        if (!digits) return ""

        const max = selectedAvailability?.remaining_places
        const number = Math.max(Number(digits), 1)

        return String(max ? Math.min(number, max) : number)
    }

    function handlePeopleKeyDown(e) {
        if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
            e.preventDefault()
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const sanitizedPeople = sanitizePeople(people)

        await onSubmit({
            availability: Number(selectedAvailabilityId),
            booking_date: date,
            number_of_people: Number(sanitizedPeople),
            message: message.trim(),
        })

        setDate("")
        setPeople("")
        setMessage("")
        setSelectedAvailabilityId("")
    }

    return (
        <form onSubmit={handleSubmit}>
            {availabilities.length === 0 && (
                <p>No availability for this guide.</p>
            )}

            <label>
                Choose a date:
                <select
                    value={date}
                    disabled={availableDates.length === 0}
                    onChange={handleDateChange}
                >
                    <option value="">Select a date</option>

                    {availableDates.map((availableDate) => (
                        <option key={availableDate} value={availableDate}>
                            {formatDateLabel(availableDate)}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Choose a time slot:
                <select
                    value={selectedAvailabilityId}
                    disabled={!date || availabilitiesForSelectedDate.length === 0}
                    onChange={(e) => setSelectedAvailabilityId(e.target.value)}
                >
                    <option value="">Select a time slot</option>

                    {availabilitiesForSelectedDate.map((availability) => (
                        <option key={availability.id} value={availability.id}>
                            {formatTimeSlotLabel(availability)}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Number of people:
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={people}
                    min="1"
                    max={selectedAvailability?.remaining_places}
                    disabled={!selectedAvailabilityId}
                    onChange={(e) => setPeople(sanitizePeople(e.target.value))}
                    onKeyDown={handlePeopleKeyDown}
                />
            </label>

            <textarea
                placeholder="Message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <button
                type="submit"
                disabled={!date || !selectedAvailabilityId || !people}
            >
                Confirm booking
            </button>

            {status && <p>{status}</p>}
        </form>
    )
}

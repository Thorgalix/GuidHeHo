import { useState, useMemo } from "react"
import { DayPicker } from "@daypicker/react"
import "@daypicker/react/style.css"

export default function GuideBookingForm({ availabilities, onSubmit, status }) {
    const [selectedDate, setSelectedDate] = useState(undefined)
    const [selectedAvailabilityId, setSelectedAvailabilityId] = useState("")
    const [people, setPeople] = useState("")
    const [message, setMessage] = useState("")



    //* --------------------------------------------------------------------------------- *//

    const availabilitiesByDate = useMemo(() => {
        return availabilities.reduce((acc, availability) => {
            const dateKey = availability.start_datetime.slice(0, 10)

            if (!acc[dateKey]) acc[dateKey] = []

            acc[dateKey].push(availability)

            return acc
        }, {})
    }, [availabilities])

    const availableDays = useMemo(() => {
        return Object.keys(availabilitiesByDate).map((dateKey) => {
            return new Date(`${dateKey}T00:00:00`)
        })
    }, [availabilitiesByDate])


    const selectedDateKey = selectedDate ? toDateKey(selectedDate) : ""

    const availabilitiesForSelectedDate = selectedDateKey
        ? availabilitiesByDate[selectedDateKey] ?? []
        : []


    // On récupère le créneau actuellement sélectionné.
    const selectedAvailability = availabilities.find(
        (availability) => availability.id === Number(selectedAvailabilityId)
    )

    const maxPeople = selectedAvailability?.remaining_places ?? selectedAvailability?.max_people

    function toDateKey(date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")

        return `${year}-${month}-${day}`
    }

    function isDateUnavailable(day) {
        const dateKey = toDateKey(day)
        return !availabilitiesByDate[dateKey]
    }

    //* --------------------------------------------------------------------------------- *//

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

    function sanitizePeople(value) {
        const digits = value.replace(/\D/g, "")

        if (!digits) return ""

        const number = Math.max(Number(digits), 1)

        return String(maxPeople ? Math.min(number, maxPeople) : number)
    }

    function handlePeopleKeyDown(e) {
        if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
            e.preventDefault()
        }
    }

    //* --------------------------------------------------------------------------------- *//


    function handleDateSelect(day) {
        if (!day) return

        setSelectedDate(day)
        setSelectedAvailabilityId("")
        setPeople("")
    }

    //* --------------------------------------------------------------------------------- *//

    async function handleSubmit(e) {
        e.preventDefault()

        const sanitizedPeople = sanitizePeople(people)

        await onSubmit({
            availability: Number(selectedAvailabilityId),
            booking_date: selectedDateKey,
            number_of_people: Number(sanitizedPeople),
            message: message.trim(),
        })

        setSelectedDate(undefined)
        setPeople("")
        setMessage("")
        setSelectedAvailabilityId("")
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {availabilities.length === 0 && (
                <p>Aucune disponibilité pour ce guide.</p>
            )}



            <label className="block space-y-2">
                Choisir une date :
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={isDateUnavailable}
                    modifiers={{ available: availableDays }}
                    modifiersClassNames={{ available: "font-bold text-teal-700 bg-teal-100 rounded-full" }}
                />
            </label>

            <label className="block space-y-2">
                Choisir un créneau :
                {availabilitiesForSelectedDate.map((availability) => (
                    <button
                        type="button"
                        key={availability.id}
                        onClick={() => setSelectedAvailabilityId(String(availability.id))}
                        className={
                            selectedAvailabilityId === String(availability.id)
                                ? "rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white"
                                : "rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-teal-600 hover:text-teal-700"
                        }
                    >
                        {formatTimeSlotLabel(availability)}
                    </button>
                ))}
            </label>




            <label className="block space-y-2">
                Nombre de personnes :
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={people}
                    min="1"
                    max={maxPeople}
                    disabled={!selectedAvailabilityId}
                    onChange={(e) => setPeople(sanitizePeople(e.target.value))}
                    onKeyDown={handlePeopleKeyDown}
                    className="w-full rounded-md border border-teal-700 px-3 py-2"
                />
            </label>

            <textarea
                placeholder="Message (facultatif)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-25 rounded-md border border-teal-700 py-2 px-3"
            />

            <button
                type="submit"
                disabled={!selectedDate || !selectedAvailabilityId || !people}
                className="rounded-md bg-teal-700 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-teal-300"
            >
                Confirmer la réservation
            </button>

            {status && <p>{status}</p>}
        </form>
    )
}

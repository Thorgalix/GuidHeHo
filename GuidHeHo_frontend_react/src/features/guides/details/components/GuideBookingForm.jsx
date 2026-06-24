import { useState, useMemo } from "react"
import { DayPicker } from "@daypicker/react"
import { FaCalendarAlt, FaClock, FaUsers } from "react-icons/fa"
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
        <form onSubmit={handleSubmit} className="space-y-5">
            {availabilities.length === 0 && (
                <p className="text-slate-700 dark:text-teal-100">
                    Aucune disponibilité pour ce guide.
                </p>
            )}

            <label className="block space-y-3">
                <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                    <FaCalendarAlt className="text-teal-700 dark:text-teal-100" aria-hidden="true" />
                    Choisir une date
                </span>
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={isDateUnavailable}
                    modifiers={{ available: availableDays }}
                    modifiersClassNames={{ available: "font-bold text-teal-700 bg-teal-100 rounded-full" }}
                    className="rounded-lg border border-teal-200 bg-white/70 p-3 text-slate-900 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-50"
                />
            </label>

            <div className="space-y-3">
                <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                    <FaClock className="text-teal-700 dark:text-teal-100" aria-hidden="true" />
                    Choisir un créneau
                </span>

                {selectedDate && availabilitiesForSelectedDate.length === 0 && (
                    <p className="text-sm text-slate-700 dark:text-teal-100">
                        Aucun créneau disponible pour cette date.
                    </p>
                )}

                <div className="flex flex-wrap gap-2">
                    {availabilitiesForSelectedDate.map((availability) => (
                        <button
                            type="button"
                            key={availability.id}
                            onClick={() => setSelectedAvailabilityId(String(availability.id))}
                            className={
                                selectedAvailabilityId === String(availability.id)
                                    ? "btn btn-sm border-none bg-teal-700 text-white hover:bg-teal-800"
                                    : "btn btn-sm border-teal-600 bg-white text-teal-700 hover:border-teal-500 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-100 dark:hover:bg-teal-800"
                            }
                        >
                            {formatTimeSlotLabel(availability)}
                        </button>
                    ))}
                </div>
            </div>

            <label className="form-control">
                <div className="label">
                    <span className="label-text flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                        <FaUsers className="text-teal-700 dark:text-teal-100" aria-hidden="true" />
                        Nombre de personnes
                    </span>
                    {maxPeople && (
                        <span className="label-text-alt text-slate-600 dark:text-teal-100">
                            max. {maxPeople}
                        </span>
                    )}
                </div>
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
                    placeholder="ex: 2"
                    className="input input-bordered w-full border-teal-600 bg-white focus:border-teal-300 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                />
            </label>

            <label className="form-control">
                <div className="label">
                    <span className="label-text font-semibold text-slate-900 dark:text-white">
                        Message
                    </span>
                    <span className="label-text-alt text-slate-600 dark:text-teal-100">
                        facultatif
                    </span>
                </div>
                <textarea
                    placeholder="Précisez vos attentes pour cette visite..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="textarea textarea-bordered min-h-28 w-full border-teal-600 bg-white focus:border-teal-300 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                />
            </label>

            <button
                type="submit"
                disabled={!selectedDate || !selectedAvailabilityId || !people}
                className="btn border-none bg-teal-500 text-white hover:bg-teal-600 disabled:bg-teal-300 disabled:text-white"
            >
                Confirmer la réservation
            </button>

            {status && (
                <p className="text-sm font-medium text-teal-700 dark:text-teal-100">
                    {status}
                </p>
            )}
        </form>
    )
}

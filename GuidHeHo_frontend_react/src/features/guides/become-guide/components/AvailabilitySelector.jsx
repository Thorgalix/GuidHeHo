export default function AvailabilitySelector({ availabilityMode, setAvailabilityMode }) {

    return (
        <div>
            <h4>Disponibilités</h4>

            <label>
                <input
                    type="radio"
                    name="availability_mode"
                    checked={availabilityMode === "week"}
                    onChange={() => setAvailabilityMode("week")}
                />
                Semaines
            </label>

            <label>
                <input
                    type="radio"
                    name="availability_mode"
                    checked={availabilityMode === "day"}
                    onChange={() => setAvailabilityMode("day")}
                />
                Jours
            </label>
        </div>
    )



}





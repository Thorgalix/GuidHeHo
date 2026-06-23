export default function AvailabilitySelector({ availabilityMode, setAvailabilityMode }) {

    return (
        <div>
            <h4>Disponibilités</h4>

            <label>
                <input
                    type="radio"
                    name="availability_mode"
                    checked={availabilityMode === "Semaines"}
                    onChange={() => setAvailabilityMode("Semaines")}
                />
                Semaines
            </label>

            <label>
                <input
                    type="radio"
                    name="availability_mode"
                    checked={availabilityMode === "Jours"}
                    onChange={() => setAvailabilityMode("Jours")}
                />
                Jours
            </label>
        </div>
    )



}





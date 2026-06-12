export default function AvailabilitySelector({ availabilityMode, setAvailabilityMode }) {

    return (
        <div>
            <h4>Disponibilities</h4>

            <label>
                <input
                    type="radio"
                    name="availability_mode"
                    checked={availabilityMode === "week"}
                    onChange={() => setAvailabilityMode("week")}
                />
                Weeks
            </label>

            <label>
                <input
                    type="radio"
                    name="availability_mode"
                    checked={availabilityMode === "day"}
                    onChange={() => setAvailabilityMode("day")}
                />
                Days
            </label>
        </div>
    )



}





export default function CapacitySelector({ maxPeople, setMaxPeople }) {
    const handleChange = (e) => {
        const value = e.target.value

        if (value === "") {
            setMaxPeople("")
            return
        }

        const number = Number(value)

        if (isNaN(number)) {
            return
        }

        if (number < 1) {
            setMaxPeople("1")
        }

        setMaxPeople(number)
    }

    return (
        <div>
            <h4>Number of people</h4>
            <input
                type="number"
                name="maxpeople"
                min="1"
                step="1"
                placeholder="ex: 2"
                className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                value={maxPeople}
                onChange={handleChange}
                onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "+") {
                        e.preventDefault()
                    }
                }}
            />
        </div>
    )
}
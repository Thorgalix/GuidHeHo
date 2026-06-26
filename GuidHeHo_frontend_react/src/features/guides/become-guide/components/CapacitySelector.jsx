export default function CapacitySelector({ maxPeople, setMaxPeople }) {
    const handleChange = (e) => {
        const digits = e.target.value.replace(/\D/g, "")

        if (!digits) {
            setMaxPeople("")
            return
        }

        setMaxPeople(String(Math.max(Number(digits), 1)))
    }

    const handleKeyDown = (e) => {
        if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
            e.preventDefault()
        }
    }

    return (
        <label className="form-control max-w-sm">
            <div className="label">
                <span className="label-text font-semibold text-slate-900 dark:text-white">
                    Nombre de personnes
                </span>
            </div>
            <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="maxpeople"
                min="1"
                step="1"
                placeholder="ex: 2"
                className="input input-bordered dark:bg-teal-950 border-teal-600 w-full focus:outline-none focus:border-teal-300"
                value={maxPeople}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        </label>
    )
}

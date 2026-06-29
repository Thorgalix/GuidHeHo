export default function GuideProfileFields({ bio, setBio, city, setCity, price, setPrice }) {
    function sanitizePrice(value) {
        const normalizedValue = value.replace(",", ".").replace(/[^\d.]/g, "")
        const [integerPart, ...decimalParts] = normalizedValue.split(".")

        if (!integerPart && decimalParts.length === 0) return ""

        const decimalPart = decimalParts.join("").slice(0, 2)
        const normalizedNumber = decimalPart ? `${integerPart || "0"}.${decimalPart}` : integerPart
        const number = Number(normalizedNumber)

        if (!Number.isFinite(number)) return ""
        if (normalizedValue.endsWith(".") && decimalParts.length > 0) {
            return `${Math.max(Math.trunc(number), 1)}.`
        }

        return decimalPart ? String(Math.max(number, 1)) : String(Math.max(Math.trunc(number), 1))
    }

    function handlePriceKeyDown(e) {
        if (["e", "E", "+", "-"].includes(e.key)) {
            e.preventDefault()
        }
    }


    return (
        <div className="grid gap-4 md:grid-cols-2">
            <label className="form-control md:col-span-2">
                <div className="label">
                    <span className="label-text font-semibold text-slate-900 dark:text-white">
                        Bio
                    </span>
                </div>

                <textarea
                    placeholder="Présentez votre expérience, votre style de visite et ce que vous aimez partager."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="textarea textarea-bordered min-h-28 w-full border-teal-600 bg-white text-slate-900 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                >
                </textarea>
            </label>

            <label className="form-control">
                <div className="label">
                    <span className="label-text font-semibold text-slate-900 dark:text-white">
                        Ville
                    </span>
                </div>

                <input
                    type="text"
                    placeholder="ex: Paris, Lyon, Marseille..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                />
            </label>

            <label className="form-control">
                <div className="label">
                    <span className="label-text font-semibold text-slate-900 dark:text-white">
                        Prix par heure
                    </span>
                </div>

                <input
                    type="text"
                    inputMode="decimal"
                    placeholder="ex: 25€"
                    value={price}
                    onChange={(e) => setPrice(sanitizePrice(e.target.value))}
                    onKeyDown={handlePriceKeyDown}
                    className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                />
            </label>
        </div >
    )
}

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
        <div>
            <div>
                <input placeholder="Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />


                <input placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />

                <input type="text" inputMode="decimal" placeholder="Price per hour"
                    value={price}
                    onChange={(e) => setPrice(sanitizePrice(e.target.value))}
                    onKeyDown={handlePriceKeyDown}
                />

            </div>
        </div>
    )
}

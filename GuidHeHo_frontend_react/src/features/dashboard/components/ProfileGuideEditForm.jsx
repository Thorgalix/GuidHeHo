import { useState, useEffect } from "react";
import { api } from "../../../services/api";
import LanguageSelector from "../../guides/become-guide/components/LanguageSelector";
import ThemeSelector from "../../guides/become-guide/components/ThemeSelector";

export default function ProfileGuideEditForm({ guide, setIsEditing, onGuideUpdated }) {
    const [bio, setBio] = useState(guide.bio || "");
    const [city, setCity] = useState(guide.city || "");
    const [pricePerHour, setPricePerHour] = useState(guide.price_per_hour || 0);

    const [languages, setLanguages] = useState([]);
    const [themes, setThemes] = useState([]);

    const [selectedLanguages, setSelectedLanguages] = useState(
        guide.languages.map((language) => language.id) || []
    );
    const [selectedThemes, setSelectedThemes] = useState(
        guide.themes.map((theme) => theme.id) || []
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function loadOptions() {
            try {
                const [languagesData, themesData] = await Promise.all([
                    api.get("/api/guides/languages/"),
                    api.get("/api/guides/themes/"),
                ]);
                setLanguages(languagesData);
                setThemes(themesData);
            } catch (err) {
                setError(err.message);
            }
        }

        loadOptions();
    }, []);

    function toggle(setter, id) {
        const numericId = Number(id)

        setter((previousIds) => {
            if (previousIds.includes(numericId)) {
                return previousIds.filter((itemId) => itemId !== numericId)
            }

            return [...previousIds, numericId]
        })
    }

    function sanitizePrice(value, allowTrailingDecimal = true) {
        const normalizedValue = String(value).replace(",", ".").replace(/[^\d.]/g, "")
        const [integerPart, ...decimalParts] = normalizedValue.split(".")

        if (!integerPart && decimalParts.length === 0) return ""

        const decimalPart = decimalParts.join("").slice(0, 2)
        const normalizedNumber = decimalPart ? `${integerPart || "0"}.${decimalPart}` : integerPart
        const number = Number(normalizedNumber)

        if (!Number.isFinite(number)) return ""
        if (allowTrailingDecimal && normalizedValue.endsWith(".") && decimalParts.length > 0) {
            return `${Math.max(Math.trunc(number), 1)}.`
        }

        return decimalPart ? String(Math.max(number, 1)) : String(Math.max(Math.trunc(number), 1))
    }

    function handlePriceKeyDown(e) {
        if (["e", "E", "+", "-"].includes(e.key)) {
            e.preventDefault()
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const data = {}
            const sanitizedPricePerHour = sanitizePrice(pricePerHour, false)

            if (bio !== guide.bio) data.bio = bio
            if (city !== guide.city) data.city = city
            if (!sanitizedPricePerHour) {
                setError("Price per hour must be valid.")
                return
            }
            if (sanitizedPricePerHour !== String(guide.price_per_hour)) {
                data.price_per_hour = Number(sanitizedPricePerHour)
            }

            const initialLanguageIds = guide.languages.map((language) => language.id)
            const initialThemeIds = guide.themes.map((theme) => theme.id)

            if (JSON.stringify(selectedLanguages.sort()) !== JSON.stringify(initialLanguageIds.sort())) {
                data.languages = selectedLanguages
            }
            if (JSON.stringify(selectedThemes.sort()) !== JSON.stringify(initialThemeIds.sort())) {
                data.themes = selectedThemes
            }

            if (Object.keys(data).length === 0) {
                setError("No changes detected.")
                return
            }

            await api.patch("/api/guides/me/", data)

            const refreshedGuide = await api.get("/api/guides/me/")

            if (onGuideUpdated) onGuideUpdated(refreshedGuide)
            setSuccess("Profile updated successfully!")
            setIsEditing(false)

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <form action="" onSubmit={handleSubmit}>
                <h3>Edit Guide Profile</h3>
                <div>
                    <label htmlFor="bio">Bio: </label>
                    <input type="text" id="bio" name="bio" value={bio} onChange={(e) => setBio(e.target.value)} />

                    <label htmlFor="city">City: </label>
                    <input type="text" id="city" name="city" value={city} onChange={(e) => setCity(e.target.value)} />

                    <label htmlFor="price_per_hour">Price per Hour: </label>
                    <input
                        type="text"
                        inputMode="decimal"
                        id="price_per_hour"
                        name="price_per_hour"
                        min="1"
                        value={pricePerHour}
                        onChange={(e) => setPricePerHour(sanitizePrice(e.target.value))}
                        onKeyDown={handlePriceKeyDown}
                    />

                                < LanguageSelector
                            languages = { languages }
                            selectedLanguages = { selectedLanguages }
                            setSelectedLanguages = { setSelectedLanguages }
                            toggle = { toggle }
                                />

                    <ThemeSelector
                        themes={themes}
                        selectedThemes={selectedThemes}
                        setSelectedThemes={setSelectedThemes}
                        toggle={toggle}
                    />


                    <button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                            { error && <p style={{ color: "red" }}>{error}</p> }
                            { success && <p style={{ color: "green" }}>{success}</p> }
                </div>

            </form>

        </div>
    )
}

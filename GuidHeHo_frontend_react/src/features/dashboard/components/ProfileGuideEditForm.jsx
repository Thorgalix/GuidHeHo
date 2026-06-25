import { useState, useEffect } from "react";
import { api } from "../../../services/api";
import LanguageSelector from "../../guides/become-guide/components/LanguageSelector";
import ThemeSelector from "../../guides/become-guide/components/ThemeSelector";
import { FaSave, FaTimes, FaCompass, FaWrench } from "react-icons/fa";

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
        if (!error && !success) return

        const timeoutId = window.setTimeout(() => {
            setError("")
            setSuccess("")
        }, 3500)

        return () => window.clearTimeout(timeoutId)
    }, [error, success])

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
                setError("Le prix par heure doit être valide.")
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
                setError("Aucune modification détectée.")
                return
            }

            await api.patch("/api/guides/me/", data)

            const refreshedGuide = await api.get("/api/guides/me/")

            if (onGuideUpdated) onGuideUpdated(refreshedGuide)
            setSuccess("Profil mis à jour avec succès !")
            setIsEditing(false)

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
            <div className="card-body space-y-6">
                <header className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-100">
                        <FaWrench aria-hidden="true" />
                    </span>

                    <div>
                        <h2 className="card-title text-slate-900 dark:text-white">
                            Modifier le profil guide
                        </h2>
                        <p className="text-sm text-slate-700 dark:text-teal-50">
                            Modifiez les informations de votre profil guide.
                        </p>
                    </div>
                </header>

                <div className="my-2 border-t border-teal-200 dark:border-teal-700" />

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <FaCompass className="text-teal-700 dark:text-teal-100" aria-hidden="true" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Informations du profil guide
                        </h3>
                    </div>


                    <div className="grid gap-4 rounded-lg border border-teal-200 bg-white/70 p-4 dark:border-teal-700 dark:bg-teal-950/40 md:grid-cols-2">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text font-semibold text-slate-900 dark:text-white">
                                    Bio :
                                </span>
                            </div>

                            <input
                                type="text"
                                id="bio"
                                name="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                            />
                        </label>

                        <label className="form-control">
                            <div className="label">
                                <span className="label-text font-semibold text-slate-900 dark:text-white">
                                    Ville :
                                </span>
                            </div>

                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                            />
                        </label>

                        <label className="form-control md:col-span-2">
                            <div className="label">
                                <span className="label-text font-semibold text-slate-900 dark:text-white">
                                    Prix par heure :
                                </span>
                            </div>

                            <input
                                type="text"
                                inputMode="decimal"
                                id="price_per_hour"
                                name="price_per_hour"
                                min="1"
                                value={pricePerHour}
                                onChange={(e) => setPricePerHour(sanitizePrice(e.target.value))}
                                onKeyDown={handlePriceKeyDown}
                                className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                            />
                        </label>

                        < LanguageSelector
                            languages={languages}
                            selectedLanguages={selectedLanguages}
                            setSelectedLanguages={setSelectedLanguages}
                            toggle={toggle}
                        />

                        <ThemeSelector
                            themes={themes}
                            selectedThemes={selectedThemes}
                            setSelectedThemes={setSelectedThemes}
                            toggle={toggle}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn border-none bg-teal-500 text-white hover:bg-teal-600 disabled:bg-slate-300 disabled:text-slate-500"
                        >
                            <FaSave aria-hidden="true" />
                            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                        </button>
                    </div>
                </form>


            </div>

            {(error || success) && (
                <div className="toast toast-start z-50">
                    <div className={
                        error
                            ? "alert border-red-400 bg-red-50 text-red-700 shadow-lg dark:bg-red-950 dark:text-red-200"
                            : "alert border-teal-600 bg-teal-50 text-teal-700 shadow-lg dark:bg-teal-950 dark:text-teal-100"
                    }>
                        <span>{error || success}</span>
                    </div>
                </div>
            )}
        </section>
    )
}

import { useBecomeGuide } from "../../features/guides/become-guide/hooks/useBecomeGuide"
import GuideProfileFields from "../../features/guides/become-guide/components/GuideProfileFields"
import ThemeSelector from "../../features/guides/become-guide/components/ThemeSelector"
import LanguageSelector from "../../features/guides/become-guide/components/LanguageSelector"
import AvailabilitySelector from "../../features/guides/become-guide/components/AvailabilitySelector"
import WeeklyEditor from "../../features/guides/become-guide/components/WeeklyEditor"
import DayEditor from "../../features/guides/become-guide/components/DayEditor"
import CapacitySelector from "../../features/guides/become-guide/components/CapacitySelector"
import { NavLink } from "react-router-dom"
import { FaUserPlus, FaSignInAlt, FaCompass, FaClipboardList, FaCalendarCheck, FaLanguage, FaTags, FaEuroSign, FaCheck, FaSave } from "react-icons/fa"

export default function BecomeGuidePage() {

    // States
    const guestGuidePaths = [
        {
            title: "Vous n'avez pas encore de compte ?",
            description: "Créez votre compte voyageur, puis transformez-le en profil guide.",
            actionLabel: "Créer un compte",
            actionTo: "/register",
            Icon: FaUserPlus,
            steps: [
                { title: "Créer un compte", text: "Renseignez vos informations personnelles pour accéder à GuidHeHo.", Icon: FaUserPlus },
                { title: "Se connecter", text: "Connectez-vous avec le compte que vous venez de créer.", Icon: FaSignInAlt },
                { title: "Cliquer sur Devenir guide", text: "Ouvrez la page dédiée depuis la navigation.", Icon: FaCompass },
                { title: "Remplir bio, ville et prix", text: "Présentez votre profil, votre zone d’activité et votre tarif horaire.", Icon: FaEuroSign },
                { title: "Choisir capacité, thèmes et langues", text: "Indiquez combien de voyageurs vous acceptez, vos spécialités et les langues parlées.", Icon: FaTags },
                { title: "Ajouter vos disponibilités", text: "Définissez vos jours et créneaux disponibles.", Icon: FaCalendarCheck },
                { title: "Valider le formulaire", text: "Envoyez votre demande pour créer votre profil guide.", Icon: FaClipboardList },
            ],
        },
        {
            title: "Vous avez déjà un compte ?",
            description: "Connectez-vous puis complétez directement votre profil guide.",
            actionLabel: "Se connecter",
            actionTo: "/login",
            Icon: FaSignInAlt,
            steps: [
                { title: "Se connecter", text: "Accédez à votre compte existant.", Icon: FaSignInAlt },
                { title: "Cliquer sur Devenir guide", text: "Utilisez le lien Devenir guide dans la navigation.", Icon: FaCompass },
                { title: "Remplir bio, ville et prix", text: "Ajoutez les informations qui permettront aux voyageurs de vous découvrir.", Icon: FaEuroSign },
                { title: "Choisir capacité, thèmes et langues", text: "Sélectionnez vos thèmes de visite, vos langues et le nombre de participants accepté.", Icon: FaLanguage },
                { title: "Ajouter vos disponibilités", text: "Créez vos créneaux à la semaine ou sur des jours précis.", Icon: FaCalendarCheck },
                { title: "Valider le formulaire", text: "Soumettez le formulaire pour activer votre profil guide.", Icon: FaClipboardList },
            ],
        },
    ]

    const {
        isAuthenticated,
        bio, setBio,
        city, setCity,
        price, setPrice,
        themes,
        languages,
        maxPeople, setMaxPeople,
        selectedThemes, setSelectedThemes,
        selectedLanguages, setSelectedLanguages,
        message,
        availabilityMode,
        setAvailabilityMode,
        weekStartDate, setWeekStartDate,
        weekTemplate,
        updateWeekDay, addWeekInterval, updateWeekInterval, removeWeekInterval,
        singleDays,
        addSingleDay, removeSingleDay, updateSingleDay,
        addSingleDayInterval, updateSingleDayInterval, removeSingleDayInterval,
        submitting,
        submitSummary,
        toggle,
        handleSubmit
    } = useBecomeGuide()

    if (!isAuthenticated) {
        return (
            <main className="px-5 py-8">
                <section className="mx-auto max-w-6xl space-y-8">
                    <header className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
                        <div className="flex flex-col justify-center">

                            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-200">
                                GuidHeHo
                            </p>
                            <h1 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
                                Devenir guide local
                            </h1>
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700 dark:text-teal-50">
                                Créez votre profil guide, renseignez votre bio, votre ville, votre prix, vos langues, vos thèmes de visite et vos disponibilités pour accueillir des voyageurs.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <NavLink
                                    to="/register"
                                    className="btn border-none bg-teal-500 text-white hover:bg-teal-600"
                                >
                                    <FaUserPlus aria-hidden="true" />
                                    Créer un compte
                                </NavLink>
                                <NavLink
                                    to="/login"
                                    className="btn border-teal-600 bg-white text-teal-700 hover:border-teal-500 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-100 dark:hover:bg-teal-800"
                                >
                                    <FaSignInAlt aria-hidden="true" />
                                    Se connecter
                                </NavLink>
                            </div>
                        </div>

                        <aside className="card h-full border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
                            <div className="card-body">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-100">
                                        <FaCompass aria-hidden="true" />
                                    </span>

                                    <div>
                                        <h2 className="card-title text-slate-900 dark:text-white">
                                            Votre profil guide
                                        </h2>
                                        <p className="text-sm text-slate-700 dark:text-teal-50">
                                            Complétez les informations utiles pour que les voyageurs puissent vous découvrir et réserver vos visites.
                                        </p>
                                    </div>
                                </div>

                                <div className="my-2 border-t border-teal-200 dark:border-teal-700" />

                                <div className="grid gap-3 text-sm text-slate-700 dark:text-teal-50">
                                    <p className="flex items-center gap-2">
                                        <FaCheck className="shrink-0 text-teal-700 dark:text-teal-100" aria-hidden="true" />
                                        <span>Bio, ville et tarif horaire</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaCheck className="shrink-0 text-teal-700 dark:text-teal-100" aria-hidden="true" />
                                        <span>Capacité maximale de personnes</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaCheck className="shrink-0 text-teal-700 dark:text-teal-100" aria-hidden="true" />
                                        <span>Thèmes proposés et Langues parlées</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaCheck className="shrink-0 text-teal-700 dark:text-teal-100" aria-hidden="true" />
                                        <span>Disponibilités à la semaine ou par journée</span>
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </header>

                    <section className="grid gap-5 lg:grid-cols-2">
                        {guestGuidePaths.map(({ title, description, actionLabel, actionTo, Icon, steps }) => (
                            <article
                                key={title}
                                className="card h-full border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70"
                            >
                                <div className="card-body flex h-full flex-col">
                                    <header className="flex items-center gap-3">
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-100">
                                            <Icon aria-hidden="true" />
                                        </span>

                                        <div>
                                            <h2 className="card-title text-slate-900 dark:text-white">
                                                {title}
                                            </h2>
                                            <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-teal-50">
                                                {description}
                                            </p>
                                        </div>
                                    </header>

                                    <ol className="mt-4 flex-1 space-y-3">
                                        {steps.map(({ title, text, Icon: StepIcon }, index) => (
                                            <li key={title} className="flex gap-3">
                                                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-100">
                                                    {index + 1}
                                                </span>

                                                <div className="w-full rounded-lg border border-teal-200 bg-white/70 p-3 dark:border-teal-700 dark:bg-teal-950/40">
                                                    <div className="flex items-center gap-2">
                                                        <StepIcon className="text-teal-700 dark:text-teal-100" aria-hidden="true" />
                                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                                            {title}
                                                        </h3>
                                                    </div>

                                                    <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-teal-50">
                                                        {text}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>

                                    <div className="mt-5">
                                        <NavLink
                                            to={actionTo}
                                            className="btn flex items-center gap-2 border-none bg-teal-500 text-white hover:bg-teal-600"
                                        >
                                            <Icon aria-hidden="true" />
                                            {actionLabel}
                                        </NavLink>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>

                </section>
            </main>
        )
    }

    // Affichage

    return (
        <main className="px-5 py-8">
            <section className="mx-auto max-w-6xl space-y-8">
                <header>
                    <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-200">
                        GuidHeHo
                    </p>
                    <h1 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
                        Créer mon profil guide
                    </h1>
                    <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700 dark:text-teal-50">
                        Renseignez vos informations, choisissez vos thèmes et vos langues, puis ajoutez vos disponibilités pour proposer vos visites aux voyageurs.
                    </p>
                </header>
                <section className="card border border-teal-600 bg-teal-50 shadow-sm dark:bg-teal-700/70">
                    <div className="card-body">
                        <header className="flex items-center gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-100">
                                <FaCompass aria-hidden="true" />
                            </span>

                            <div>
                                <h2 className="card-title text-slate-900 dark:text-white">
                                    Informations guide
                                </h2>
                                <p className="text-sm text-slate-700 dark:text-teal-50">
                                    Complétez les champs nécessaires pour créer votre profil guide.
                                </p>
                            </div>
                        </header>

                        <div className="my-2 border-t border-teal-200 dark:border-teal-700" />

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <section className="space-y-4 rounded-lg border border-teal-200 bg-white/70 p-4 dark:border-teal-700 dark:bg-teal-950/40">
                                <div className="flex items-center gap-2">
                                    <FaClipboardList className="text-teal-700 dark:text-teal-100" aria-hidden="true" />
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Informations du profil
                                    </h3>
                                </div>

                                <GuideProfileFields
                                    bio={bio}
                                    setBio={setBio}
                                    city={city}
                                    setCity={setCity}
                                    price={price}
                                    setPrice={setPrice}
                                />
                            </section>

                            <section className="space-y-4 rounded-lg border border-teal-200 bg-white/70 p-4 dark:border-teal-700 dark:bg-teal-950/40">
                                <div className="flex items-center gap-2">
                                    <FaUserPlus className="text-teal-700 dark:text-teal-100" aria-hidden="true" />
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Capacité d'accueil
                                    </h3>
                                </div>

                                <CapacitySelector
                                    maxPeople={maxPeople}
                                    setMaxPeople={setMaxPeople}
                                />
                            </section>

                            <section className="space-y-4 rounded-lg border border-teal-200 bg-white/70 p-4 dark:border-teal-700 dark:bg-teal-950/40">
                                <div className="flex items-center gap-2">
                                    <FaTags className="text-teal-700 dark:text-teal-100" aria-hidden="true" />
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Thèmes et langues
                                    </h3>
                                </div>

                                <ThemeSelector
                                    themes={themes}
                                    selectedThemes={selectedThemes}
                                    setSelectedThemes={setSelectedThemes}
                                    toggle={toggle}
                                />

                                <LanguageSelector
                                    languages={languages}
                                    selectedLanguages={selectedLanguages}
                                    setSelectedLanguages={setSelectedLanguages}
                                    toggle={toggle}
                                />

                            </section>

                            <section className="space-y-4 rounded-lg border border-teal-200 bg-white/70 p-4 dark:border-teal-700 dark:bg-teal-950/40">
                                <div className="flex items-center gap-2">
                                    <FaCalendarCheck className="text-teal-700 dark:text-teal-100" aria-hidden="true" />
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Disponibilités
                                    </h3>
                                </div>

                                <AvailabilitySelector
                                    availabilityMode={availabilityMode}
                                    setAvailabilityMode={setAvailabilityMode}
                                />

                                <WeeklyEditor
                                    availabilityMode={availabilityMode}
                                    weekStartDate={weekStartDate}
                                    setWeekStartDate={setWeekStartDate}
                                    weekTemplate={weekTemplate}
                                    updateWeekDay={updateWeekDay}
                                    addWeekInterval={addWeekInterval}
                                    updateWeekInterval={updateWeekInterval}
                                    removeWeekInterval={removeWeekInterval}
                                />

                                <DayEditor
                                    availabilityMode={availabilityMode}
                                    singleDays={singleDays}
                                    addSingleDay={addSingleDay}
                                    removeSingleDay={removeSingleDay}
                                    updateSingleDay={updateSingleDay}
                                    addSingleDayInterval={addSingleDayInterval}
                                    updateSingleDayInterval={updateSingleDayInterval}
                                    removeSingleDayInterval={removeSingleDayInterval}
                                />
                            </section>

                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn border-none bg-teal-500 text-white hover:bg-teal-600 disabled:bg-slate-300 disabled:text-slate-500"
                                >
                                    <FaSave aria-hidden="true" />
                                    {submitting ? "Création..." : "Devenir guide"}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </section>
            {(message || submitSummary) && (
                <div className="toast toast-start z-50">
                    {message && (
                        <div className="alert border border-teal-600 bg-teal-50 text-teal-700 shadow-lg dark:bg-teal-950 dark:text-teal-100">
                            <span>{message}</span>
                        </div>
                    )}

                    {submitSummary && (
                        <div className="alert border border-teal-600 bg-white text-slate-700 shadow-lg dark:bg-teal-950 dark:text-teal-50">
                            <span>{submitSummary}</span>
                        </div>
                    )}
                </div>
            )}
        </main>
    )
}

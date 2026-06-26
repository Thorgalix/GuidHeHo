export default function AvailabilitySelector({ availabilityMode, setAvailabilityMode }) {

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Type d’ajout
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-teal-200 bg-white/70 p-4 text-slate-700 transition hover:border-teal-500 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-50">
                    <input
                        type="radio"
                        name="availability_mode"
                        checked={availabilityMode === "week"}
                        onChange={() => setAvailabilityMode("week")}
                        className="radio radio-sm border-teal-600 checked:bg-teal-600"
                    />
                    <span>
                        <span className="block font-semibold text-slate-900 dark:text-white">Semaine</span>
                        <span className="text-sm text-slate-600 dark:text-teal-100">Ajoutez plusieurs jours sur une même semaine.</span>
                    </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-teal-200 bg-white/70 p-4 text-slate-700 transition hover:border-teal-500 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-50">
                    <input
                        type="radio"
                        name="availability_mode"
                        checked={availabilityMode === "day"}
                        onChange={() => setAvailabilityMode("day")}
                        className="radio radio-sm border-teal-600 checked:bg-teal-600"
                    />
                    <span>
                        <span className="block font-semibold text-slate-900 dark:text-white">Jours précis</span>
                        <span className="text-sm text-slate-600 dark:text-teal-100">Ajoutez une ou plusieurs dates indépendantes.</span>
                    </span>
                </label>
            </div>
        </div>
    )
}

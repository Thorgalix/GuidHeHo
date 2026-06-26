import { FaPlus, FaTrash } from "react-icons/fa"

export default function WeeklyEditor({
    availabilityMode,
    weekStartDate,
    setWeekStartDate,
    weekTemplate,
    updateWeekDay,
    addWeekInterval,
    updateWeekInterval,
    removeWeekInterval,
}) {

    return (
        <div>
            {availabilityMode === "week" && (
                <div className="space-y-4">
                    <label className="form-control max-w-sm">
                        <div className="label">
                            <span className="label-text font-semibold text-slate-900 dark:text-white">
                                Lundi de référence
                            </span>
                        </div>
                        <input
                            type="date"
                            value={weekStartDate}
                            onChange={(e) => setWeekStartDate(e.target.value)}
                            required
                            className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                        />
                    </label>

                    {weekTemplate.map((day, dayIndex) => (
                        <div
                            key={day.label}
                            className="rounded-lg border border-teal-200 bg-white/70 p-4 dark:border-teal-700 dark:bg-teal-950/40"
                        >
                            <label className="flex cursor-pointer items-center gap-3 text-slate-700 dark:text-teal-50">
                                <input
                                    type="checkbox"
                                    checked={day.enabled}
                                    onChange={(e) => updateWeekDay(dayIndex, "enabled", e.target.checked)}
                                    className="checkbox checkbox-sm border-teal-600 checked:border-teal-600 checked:bg-teal-600"
                                />
                                <span className="font-semibold text-slate-900 dark:text-white">{day.label}</span>
                            </label>

                            {day.enabled && (
                                <div className="mt-4 space-y-3">
                                    {day.intervals.map((interval, intervalIndex) => (
                                        <div
                                            key={`${day.label}-${intervalIndex}`}
                                            className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
                                        >
                                            <label className="form-control">
                                                <div className="label py-1">
                                                    <span className="label-text text-xs font-semibold text-slate-700 dark:text-teal-50">
                                                        Début
                                                    </span>
                                                </div>
                                                <input
                                                    type="time"
                                                    value={interval.start_time}
                                                    onChange={(e) =>
                                                        updateWeekInterval(dayIndex, intervalIndex, "start_time", e.target.value)
                                                    }
                                                    required
                                                    className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                                                />
                                            </label>

                                            <label className="form-control">
                                                <div className="label py-1">
                                                    <span className="label-text text-xs font-semibold text-slate-700 dark:text-teal-50">
                                                        Fin
                                                    </span>
                                                </div>
                                                <input
                                                    type="time"
                                                    value={interval.end_time}
                                                    onChange={(e) =>
                                                        updateWeekInterval(dayIndex, intervalIndex, "end_time", e.target.value)
                                                    }
                                                    required
                                                    className="input input-bordered w-full border-teal-600 bg-white text-slate-900 focus:outline-none dark:bg-teal-950 dark:text-teal-50"
                                                />
                                            </label>

                                            <button
                                                type="button"
                                                onClick={() => removeWeekInterval(dayIndex, intervalIndex)}
                                                disabled={day.intervals.length === 1}
                                                className="btn border-none bg-red-600 text-white hover:bg-red-700 disabled:bg-slate-300 disabled:text-slate-500"
                                            >
                                                <FaTrash aria-hidden="true" />
                                                Supprimer
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => addWeekInterval(dayIndex)}
                                        className="btn border-none bg-teal-500 text-white hover:bg-teal-600"
                                    >
                                        <FaPlus aria-hidden="true" />
                                        Ajouter un créneau
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

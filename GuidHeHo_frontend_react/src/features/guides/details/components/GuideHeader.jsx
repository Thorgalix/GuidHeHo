import GuideProfileSummary from "./GuideProfileSummary"

export default function GuideHeader({ guide }) {
    if (!guide) return null

    const BACKEND_URL = "http://127.0.0.1:8000"

    const profilePictureUrl = guide?.user?.profile_picture
        ? guide.user.profile_picture.startsWith("http")
            ? guide.user.profile_picture
            : `${BACKEND_URL}${guide.user.profile_picture.startsWith("/") ? "" : "/"}${guide.user.profile_picture}`
        : null

    const fullName = `${guide.user.first_name} ${guide.user.last_name}`

    return (
        <div className="flex flex-col gap-6 md:flex-row-reverse md:items-start">
            <div className="shrink-0">
                {profilePictureUrl ? (
                    <img
                        src={profilePictureUrl}
                        alt={fullName}
                        className="h-32 w-32 rounded-full border border-teal-600 bg-base-300 object-cover shadow-sm"
                    />
                ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border border-teal-600 bg-teal-100 text-3xl font-bold text-teal-700 shadow-sm dark:bg-teal-950 dark:text-teal-100">
                        <span>
                            {guide.user.first_name?.[0]}
                            {guide.user.last_name?.[0]}
                        </span>
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-200">
                    Guide local
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                    {fullName}
                </h2>

                <p className="mt-4 leading-7 text-slate-700 dark:text-teal-50">
                    {guide.bio || "Ce guide n’a pas encore ajouté de biographie."}
                </p>

                <div className="mt-5 rounded-lg border border-teal-200 bg-white/60 p-4 dark:border-teal-700 dark:bg-teal-950/40">
                    <GuideProfileSummary guide={guide} />
                </div>
            </div>
        </div>
    )
}

import { NavLink } from "react-router-dom"
import { FaUser, FaCompass } from "react-icons/fa"

export default function DashboardTabs({ activeTab, setActiveTab, isGuide }) {

    return (
        <div className="mx-auto flex w-fit rounded-full bg-teal-100 p-1 shadow-sm dark:bg-teal-900">
            <button
                type="button"
                aria-pressed={activeTab === "traveler"}
                onClick={() => setActiveTab("traveler")}
                className={`btn rounded-full border-none px-6 ${activeTab === "traveler"
                        ? "bg-teal-600 text-white hover:bg-teal-700"
                        : "bg-transparent text-teal-700 hover:bg-teal-200 dark:text-teal-100 dark:hover:bg-teal-800"
                    }`}
            >
                <FaUser className="mr-2" />
                Voyageur
            </button>

            {isGuide ? (
                <button
                    type="button"
                    aria-pressed={activeTab === "guide"}
                    onClick={() => setActiveTab("guide")}
                    className={`btn rounded-full border-none px-6 ${activeTab === "guide"
                            ? "bg-teal-600 text-white hover:bg-teal-700"
                            : "bg-transparent text-teal-700 hover:bg-teal-200 dark:text-teal-100 dark:hover:bg-teal-800"
                        }`}
                >
                    <FaCompass className="mr-2" />
                    Guide
                </button>
            ) : (
                <NavLink
                    to="/become-guide"
                    className="btn rounded-full border-none bg-transparent px-6 text-teal-700 hover:bg-teal-200 dark:text-teal-100 dark:hover:bg-teal-800"
                >
                    Guide (devenir guide)
                </NavLink>
            )}
        </div>
    )
}

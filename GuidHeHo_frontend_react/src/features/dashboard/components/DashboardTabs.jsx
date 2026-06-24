import { NavLink } from "react-router-dom"

export default function DashboardTabs({ activeTab, setActiveTab, isGuide }) {
    
    return (
        <div>
            <button
                type="button"
                aria-pressed={activeTab === "traveler"}
                onClick={() => setActiveTab("traveler")}
            >
                Voyageur
            </button>
            {isGuide ? (
                <button
                    type="button"
                    aria-pressed={activeTab === "guide"}
                    onClick={() => setActiveTab("guide")}
                >
                    Guide
                </button>
            ) : (
                <button className="opacity-70"><NavLink to="/become-guide">
                    Guide (devenir guide)
                </NavLink></button>
            )}
        </div>
    )
}

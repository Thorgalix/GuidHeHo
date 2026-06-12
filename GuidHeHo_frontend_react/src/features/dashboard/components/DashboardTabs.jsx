import { NavLink } from "react-router-dom"

export default function DashboardTabs({ activeTab, setActiveTab, isGuide }) {
    
    return (
        <div>
            <button onClick={() => setActiveTab("traveler")}>
                Traveler
            </button>
            {isGuide ? (
                <button onClick={() => setActiveTab("guide")}>
                    Guide
                </button>
            ) : (
                <button className="opacity-70"><NavLink to="/become-guide">
                    Guide (Become guide)
                </NavLink></button>
            )}
        </div>
    )
}
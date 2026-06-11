

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
                <button disabled className="opacity-50 cursor-not-allowed">
                    Guide (Become guide)
                </button>
            )}
        </div>
    )
}
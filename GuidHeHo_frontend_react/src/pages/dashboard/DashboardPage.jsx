import { useState, useContext } from "react";
import ProfileTravelerTab from "../../features/dashboard/components/ProfileTravelerTab";
import DashboardTabs from "../../features/dashboard/components/DashboardTabs";
import { AuthContext } from "../../context/auth-context";
import ProfileGuideTab from "../../features/dashboard/components/ProfileGuideTab";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("traveler")
    const { user } = useContext(AuthContext)
    const isGuide = user?.role === "guide"

    return (
        <main className="px-5 py-8">
            <section className="mx-auto max-w-6xl space-y-8">
                <header>
                    <label className="text-2xl font-bold">Tableau de bord</label>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Bienvenue, {user?.first_name} {user?.last_name}</h1>
                </header>

                <DashboardTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isGuide={isGuide}
                />
                <div className="space-y-6">
                    {activeTab === "traveler" && <ProfileTravelerTab user={user} />}
                    {activeTab === "guide" && <ProfileGuideTab user={user} />}
                </div>

            </section>
        </main>
    )

}
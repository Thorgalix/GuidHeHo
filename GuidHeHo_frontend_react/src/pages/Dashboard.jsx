import { useState, useContext } from "react";
import ProfileTravelerTab from "../components/dashboard/ProfileTravelerTab";
import DashboardTabs from "../components/dashboard/DashboardTabs";
import { AuthContext } from "../context/AuthContext";
import TravelerBookingsTab from "../components/dashboard/TravelerBookingsTab";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("traveler")
    const { user } = useContext(AuthContext)
    const isGuide = user?.role === "guide"

    return (
        <div>
            <div>

                <DashboardTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isGuide={isGuide}
                />
            </div>
            <div>
                {activeTab === "traveler" && <ProfileTravelerTab user={user} />}
                {activeTab === "guide" && <p>Guide Dashboard (to be implemented)</p>}
            </div>
        


        </div>
    )

}
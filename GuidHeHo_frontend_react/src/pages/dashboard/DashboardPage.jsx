import { useState, useContext } from "react";
import ProfileTravelerTab from "../../features/dashboard/components/ProfileTravelerTab";
import DashboardTabs from "../../features/dashboard/components/DashboardTabs";
import { AuthContext } from "../../context/AuthContext";
import ProfileGuideTab from "../../features/dashboard/components/ProfileGuideTab";

export default function DashboardPage() {
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
                {activeTab === "guide" && <ProfileGuideTab user={user} />}
            </div>
        


        </div>
    )

}
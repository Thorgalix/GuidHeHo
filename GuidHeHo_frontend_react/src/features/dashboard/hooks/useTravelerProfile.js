import { useEffect, useState } from "react"
import { api } from "../../../services/api"

export function useTravelerProfile(user) {
    const [traveler, setTraveler] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        let isMounted = true

        async function loadTravelerProfile() {
            if (!user) {
                if (isMounted) {
                    setTraveler(null)
                    setLoading(false)
                    setError("")
                }
                return
            }

            if (isMounted) {
                setLoading(true)
                setError("")
            }

            try {
                const profile = await api.get("/users/me/")
                if (isMounted) setTraveler(profile)
            } catch {
                if (isMounted) {
                    setTraveler(null)
                    setError("Unable to load traveler profile for now.")
                }
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        loadTravelerProfile()

        return () => {
            isMounted = false
        }
    }, [user])

    function updateTravelerProfile(nextTraveler) {
        setTraveler(nextTraveler)
    }

    return {
        traveler,
        loading,
        error,
        updateTravelerProfile,
    }
}
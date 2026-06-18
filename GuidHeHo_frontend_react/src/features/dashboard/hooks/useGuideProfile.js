import { useEffect, useState } from "react"
import { api } from "../../../services/api"

export function useGuideProfile(user) {
    const isGuide = user?.role === "guide"
    const [guide, setGuide] = useState(null)
    const [loading, setLoading] = useState(isGuide)
    const [error, setError] = useState("")

    useEffect(() => {
        let isMounted = true

        async function loadGuideProfile() {
            if (!isGuide) {
                if (isMounted) {
                    setGuide(null)
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
                const guideProfile = await api.get("/api/guides/me/")
                if (isMounted) setGuide(guideProfile)
            } catch {
                if (isMounted) {
                    setGuide(null)
                    setError("Unable to load guide profile for now.")
                }
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        loadGuideProfile()

        return () => {
            isMounted = false
        }
    }, [isGuide])

    return {
        isGuide,
        guide,
        setGuide,
        loading,
        error,
    }
}
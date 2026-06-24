import { useEffect, useState } from "react"
import { api } from "../../../../services/api"

// Hook dédié au chargement de la page détail d'un guide.
export function useGuideDetails(id) {
    // States
    const [guide, setGuide] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [availabilities, setAvailabilities] = useState([])
    const [profilePictureUrl, setProfilePictureUrl] = useState("")

    // Comportements
    useEffect(() => {
        // Cette variable évite de mettre à jour le state après un démontage.
        let isCancelled = false

        async function fetchGuideDetails() {
            try {
                setLoading(true)
                setError("")

                // On charge le guide et ses disponibilités en parallèle.
                const [guideData, availabilitiesData] = await Promise.all([
                    api.get(`/api/guides/${id}/`),
                    api.get(`/api/availabilities/?guide=${id}`),
                ])

                if (isCancelled) return

                setGuide(guideData)
                setProfilePictureUrl(guideData.profile_picture_url)
                setAvailabilities(
                    // On garde uniquement les créneaux encore réservables, triés par date.
                    (availabilitiesData.results ?? [])
                        .filter((availability) => availability.is_available)
                        .sort(
                            (first, second) =>
                                new Date(first.start_datetime) - new Date(second.start_datetime)
                        )
                )
            } catch (err) {
                if (!isCancelled) {
                    setError(err.message)
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false)
                }
            }
        }

        fetchGuideDetails()

        return () => {
            isCancelled = true
        }
    }, [id])

    return {
        guide,
        loading,
        error,
        availabilities,
        profilePictureUrl,
    }
}
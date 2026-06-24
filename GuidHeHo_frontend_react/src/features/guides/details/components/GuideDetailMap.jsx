import { useEffect, useRef } from "react"
import { loadMapbox } from "../../../../shared/mapbox/loadMapbox"

export default function GuideDetailMap({ guide }) {
    // States
    const mapRef = useRef(null)
    const mapInstance = useRef(null)

    // Comportements
    useEffect(() => {
        if (!guide) return

        let isCancelled = false

        loadMapbox()
            .then((mapboxgl) => {
                if (isCancelled || !mapRef.current) return

                const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
                mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

                mapInstance.current = new mapboxgl.Map({
                    container: mapRef.current,
                    style: isDarkMode ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/streets-v12",
                    center: [guide.longitude, guide.latitude],
                    zoom: 11,
                })

                new mapboxgl.Marker()
                    .setLngLat([guide.longitude, guide.latitude])
                    .addTo(mapInstance.current)
            })
            .catch(() => {})

        return () => {
            isCancelled = true
            mapInstance.current?.remove()
        }
    }, [guide])


    // Affichage
    return (
        <div
            ref={mapRef}
            className="h-80 w-full overflow-hidden rounded-lg border border-teal-600 bg-teal-100 shadow-sm dark:bg-teal-950"
        />
    )
}

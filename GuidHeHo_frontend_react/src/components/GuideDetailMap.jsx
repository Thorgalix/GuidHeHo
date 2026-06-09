import { useEffect, useRef } from "react"

export default function GuideDetailMap({ guide }) {
    // States
    const mapRef = useRef(null)
    const mapInstance = useRef(null)

    // Comportements
    useEffect(() => {
        // On attend d'avoir le guide et Mapbox avant d'initialiser la carte.
        if (!guide || !window.mapboxgl || !mapRef.current) return

        window.mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

        mapInstance.current = new window.mapboxgl.Map({
            container: mapRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [guide.longitude, guide.latitude],
            zoom: 11,
        })

        new window.mapboxgl.Marker()
            .setLngLat([guide.longitude, guide.latitude])
            .addTo(mapInstance.current)

        return () => mapInstance.current?.remove()
    }, [guide])

    // Affichage
    return <div ref={mapRef} style={{ width: "100%", height: "400px", marginTop: "20px" }} />
}
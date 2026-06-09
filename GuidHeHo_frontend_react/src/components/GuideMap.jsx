import { useEffect, useRef } from "react"

export default function GuideMap({ guides }) {

    // States

    const mapRef = useRef(null)
    const mapInstance = useRef(null)
    const markersRef = useRef([])

    // Comportements

    useEffect(() => {
        if (!window.mapboxgl) return

        window.mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

        mapInstance.current = new window.mapboxgl.Map({
            container: mapRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [2.3522, 48.8566], // Paris
            zoom: 5
        })

        return () => mapInstance.current?.remove()
    }, [])

    useEffect(() => {
        if (!mapInstance.current) return

        //  clear markers
        markersRef.current.forEach((m) => m.remove())
        markersRef.current = []

        const bounds = new window.mapboxgl.LngLatBounds()
        let hasValidPoint = false

        guides.forEach((guide) => {
            if (!guide.latitude || !guide.longitude) return

            const lngLat = [guide.longitude, guide.latitude]

            const marker = new window.mapboxgl.Marker()
                .setLngLat(lngLat)
                .setPopup(
                    new window.mapboxgl.Popup().setHTML(`
                        <strong>${guide.user.first_name}</strong><br/>
                        ${guide.city}
                    `)
                )
                .addTo(mapInstance.current)

            markersRef.current.push(marker)
            bounds.extend(lngLat)
            hasValidPoint = true
        })

        if (hasValidPoint) {
            mapInstance.current.fitBounds(bounds, { 
                padding: 60,
                maxZoom: 10, 
            })
        }
    }, [guides])

    // Affichage
    return (
        <div
            ref={mapRef}
            style={{ width: "100%", height: "400px", marginTop: "20px" }}
        />
    )
}
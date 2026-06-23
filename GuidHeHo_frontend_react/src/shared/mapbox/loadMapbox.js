const MAPBOX_VERSION = "v3.24.0"
const MAPBOX_CSS_ID = "mapbox-gl-css"
const MAPBOX_SCRIPT_ID = "mapbox-gl-js"

let mapboxLoadPromise

export function loadMapbox() {
    if (window.mapboxgl) return Promise.resolve(window.mapboxgl)

    if (!mapboxLoadPromise) {
        mapboxLoadPromise = new Promise((resolve, reject) => {
            if (!document.getElementById(MAPBOX_CSS_ID)) {
                const link = document.createElement("link")
                link.id = MAPBOX_CSS_ID
                link.rel = "stylesheet"
                link.href = `https://api.mapbox.com/mapbox-gl-js/${MAPBOX_VERSION}/mapbox-gl.css`
                document.head.appendChild(link)
            }

            const existingScript = document.getElementById(MAPBOX_SCRIPT_ID)
            if (existingScript) {
                existingScript.addEventListener("load", () => resolve(window.mapboxgl), { once: true })
                existingScript.addEventListener("error", reject, { once: true })
                return
            }

            const script = document.createElement("script")
            script.id = MAPBOX_SCRIPT_ID
            script.src = `https://api.mapbox.com/mapbox-gl-js/${MAPBOX_VERSION}/mapbox-gl.js`
            script.async = true
            script.onload = () => resolve(window.mapboxgl)
            script.onerror = reject
            document.body.appendChild(script)
        })
    }

    return mapboxLoadPromise
}

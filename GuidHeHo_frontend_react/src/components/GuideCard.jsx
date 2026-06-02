import { Link } from "react-router-dom"

export default function GuideCard({ guide }) {
    return (
        <Link
            to={`/guides/${guide.id}`}
            className="guide-card"
            style={{ display: "block", border: "solid", paddingLeft: "20px", textAlign:"justify", textDecoration: "none", color: "inherit"}}
        >

            <h3>
                {guide.user.first_name} {guide.user.last_name}
            </h3>

            <p>{guide.city}</p>
            <p>{guide.price_per_hour}€/hour</p>
            <p>{guide.bio}</p>

            <p>
                {guide.languages?.join(", ") || "No languages"}
            </p>

            <p>
                {guide.themes?.join(", ") || "No themes"}
            </p>

        </Link>
    )
}
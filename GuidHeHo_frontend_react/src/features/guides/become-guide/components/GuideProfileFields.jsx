export default function GuideProfileFields({ bio, setBio, city, setCity, price, setPrice, maxPeople, setMaxPeople }) {


    return (
        <div>
            <div>
                <input placeholder="Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />


                <input placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />

                <input type="number" placeholder="Price per hour"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

            </div>
        </div>
    )
}

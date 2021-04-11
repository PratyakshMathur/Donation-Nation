
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: donation.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
    
});


new mapboxgl.Marker()
    .setLngLat(donation.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 5 })
            .setHTML(
                `<h3>${donation.title}</h3><p>${donation.location}</p>`
            )
    )
    .addTo(map)
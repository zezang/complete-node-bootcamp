
const locations = JSON.parse(document.querySelector('#map').dataset.locations);
console.log(locations);


mapboxgl.accessToken = 'pk.eyJ1IjoiemV6YW5nIiwiYSI6ImNsN3BjdjFyNTEwODYzdnJzdW8yaGo4N3MifQ.7Arh4EBAoScr7JtE_wa5Ng';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/zezang/cl7pea47s000216qy7b06118t',
    scrollZoom: false // style URL
});

map.on('style.load', () => {
map.setFog({}); // Set the default atmosphere style
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    new mapboxgl.Popup({
        offset: 30
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map)

    bounds.extend(loc.coordinates);
})

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }   
})
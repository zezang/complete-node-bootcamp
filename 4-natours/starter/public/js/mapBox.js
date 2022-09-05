
const locations = JSON.parse(document.querySelector('#map').dataset.locations);
console.log(locations);


mapboxgl.accessToken = 'pk.eyJ1IjoiemV6YW5nIiwiYSI6ImNsN3BjdjFyNTEwODYzdnJzdW8yaGo4N3MifQ.7Arh4EBAoScr7JtE_wa5Ng';

const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: [-74.5, 40], // starting position [lng, lat]
zoom: 9, // starting zoom
projection: 'globe' // display the map as a 3D globe
});

map.on('style.load', () => {
map.setFog({}); // Set the default atmosphere style
});

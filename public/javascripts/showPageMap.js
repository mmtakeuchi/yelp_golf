mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: course.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(course.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${course.name}</h3><p>${course.location}</p>`
    )
  )
  .addTo(map);

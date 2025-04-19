mapboxgl.accessToken = mapboxToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  projection: "globe",
  zoom: 8,
  center: JSON.parse(campground).geometry.coordinates,
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker({})
  .setLngLat(JSON.parse(campground).geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `
      <div class="m-3">
        <h5 class="mt-3">${JSON.parse(campground).title}</h5>
        <p>${JSON.parse(campground).location}</p>
      </div>
      `,
    ),
  )
  .addTo(map);

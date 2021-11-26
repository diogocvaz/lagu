console.log('here')

var coord = [0,0];

function mapCreation(coord) {
    var mymap = L.map('map').setView([coord[0], coord[1]], 5);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGN2YXoiLCJhIjoiY2t3YjBrYzVvMTNwazJ3cDJ6ZGcwdnZncCJ9.n0jWV5AK1kcTIEhVr7yY4g', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);

    var marker = L.marker([coord[0], coord[1]]).addTo(mymap);
}

mapCreation(coord);

export function boot(infoWindow){

    infoWindow.document.write("<head>");
    infoWindow.document.write("<link rel='stylesheet' href='https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'")
    infoWindow.document.write("integrity='sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=='")
    infoWindow.document.write("crossorigin=''/>");
    infoWindow.document.write("<script src='https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'>")
    infoWindow.document.write("integrity='sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=='")
    infoWindow.document.write("crossorigin=''>")
    infoWindow.document.write("</script>")
    infoWindow.document.write("</head>")


    infoWindow.document.write("<body>");


    infoWindow.document.write("<div id='containerLeft'>");
    infoWindow.document.write("<div id='containerTop'>");
    infoWindow.document.write("<div id='logoDisp'>")
    infoWindow.document.write("<img id='logoimgDisp' src='https://dialcava.com/avprojects/lagu/lagu_logo_w.70b6cf4b.png'>");
    infoWindow.document.write("</div>")
    infoWindow.document.write("<div id='containerInfo'>");
    infoWindow.document.write("<div id=location>now in </div>");
    infoWindow.document.write("<div id='localtime'>local time is</div>");
    infoWindow.document.write("<div id='temp'>temperature:</div>");
    infoWindow.document.write("<div id='BPM'>windspeed:</div>");
    infoWindow.document.write("<div id='scale'>playing in</div>");
    infoWindow.document.write("<div id='forecast'>forecast:</div>");
    infoWindow.document.write("<div id='clouds'>clouds:</div>");
    infoWindow.document.write("<div id=entry0 style='opacity: 0.2'>.</div>");
    infoWindow.document.write("<div id=entry1 style='opacity: 0.4'>.</div>");
    infoWindow.document.write("<div id=entry2 style='opacity: 0.6'>.</div>");
    infoWindow.document.write("<div id=entry3 style='opacity: 0.8'>.</div>");
    infoWindow.document.write("<div id=entry4 style='opacity: 1'>.</div>"); 
    infoWindow.document.write("</div>");
    infoWindow.document.write("</div>");
    infoWindow.document.write("<div id='map'></div>");
    infoWindow.document.write("</div>");
    infoWindow.document.write("<div id='description'>In the midst of a global pandemic, reality went through profound deformations. While the physical body was forced to stay indoors, the mind was moving at a remarkable speed, creating an unprecedent feeling of diffraction, where <div id='highlight'>the self became fully detached from its location</div>. The constant stream of news and (mis)information trapped us in a state of disorientation, which was normally sustained by added doses of similar media, and inevitably leads to a never-ending search for fragments of a coherent reality.<br><br>LAGU is <div id='highlight'>an endless audio-visual generative algorithm</div> that creates an indoor experience by simulating the feeling of a location, allowing the viewer to halt and synchronize himself back with the physical world through virtual windows. <div id='highlight'>It is designed to run forever without human input</div>, following pre-established rules and being <div id='highlight'>modulated in real-time by weather conditions</div>. This generative nature allows the system to develop itself in unpredictable ways, with simple audio layers and visual commands overlapping each other to create new patterns and textures every single run.<br><br>Location change every: 15 min");
    infoWindow.document.write("<br><br>");
    infoWindow.document.write("<img id='contact' src='http://dialcava.com/LAGUlive/cont.jpg'>");
    infoWindow.document.write("more info:   ");
    infoWindow.document.write("<img id='qrcode' src='http://dialcava.com/LAGUlive/qrcode.jpg'>");
    infoWindow.document.write("</div>");
    infoWindow.document.write("<script>");
    infoWindow.document.write(`
    
    var mymap;
    var marker;

    function mapCreation(coord) {
        mymap = L.map('map').setView([coord[0], coord[1]], 5);
    
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGN2YXoiLCJhIjoiY2t3YjBrYzVvMTNwazJ3cDJ6ZGcwdnZncCJ9.n0jWV5AK1kcTIEhVr7yY4g', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'your.mapbox.access.token'
        }).addTo(mymap);
    
        marker = L.marker([coord[0], coord[1]], {opacity: 0.8}).addTo(mymap);

    }
    
    function mapChange(coord){
        marker.setLatLng([coord[0], coord[1]])
        mymap.setView([coord[0], coord[1]], 5);
    }

    `);
    infoWindow.document.write("</script>");

    infoWindow.document.write("</body>");
    infoWindow.document.write(`<style>

body{background-color: black;
display: flex;
font-size: 20px;
font-family: 'Ubuntu Mono', monospace;
color: white;}

#containerLeft{
  display: inline-block;
  height:300px;
  width:60%;
}

#containerTop{
  display:flex;
}

#logoimgDisp{
    margin: 30px;
    margin-left: 50px;
    max-width: 250px;
}

#containerInfo{
  margin: 30px;
  font-size: 25px;
}

#map{
    background-color: #050505;
  margin: 50px;
  margin-top: 20px;
  width: 760px;
  height: 520px;
}

#description{
  display: inline-block;
  width:40%;
  margin: 30px;
  margin-left: 0;
  font-size: 23px;
}

#qrcode{
    max-width: 100px;
}
#contact{
    max-width: 250px;
    margin-right: 15px;
}
#location{
    color: yellow;
}

#highlight{
  display: inline;
  color: orange;
  font-weight: normal;
}

    
    </style>`);
    infoWindow.document.close();
}
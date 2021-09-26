
export function boot(infoWindow){

infoWindow.document.write("<head></head>");
infoWindow.document.write("<body>");
    infoWindow.document.write("<div id='containerbottom'>");
    infoWindow.document.write("<div id='container'>");
    infoWindow.document.write("<div id=timeDisplay>runtime:</div>");
    infoWindow.document.write("<div id=location>location:</div>");
    infoWindow.document.write("<div id=BPM>BPM:</div>");
    infoWindow.document.write("<div id=scale>playing in</div>");
    infoWindow.document.write("<div id=fetchtime>last weather fetch at</div>");
    infoWindow.document.write("<div id=entry0 style='opacity: 0.2'>.</div>");
    infoWindow.document.write("<div id=entry1 style='opacity: 0.4'>.</div>");
    infoWindow.document.write("<div id=entry2 style='opacity: 0.6'>.</div>");
    infoWindow.document.write("<div id=entry3 style='opacity: 0.8'>.</div>");
    infoWindow.document.write("<div id=entry4 style='opacity: 1'>.</div>"); 
    infoWindow.document.write("</div>");

    infoWindow.document.write("<div id='description'><br><br>LAGU (v0.4) is a generative audio system, where ambient audio is slowly and endlessly created based on ever changing weather conditions. Powered by Tone.js and p5.js<br><br><u>How it works</u>: The system starts by fetching the local weather forecast, which is used to decide the scale, playback speed, visual effects and the pool of possible pre-recorded instruments. Randomly selected instruments and properties (notes, note duration, reverb, etc) are assigned to each of the four layers.<br>The volume of each layer and individual notes decay overtime. After the volume reaches zero, layers are reborn with a new random instrument and properties (based on newly fetched forecast), and new random notes are assigned within the current scale (red lights).<br>Every 10 minutes the local weather conditions are refetched, updating the playback speed, scale, visuals and choice of new instruments. This process runs forever and is always unique.<br><a target='_blank' href='https://dialcava.com/avprojects/lagu/content/extended-description-lagu.pdf'>Extended project description (pdf).</a></div>");
    
    infoWindow.document.write("</div>");
    infoWindow.document.write("</body>");
    infoWindow.document.write("<style>body{background-color: black;}#containerbottom{margin: 50px 35px 35px 35px;font-size: 20px;min-width: 400px;font-family: 'Open Sans', sans-serif;text-align: left;color: white;z-index: 1;}</style>");



    


}
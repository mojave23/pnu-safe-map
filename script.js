let map;

const markers = {
    cctv: [],
    lamp: [],
    bell: [],
    store: []
};

async function initMap(){

    const pnu = { lat:35.2332, lng:129.0821 };

    map = new google.maps.Map(document.getElementById("map"), {
    center:pnu,
    zoom:16
    });

    loadFacilities();
}

function getIcon(type){

    if(type==="cctv") return "📷";
    if(type==="lamp") return "💡";
    if(type==="bell") return "🚨";
    if(type==="store") return "🏪";

    return "📍";
}

function makeMarkerContent(type){

    const div = document.createElement("div");
    div.style.fontSize = "32px";
    div.style.lineHeight = "1";
    div.textContent = getIcon(type);

    return div;
}

function loadFacilities(){

    fetch("data/facilities.csv")
    .then(response=>response.text())
    .then(csvData=>{

        const result = Papa.parse(csvData,{
            header:true,
            skipEmptyLines:true
        });

        result.data.forEach(item=>{

            const lat = parseFloat(item.lat);
            const lng = parseFloat(item.lng);

            if(Number.isNaN(lat) || Number.isNaN(lng)){
                return;
            }

            const marker = new google.maps.Marker({
            position:{ lat:lat, lng:lng },
            map:map,
            title:item.name,
            label:{
                text:getIcon(item.type),
                fontSize:"21px"
                }
            });

            const info = new google.maps.InfoWindow({
                content:`<b>${item.name}</b><br>${item.note}`
            });

            marker.addListener("click",()=>{
                info.open(map, marker);
            });

            if(markers[item.type]){
                markers[item.type].push(marker);
            }

        });

    });
}

function setMarkersVisible(type, visible){

    markers[type].forEach(marker=>{
        marker.setMap(visible ? map : null);
    });

}

document.getElementById("cctvCheck").addEventListener("change",function(){
    setMarkersVisible("cctv",this.checked);
});

document.getElementById("lampCheck").addEventListener("change",function(){
    setMarkersVisible("lamp",this.checked);
});

document.getElementById("bellCheck").addEventListener("change",function(){
    setMarkersVisible("bell",this.checked);
});

document.getElementById("storeCheck").addEventListener("change",function(){
    setMarkersVisible("store",this.checked);
});

document.getElementById("menuBtn").addEventListener("click",function(){
    document.querySelector(".sidebar").classList.toggle("open");
});
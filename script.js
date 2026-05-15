// 부산대학교 좌표
const pnu = [35.2332,129.0821];

// 지도 생성
const map = L.map('map').setView(pnu,16);

// 지도 배경 (Google 지도 느낌)

L.tileLayer(
'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
{
    subdomains:'abcd',
    maxZoom:20,
    attribution:'&copy; OpenStreetMap & CARTO'
}
).addTo(map);


// ===== 아이콘 =====

const cameraIcon = L.divIcon({
    html:"📷",
    className:"",
    iconSize:[100,100]
});

const lampIcon = L.divIcon({
    html:"💡",
    className:"",
    iconSize:[100,100]
});

const bellIcon = L.divIcon({
    html:"🚨",
    className:"",
    iconSize:[100,100]
});

const storeIcon = L.divIcon({
    html:"🏪",
    className:"",
    iconSize:[100,100]
});

// ===== 그룹 만들기 =====

const cctvLayer = L.layerGroup().addTo(map);
const lampLayer = L.layerGroup().addTo(map);
const bellLayer = L.layerGroup().addTo(map);
const storeLayer = L.layerGroup().addTo(map);


// ===== CSV 자동 읽기 =====

fetch("data/facilities.csv")
.then(response=>response.text())
.then(csvData=>{

    const result = Papa.parse(csvData,{
        header:true
    });

    result.data.forEach(item=>{

        let icon;
        let layer;

        if(item.type==="cctv"){
            icon=cameraIcon;
            layer=cctvLayer;
        }

        else if(item.type==="lamp"){
            icon=lampIcon;
            layer=lampLayer;
        }

        else if(item.type==="bell"){
            icon=bellIcon;
            layer=bellLayer;
        }

        else if(item.type==="store"){
            icon=storeIcon;
            layer=storeLayer;
        }

        else{
            return;
        }

        L.marker(
            [
                parseFloat(item.lat),
                parseFloat(item.lng)
            ],
            {
                icon:icon
            }
        )
        .bindPopup(
            `<b>${item.name}</b><br>${item.note}`
        )
        .addTo(layer);

    });

});


// ===== 체크박스 기능 =====

document
.getElementById("cctvCheck")
.addEventListener("change",function(){

    if(this.checked){
        map.addLayer(cctvLayer);
    }
    else{
        map.removeLayer(cctvLayer);
    }

});


document
.getElementById("lampCheck")
.addEventListener("change",function(){

    if(this.checked){
        map.addLayer(lampLayer);
    }
    else{
        map.removeLayer(lampLayer);
    }

});


document
.getElementById("bellCheck")
.addEventListener("change",function(){

    if(this.checked){
        map.addLayer(bellLayer);
    }
    else{
        map.removeLayer(bellLayer);
    }

});


document
.getElementById("storeCheck")
.addEventListener("change",function(){

    if(this.checked){
        map.addLayer(storeLayer);
    }
    else{
        map.removeLayer(storeLayer);
    }

});


// ===== 실제 도로 기반 안전 경로 =====

let routeControl = null;

document
.getElementById("routeBtn")
.addEventListener("click", function(){

    // 이미 경로 있으면 제거
    if(routeControl){
        map.removeControl(routeControl);
        routeControl = null;
        return;
    }

    routeControl = L.Routing.control({

        waypoints:[
            L.latLng(35.2320,129.0810),
            L.latLng(35.2350,129.0840)
        ],

        routeWhileDragging:false,

        show:false,

        lineOptions:{
            styles:[
                {
                    color:"blue",
                    weight:6
                }
            ]
        }

    }).addTo(map);

});


// ===== 모바일 메뉴 =====

document
.getElementById("menuBtn")
.addEventListener("click", function(){

    document
    .querySelector(".sidebar")
    .classList.toggle("open");

});
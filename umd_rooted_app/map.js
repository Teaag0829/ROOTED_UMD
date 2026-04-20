var map = L.map('map').setView([38.9897, -76.9378], 14);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap & CARTO',
  maxZoom: 19
}).addTo(map);

// ======================
// STATE
// ======================
var editMode = false;
var markers = [];

// ======================
// TYPE → COLOR SYSTEM
// ======================
var typeColors = {
  "Fitness": "#FF5733",
  "Outdoor": "#076993",
  "Social": "#FFC300",
  "Arts": "#05f6fe",
  "Volunteer": "#5ded0e",
  "Engineering": "#E67E22",
  "Academic": "#056a11",
  "Religious": "#8E44AD"
};

// ======================
// DATA
// ======================
var activities = [
  {coords:[38.9941,-76.9462],name:"Movement Climbing Gym",type:"Fitness",room:"",time:"",url:"https://recwell.umd.edu/programs-activities/adventure-program/climbing-wall-bouldering-grotto"},
  {coords:[38.9863,-76.9233],name:"Lake Artemesia Hiking",type:"Outdoor",room:"",time:"",url:"https://www.pgparks.com/parks_trails/lake-artemesia-park"},
  {coords:[38.988,-76.9443],name:"UMD Art Studio Workshop",type:"Arts",room:"Stamp",time:"Varies",url:"https://stamp.umd.edu/visit/studio"},
  {coords:[38.9932,-76.9442],name:"Community Garden Volunteer",type:"Volunteer",room:"",time:"Sat 10am",url:"https://agnr.umd.edu/outside-classroom/clubs-and-organizations/community-learning-garden/"},
  {coords:[38.9882,-76.9448],name:"Trivia Night",type:"Social",room:"Stamp",time:"Thu 7pm",url:"https://stamp.umd.edu/directory/stamp_saturdays_trivia_miscellaneous"},
  {coords:[38.9879,-76.9448],name:"Pottery Workshop",type:"Arts",room:"Stamp",time:"Varies",url:"https://stamp.umd.edu/visit/studio/pottery"},
  {coords:[38.9935,-76.9455],name:"Martial Arts Class",type:"Fitness",room:"Rec Center",time:"Evenings",url:"https://terplink.umd.edu/organization/martial-arts-club"},
  {coords:[38.988,-76.945],name:"Bird Watching Meetup",type:"Outdoor",room:"Campus Green",time:"Sun mornings",url:"https://terplink.umd.edu/organization/audubon"},
  {coords:[38.9936,-76.9451],name:"Eppley Recreation Center",type:"Fitness",room:"Eppley",time:"",url:"https://recwell.umd.edu/facilities/eppley-recreation-center"},
  {coords:[38.985,-76.9365],name:"Ritchie Coliseum Gym",type:"Fitness",room:"Ritchie",time:"",url:"https://recwell.umd.edu/facilities/ritchie-coliseum"},
  {coords:[38.9905920821883,-76.94000951530485],name:"Terps Racing (Baja)",type:"Engineering",room:"1125",time:"Tue/Thur 6:30 Sun 1:00",url:"https://racing.umd.edu/"},
  {coords:[38.99060459065741,-76.94007387346748],name:"Terps Racing (F1)",type:"Engineering",room:"1125",time:"Mon/Wed 5:00 Sat 11:00",url:"https://racing.umd.edu/"},
  {coords:[38.99315741874179,-76.93337713548132],name:"Terps Racing (EV)",type:"Engineering",room:"",time:"Mon/Wed 6-8",url:"https://racing.umd.edu/"},
  {coords:[38.98672685935274,-76.94461154726477],name:"1000 Schools",type:"Volunteer",room:"0220",time:"Mon 6:00 PM",url:"https://terplink.umd.edu/organization/1000schools"},
  {coords:[38.98671018047972,-76.94444259868102],name:"Academic Quiz Team",type:"Academic",room:"3205",time:"Mon/Thur 7:30 PM",url:"https://terplink.umd.edu/organization/academic-quiz-team"},
  {coords:[38.98525910348311,-76.9472958146776],name:"Adobe Design Club",type:"Arts",room:"2322",time:"Tue 6:30-8:00 PM",url:"https://terplink.umd.edu/organization/adobedesignclub"},
  {coords:[38.988137721400875,-76.94388920526805],name:"African Student Association",type:"Social",room:"NA",time:"NA",url:"https://terplink.umd.edu/organization/umdasa"},
  {coords:[38.98602576994112,-76.93930094019478],name:"Air Force ROTC Booster Club",type:"Outdoor",room:"0121",time:"NA",url:"https://afrotc.umd.edu/howtojoin.html"},
  {coords:[38.985093457854816,-76.94782285209665],name:"B-Terps",type:"Arts",room:"2nd floor atrium",time:"Tue/Thur 9 PM",url:"https://terplink.umd.edu/organization/bterps"},
  {coords:[38.99182321770146,-76.93771997252915],name:"Balloon Payload Program",type:"Engineering",room:"2119",time:"Fri 5:30 PM",url:"https://terplink.umd.edu/organization/bpp"},
  {coords:[38.98415352336437,-76.94112896436381],name:"Baptist Collegiate Ministries",type:"Religious",room:"NA",time:"NA",url:"https://terplink.umd.edu/organization/bcm"},
  {coords:[38.99344395594295,-76.94292684299104],name:"Barbell Club",type:"Fitness",room:"0103",time:"Various",url:"https://terplink.umd.edu/organization/barbell-club"},
  {coords:[38.98208164136064,-76.94375358536709],name:"Campus Disciples",type:"Religious",room:"1120",time:"Tuesday",url:"https://terplink.umd.edu/organization/campus-disciples"},
  {coords:[38.980594450423155,-76.94507391555962],name:"Catholic Terps",type:"Religious",room:"NA",time:"Various",url:"https://catholicterps.org/get-involved/register/"}
];

// ======================
// FILTER UI (AUTO-GENERATED)
// ======================
var filterContainer = document.getElementById("typeFilter");

function buildFilterOptions() {
  var types = new Set();

  activities.forEach(a => types.add(a.type));

  filterContainer.innerHTML = `<option value="All">All</option>`;

  types.forEach(t => {
    filterContainer.innerHTML += `<option value="${t}">${t}</option>`;
  });
}

buildFilterOptions();

// ======================
// ADD MARKERS
// ======================
function addMarker(act) {

  var color = typeColors[act.type] || "#999999";

  var popupHTML = `
    <b>${act.name}</b><br>
    Type: ${act.type}<br>
    Room: ${act.room || "N/A"}<br>
    Time: ${act.time || "N/A"}<br>
    ${act.url ? `<a href="${act.url}" target="_blank">Open Link</a>` : ""}
  `;

  var marker = L.circleMarker(act.coords, {
    radius: 8,
    color: color,
    fillColor: color,
    fillOpacity: 0.8
  }).addTo(map);

  marker.bindPopup(popupHTML);
  marker.activityType = act.type;

  markers.push(marker);
}

activities.forEach(addMarker);

// ======================
// FILTER LOGIC
// ======================
filterContainer.addEventListener("change", function(e) {
  var selected = e.target.value;

  markers.forEach(m => {
    if (selected === "All" || m.activityType === selected) {
      m.addTo(map);
    } else {
      map.removeLayer(m);
    }
  });
});

// ======================
// ADD PIN (EDIT MODE)
// ======================
map.on("click", function (e) {
  if (!editMode) return;

  var name = prompt("Name:");
  if (!name) return;

  var type = prompt("Type:");
  var room = prompt("Room:");
  var time = prompt("Time:");
  var url = prompt("URL:");

  var newAct = {
    coords: [e.latlng.lat, e.latlng.lng],
    name, type, room, time, url
  };

  activities.push(newAct);
  addMarker(newAct);

  buildFilterOptions();
});

// ======================
// EDIT MODE TOGGLE
// ======================
document.getElementById("toggleEdit").addEventListener("click", function () {
  editMode = !editMode;
  alert(editMode ? "Edit Mode ON" : "Edit Mode OFF");
});

// ======================
// EXPORT
// ======================
document.getElementById("exportBtn").addEventListener("click", function () {
  var js = "var activities = " + JSON.stringify(activities, null, 2) + ";";

  var blob = new Blob([js], { type: "text/javascript" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "activities-export.js";
  a.click();
});
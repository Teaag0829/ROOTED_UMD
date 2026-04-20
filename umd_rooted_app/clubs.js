document.addEventListener("DOMContentLoaded", function () {

  // ======================
  // DATA
  // ======================
  var clubs = [];

  var container = document.getElementById("clubContainer");

  // ======================
  // RENDER FUNCTION
  // ======================
  function renderClubs() {
    container.innerHTML = "";

    clubs.forEach(function(club) {

      var div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${club.name}</h3>
        <p><b>Type:</b> ${club.type}</p>
        <p><b>Location:</b> ${club.location}</p>
        <p><b>Time:</b> ${club.time}</p>
        ${club.url ? `<a href="${club.url}" target="_blank">Open Link</a>` : ""}
      `;

      container.appendChild(div);
    });
  }

  // ======================
  // ADD CLUB
  // ======================
  document.getElementById("addClubBtn").addEventListener("click", function () {

    var name = document.getElementById("nameInput").value.trim();
    var type = document.getElementById("typeInput").value.trim();
    var location = document.getElementById("locationInput").value.trim();
    var time = document.getElementById("timeInput").value.trim();
    var url = document.getElementById("urlInput").value.trim();

    if (!name) {
      alert("Please enter a club name");
      return;
    }

    var newClub = {
      name: name,
      type: type || "Not specified",
      location: location || "Varies",
      time: time || "Not specified",
      url: url || ""
    };

    clubs.push(newClub);

    // IMPORTANT: re-render immediately
    renderClubs();

    // clear inputs
    document.getElementById("nameInput").value = "";
    document.getElementById("typeInput").value = "";
    document.getElementById("locationInput").value = "";
    document.getElementById("timeInput").value = "";
    document.getElementById("urlInput").value = "";
  });

  // ======================
  // EXPORT
  // ======================
  document.getElementById("exportBtn").addEventListener("click", function () {

    var js = "var clubs = " + JSON.stringify(clubs, null, 2) + ";";

    var blob = new Blob([js], { type: "text/javascript" });
    var url = URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.href = url;
    a.download = "clubs-export.js";
    a.click();

    URL.revokeObjectURL(url);
  });

});
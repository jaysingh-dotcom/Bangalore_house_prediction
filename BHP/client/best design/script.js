function getBathValue() {
  return parseInt(document.getElementById("bath").value);
}

function getBHKValue() {
  return parseInt(document.getElementById("bhk").value);
}

function onClickedEstimatePrice() {
  let sqft = document.getElementById("sqft").value;
  let bhk = getBHKValue();
  let bath = getBathValue();
  let location = document.getElementById("location").value;
  let estPrice = document.getElementById("estimatedPrice");
  let loading = document.getElementById("loading");

  if (sqft === "" || location === "") {
    alert("Please enter all details");
    return;
  }

  loading.style.display = "block";

  let url = "http://127.0.0.1:5000/predict_home_price";

  $.post(
    url,
    {
      total_sqft: parseFloat(sqft),
      bhk: bhk,
      bath: bath,
      location: location,
    },
    function (data, status) {
      loading.style.display = "none";
      estPrice.innerHTML = "Estimated Price: " + data.estimated_price + " Lakh";
    }
  );
}

function onPageLoad() {
  console.log("document loaded");
  let url = "http://127.0.0.1:5000/get_location_names";

  $.get(url, function (data, status) {
    if (data) {
      let locations = data.locations;
      let uiLocations = document.getElementById("location");
      uiLocations.innerHTML = "";

      locations.forEach(function (loc) {
        let opt = document.createElement("option");
        opt.value = loc;
        opt.innerHTML = loc;
        uiLocations.appendChild(opt);
      });
    }
  });
}

window.onload = onPageLoad;

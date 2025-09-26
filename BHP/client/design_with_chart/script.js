function getSelectedValue(groupName) {
  var elements = document.getElementsByName(groupName);
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].checked) {
      return parseInt(elements[i].value);
    }
  }
  return -1;
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  var sqft = document.getElementById("uiSqft").value;
  var bhk = getSelectedValue("uiBHK");
  var bathrooms = getSelectedValue("uiBathrooms");
  var location = document.getElementById("uiLocations").value;
  var estPrice = document.getElementById("uiEstimatedPrice");
  var loadingSpinner = document.getElementById("loadingSpinner");

  if (sqft === "" || location === "Select a Location") {
    alert("Please enter valid inputs!");
    return;
  }

  loadingSpinner.style.display = "block";

  var url = "http://127.0.0.1:5000/predict_home_price";

  $.post(
    url,
    {
      total_sqft: parseFloat(sqft),
      bhk: bhk,
      bath: bathrooms,
      location: location,
    },
    function (data, status) {
      loadingSpinner.style.display = "none";
      console.log(data.estimated_price);
      estPrice.innerHTML =
        "<h2>Estimated Price: " + data.estimated_price + " Lakh</h2>";

      updatePriceChart(data.price_trend);
    }
  );
}

function onPageLoad() {
  console.log("Fetching locations...");
  var url = "http://127.0.0.1:5000/get_location_names";

  $.get(url, function (data, status) {
    if (data) {
      var locations = data.locations;
      var uiLocations = document.getElementById("uiLocations");
      $("#uiLocations").empty();
      $("#uiLocations").append(
        "<option disabled selected>Select a Location</option>"
      );

      locations.forEach(function (loc) {
        $("#uiLocations").append(new Option(loc, loc));
      });
    }
  });
}

window.onload = onPageLoad;

// Chart.js - Price Trend Chart
var ctx = document.getElementById("priceTrendChart").getContext("2d");
var priceChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Price Trend",
        data: [],
        borderColor: "green",
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
});

function updatePriceChart(priceData) {
  priceChart.data.labels = priceData.years;
  priceChart.data.datasets[0].data = priceData.prices;
  priceChart.update();
}

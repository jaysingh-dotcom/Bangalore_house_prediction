function getSelectedValue(groupName) {
    var elements = document.getElementsByName(groupName);
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].checked) {
        return elements[i].value;
      }
    }
    return null;
  }
  
  function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");
  
    var sqft = document.getElementById("uiSqft").value;
    var bhk = getSelectedValue("uiBHK");
    var bathrooms = getSelectedValue("uiBathrooms");
    var location = document.getElementById("uiLocations").value;
    var estPrice = document.getElementById("uiEstimatedPrice");
  
    if (!sqft || !bhk || !bathrooms || location === "Select a Location") {
      alert("Please fill in all fields correctly!");
      return;
    }
  
    var url = "http://127.0.0.1:5000/predict_home_price";
  
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `total_sqft=${sqft}&bhk=${bhk}&bath=${bathrooms}&location=${encodeURIComponent(
        location
      )}`,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server Response:", data);
        if (data.estimated_price) {
          estPrice.innerHTML = `<h2>Estimated Price: ${data.estimated_price} Lakh</h2>`;
          estPrice.classList.add("fade-in");
        } else {
          estPrice.innerHTML = `<h2>Error fetching price</h2>`;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        estPrice.innerHTML = `<h2>Server error. Try again later.</h2>`;
      });
  }
  
  function onPageLoad() {
    console.log("Fetching locations...");
    var url = "http://127.0.0.1:5000/get_location_names";
  
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Received locations:", data);
        if (data.locations) {
          var uiLocations = document.getElementById("uiLocations");
          uiLocations.innerHTML = `<option disabled selected>Select a Location</option>`;
          data.locations.forEach((loc) => {
            uiLocations.innerHTML += `<option value="${loc}">${loc}</option>`;
          });
        }
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }
  
  window.onload = function () {
    onPageLoad();
    document.querySelector(".btn-animate").classList.add("fade-in");
  };
  
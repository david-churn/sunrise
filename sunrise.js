'use strict'
// Fetch some data from a public API using Fetch
// 1/31/2109 David Churn created
// 2/2/2019 David Churn switched this over to sunrise name.

// let latitude = '39.0997265'
// let longitude = '-94.5785667'

let when = 'today'
let now = new Date();

let latitude = document.getElementById('latitude');
let longitude = document.getElementById('longitude');
let getSun = document.getElementById('get-sun');
let whenDt = document.getElementById('when-dt');
whenDt.innerHTML = now.toLocaleDateString();

let sunriseTm = document.getElementById('sunrise-tm');
let sunsetTm = document.getElementById('sunset-tm');
let textArea = document.getElementById("text-area");

// nested .then statements
// fetch(url).then(function(response) {
//   response.text().then(function(text) {
//     textArea.innerHTML = text;
//   });
// });
getSun.addEventListener('click', function() {
// How do I refresh the date object?
  latitude = document.getElementById('latitude').value;
  longitude = document.getElementById('longitude').value;

// The api considers zero an error.  Nudge the value if zero entered.
  if (latitude==0) {
    latitude+=0.000001;
  };
  if (longitude==0) {
    longitude+=0.000001;
  }
  let url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${when}`;
  console.log(`sunrise-sunset url=${url}`);
//  chained .then statements
  fetch(url)
    .then((response) => response.json())
    .then(function(respObj) {
      if (respObj.status == 'OK') {
        sunriseTm.innerHTML = respObj.results.sunrise;
        sunsetTm.innerHTML = respObj.results.sunset;
        textArea.innerHTML = '';
      }
      else {
        sunriseTm.innerHTML = '';
        sunsetTm.innerHTML = '';
        textArea.innerHTML = JSON.stringify(respObj);
      }
    })
    .then( getTz()
    )
    .catch((response) => {
      textArea.innerHTML = response;
    });
});

function getTz() {
  let timeZone = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${Math.floor(Date.now()/1000)}&key=get your own key`;
  console.log(`goole url=${timeZone}`);

  fetch(timeZone)
    .then((response) => response.json())
    .then(function(respObj) {
      if (respObj.status == 'OK') {
//  adjust the returned times from sunrise-sunsetTm
      }
      else {
        textArea.innerHTML = JSON.stringify(respObj);
      }
      console.log(`Google response=${JSON.stringify(respObj)}`);
    });
}

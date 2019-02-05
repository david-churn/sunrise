'use strict'
// Fetch some data from a public API using Fetch
// 1/31/2109 David Churn created
// 2/2/2019 David Churn switched this over to sunrise name.
// 2/4/2019 David Churn reworked this and ran through Debugger
// 2/5/2019 Ian Kietzman debugged and showed how to make async function wait.

// let latitude = '39.0997265'
// let longitude = '-94.5785667'

const when = 'today';

let latitudeObj = document.getElementById('latitude');
let longitudeObj = document.getElementById('longitude');
let getSun = document.getElementById('get-sun');

let whenObj = document.getElementById('when-dt');
let sunriseObj = document.getElementById('sunrise-tm');
let sunsetObj = document.getElementById('sunset-tm');
let messageObj = document.getElementById("text-area");

getSun.addEventListener('click', function() {
// How do I refresh the date object?
  let latitudeStr = latitudeObj.value;
  let longitudeStr = longitudeObj.value;

// The api considers zero an error.  Nudge the value if zero entered.
  if (latitudeStr=="0") {
    latitudeStr="0.000001";
  };
  if (longitudeStr=="0") {
    longitudeStr="0.000001";
  }
  const srurl = `https://api.sunrise-sunset.org/json?lat=${latitudeStr}&lng=${longitudeStr}&date=${when}`;
  let apiStr = 'sunrise-sunset';
  console.log(`${apiStr} url=${srurl}`);
//  chained .then statements
  fetch(srurl)
    .then((response) => response.json())
    .then(function(respObj) {
      let adjustSec = 0;
      console.log(`respObj=${JSON.stringify(respObj)}`);
      if (respObj.status == 'OK') {
        return getTz(`${latitudeStr},${longitudeStr}`)
        .then((tz) => {
          return {
            sunrise: respObj.results.sunrise,
            sunset: respObj.results.sunset,
            adjustSec: tz,
          };
        })
      }
    })
    .then(function(dataObj) {
      console.log(dataObj);
      whenObj.innerHTML = `Date: ${(new Date()).toLocaleDateString()}`;
      sunriseObj.innerHTML = `Sunrise: ${adjustTm(dataObj.sunrise, dataObj.adjustSec)}`;
      sunsetObj.innerHTML = `Sunset: ${adjustTm(dataObj.sunset, dataObj.adjustSec)}`;
      messageObj.innerHTML = '';
    })
    .catch((err) => {
      whenObj.innerHTML = '';
      sunriseObj.innerHTML = '';
      sunsetObj.innerHTML = '';
      messageObj.innerHTML = `${apiStr} says ${err}`;
    });
  });

function getTz(whereStr) {
  const Gkey = "notAgain";
  const tzurl = `https://maps.googleapis.com/maps/api/timezone/json?location=${whereStr}&timestamp=${Math.floor(Date.now()/1000)}&key=${Gkey}`;
  let apiStr = 'Google';
  console.log(`${apiStr} url=${tzurl}`);
  let tzAdjSec = 0;
  return fetch(tzurl)
    .then((response) => response.json())
    .then(function(respObj) {
      console.log(`Google response=${JSON.stringify(respObj)}`);
      if (respObj.status == 'OK') {
        tzAdjSec = respObj.dstOffset + respObj.rawOffset;
      }
      else {
      //   throw an error.
        messageObj.innerHTML = JSON.stringify(respObj);
      }
      return tzAdjSec;
    });
}

function adjustTm(timeStr,adjSecNbr) {
  let todayDt = new Date();
  let timeArr = timeStr.split(/[: ]/g);
  // adjust hours when after noon
  let adjHr = Number(timeArr[0]);
  if (timeArr[3]=='PM') {
    adjHr += 12;
  }
  else {
    if (adjHr==12) {
      adjHr=0;
    }
  }
  todayDt.setHours(adjHr);
  todayDt.setMinutes(Number(timeArr[1]));
  todayDt.setSeconds(Number(timeArr[2]));
  let adjustDt = new Date(Date.parse(todayDt) + (adjSecNbr * 1000));
  return adjustDt.toLocaleTimeString();
}

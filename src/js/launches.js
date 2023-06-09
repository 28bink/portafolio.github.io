import { getApiResponse, apiBaseUrl } from './data.js';

/* eslint-disable no-console */
function getCountDownTimer(launchDate) {
  // Set the date we're counting down to
  const countDownDate = new Date(launchDate).getTime();
  // Update the count down every 1 second
  const x = setInterval(() => {
    // Get today's date and time
    const now = new Date().getTime();

    // Find the distance between now and the count down date
    const distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="countdown-upcoming"
    document.getElementById('countdown-upcoming').innerHTML = `${days}days ${hours}hours ${minutes}minutes ${seconds}seconds `;

    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(x);
      document.getElementById('countdown-upcoming').innerHTML = 'EXPIRED';
    }
  }, 1000);
}

function printLaunch(result, selector) {
  const title = document.querySelector(`#title${selector}`);
  title.textContent = `${result.results[0].name}`;

  const img = document.querySelector(`#img${selector}`);
  let imgUrl = result.results[0]?.mission_patches?.image_url || 'img/astronauta.png';
  img.setAttribute('width', '60%');
  img.setAttribute('height', '60%');
  img.setAttribute('alt', 'mission logo');
  img.setAttribute('src', imgUrl);

  const date = document.querySelector(`#date${selector}`);
  date.textContent = `${result.results[0].net}`;

  const moreInfo = document.querySelector(`#more${selector}`);
  moreInfo.setAttribute('href', `launch.html?id=${result.results[0].id}`);

  if (selector === '-upcoming') {
    getCountDownTimer(result.results[0].net);
  }
}

function createElement(launch, count) {
  const div = document.createElement('div');
  div.setAttribute('id', `card-${count}`);
  div.setAttribute('class', 'launch-title-card');

  const link = document.createElement('a');
  link.setAttribute('id', `link-${count}`);
  link.setAttribute('class', 'badge badge-secondary');
  link.setAttribute('href', `launch.html?id=${launch.id}`);
  div.appendChild(link);

  const launchNumber = parseInt(count, 10) + 1;

  const paragraph = document.createElement('p');
  paragraph.setAttribute('id', `item-${count}`);
  paragraph.textContent = `${launchNumber}. ${launch.name}`;
  link.appendChild(paragraph);

  return div;
}

function printPastLaunchesList(result) {
  const launchesDiv = document.querySelector('#past-launches');
  Object.keys(result).forEach((k) => launchesDiv.appendChild(createElement(result[k], k)));
}

const upcomingApi = `${apiBaseUrl}upcoming/?format=json&search=SpaceX&limit=1`;

const upcomingSelector = '-upcoming';

const latestApi = `${apiBaseUrl}previous/?format=json&search=SpaceX&limit=1`;
const latestSelector = '-latest';

const pastLaunchesApi = `${apiBaseUrl}previous/?format=json&search=SpaceX&limit=100`;

getApiResponse(upcomingApi)
  .then((result) => printLaunch(result, upcomingSelector))
  .catch((error) => console.log('error', error));

getApiResponse(latestApi)
  .then((result) => printLaunch(result, latestSelector))
  .catch((error) => console.log('error', error));

getApiResponse(pastLaunchesApi)
  .then((result) => printPastLaunchesList(result.results))
  .catch((error) => console.log('error', error));

'use strict';

const apiKey = 'bRgpRxNgvwmBTdhS6AhbVpRRAUCJw6XpgTiACiJp'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  if (responseJson.total == 0) {
    $('#boom').addClass('hidden');
    $('#results-list').append(`<br>Sorry, the information you requested can not be found. Please try again!`);
  } else {
    $('#boom').removeClass('hidden');
    for (let i = 0; i < responseJson.data.length; i++){
      $('#results-list').append(
        `<li><h3>${responseJson.data[i].name}</h3>
        <p>${responseJson.data[i].description}</p>
        <p>${responseJson.data[i].addresses[0].line1}<br id="height">
        ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}</p>
        <a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].name} Link</a>
        </li>
        <br>
        <hr>
        `
    )};
  }
  $('#results').removeClass('hidden');
};

function getParks(query, maxResults) {
  const params = {
    api_key: apiKey,
    stateCode: query,
    limit: maxResults,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParks(searchTerm, maxResults);
  });
}

$(function() {
  console.log('Locked & Loaded 🔫');
  watchForm();
});
'use strict';
//need to eventually hide these in a private file (technically)
const key = 'DxMJ184GRqtRPnaqWdp3BbMtG00mbQtE8feSDnTiM6fAHO997P';
const secret = 'KOE3gOf7D7j36alVVrzPfGLZLzIQjnmXXUcQN4Rx';

function homeRender() {
  $('.home').click(function() {
    $('.bottom').show();
    $('.results').hide();
  })
}

function fetchAnimals(fetchUrl) {
//getting authorization bearer for each separate fetch call
fetch('https://api.petfinder.com/v2/oauth2/token', {
	method: 'POST',
	body: 'grant_type=client_credentials&client_id=' + key + '&client_secret=' + secret,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	}
}).then(response => {
  return response.json()
}).then(data => {
  return data
}).then(data => {
//fetching url with selected values from the form  
  return fetch(fetchUrl, {
    headers: {
      'Authorization': `${data.token_type} ${data.access_token}`,
      'Content-Type': 'application/x-www/form-urlencoded'
    }
  })
}).then(response => {
  return response.json()
 // running the rendering function 
}).then(data => displayResults(data.animals))
.catch(err => {
  console.log('something went wrong', err)
})
}

function displayResults(data) { 
  $('.results').empty();
//if the response is empty, render no results found
data.length === 0 ? $('.results').append(`<p>No results found</p>`) : 
//otherwise map through and render lists for each animal
data.map((i) => {
  i.photos[0] === undefined ? 
 //list to render if no photos are provided (it was throwing errors with the api) 
        $('.results').append(`
    <ul class="resultCard" >
    <li><strong>Name:</strong> ${i.name}</li>
    <img src='images/noPhoto.jpg' alt='animal'>
    <li><strong>Breed:</strong> ${i.breeds.primary}</li>
    <li><strong>Gender:</strong> ${i.gender}</li>
    <li><strong>Age:</strong> ${i.age}</li>
    <li><a href=${i.url} target="_blank"><strong>More about ${i.name} <strong></a></li>
    <li><a href='mailto:${i.contact.email}'><em>Email Shelter</em></a></li>
    </ul>
    `)
    : 
  //otherwise render with animal photo
    $('.results').append(`
    <ul class="resultCard" >
    <li><strong>Name:</strong> ${i.name}</li>
    <img src='${i.photos[0].medium}' alt='animal'>
    <li><strong>Breed:</strong> ${i.breeds.primary}</li>
    <li><strong>Gender:</strong> ${i.gender}</li>
    <li><strong>Age:</strong> ${i.age}</li>
    <li><a href=${i.url} target="_blank"><strong>More about ${i.name} </strong></a></li>
    <li><a href='mailto:${i.contact.email}'><em>Email Shelter</em></a></li>
    </ul>
    `);
  });
  $('.results').show();
  $('.bottom').hide(); 
  homeRender();
}
//builds the fetch url based off of type of animal and state of location
function buildUrl(type, location) {
  let rootUrl = 'https://api.petfinder.com/v2/animals?type=' + type + '&status=adoptable' + '&location=' + location;
  return rootUrl;
}
//getting user values from the form after submission and running the fetch call to api
function getValues() {
  $('.petSearch').submit(event => {
    event.preventDefault();
    let type = $('#types').val();
    let location = $('#locations').val();
    let fetchUrl = buildUrl(type, location);
    fetchAnimals(fetchUrl);
  })
}
//run everything
$(function() {
  getValues();
});


const navSlide = () => {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li');

  burger.addEventListener('click',()=>{
      //Toggle Nav
      nav.classList.toggle('nav-active');

     //Animate LInks
    navLinks.forEach((link, index) => {
         if (link.style.animation) {
             link. style.animation = ''
         } else {
     link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
    }
  });
//Burger animation
burger.classList.toggle('toggle');

 });
}

navSlide();
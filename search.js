'use strict';
//need to eventually hide these in a private file (technically)
const key = 'DxMJ184GRqtRPnaqWdp3BbMtG00mbQtE8feSDnTiM6fAHO997P';
const secret = 'KOE3gOf7D7j36alVVrzPfGLZLzIQjnmXXUcQN4Rx';

//renders home and hides results
function homeRender() {
  $('.home').click(function() {
    $('.bottom').show();
    $('.landing').show();
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

function displayForm() {
  $('.results').append(`
  <form class="searchForm">
  <label for="types">Type of Animal</label>
  <div class= "searchCategories">
  <div class="select">
  <select id="types">
    <option value="Dog">Dog</option>
    <option value="Cat">Cat</option>
    <option value="Rabbit">Rabbit</option>
    <option value="Horse">Horse</option>
    <option value="Bird">Bird</option>
    <option value="Barnyard">Barnyard Animals</option>
  </select>
</div>
</div>
  <label for="locations">Location</label>
  <div class= "searchCategories">
  <div class="select">
  <select id="locations">
    <option value="Alabama">Alabama</option>
    <option value="Alaska">Alaska</option>
    <option value="Arizona">Arizona</option>
    <option value="Arkansas">Arkansas</option>
    <option value="California">California</option>
    <option value="Colorado">Colorado</option>
    <option value="Connecticut">Connecticut</option>
    <option value="Delaware">Delaware</option>
    <option value="Florida">Florida</option>
    <option value="Georgia">Georgia</option>
    <option value="Hawaii">Hawaii</option>
    <option value="Idaho">Idaho</option>
    <option value="Illinois">Illinois</option>
    <option value="Indiana">Indiana</option>
    <option value="Iowa">Iowa</option>
    <option value="Kansas">Kansas</option>
    <option value="Kentucky">Kentucky</option>
    <option value="Louisiana">Louisiana</option>
    <option value="Maine">Maine</option>
    <option value="Maryland">Maryland</option>
    <option value="Massachusetts">Massachusetts</option>
    <option value="Michigan">Michigan</option>
    <option value="Minnesota">Minnesota</option>
    <option value="Mississippi">Mississippi</option>
    <option value="Missouri">Missouri</option>
    <option value="Montana">Montana</option>
    <option value="Nebraska">Nebraska</option>
    <option value="Nevada">Nevada</option>
    <option value="New Hampshire">New Hampshire</option>
    <option value="New Jersey">New Jersey</option>
    <option value="New Mexicoy">New Mexico</option>
    <option value="New York">New York</option>
    <option value="North Carolina">North Carolina</option>
    <option value="North Dakota">North Dakota</option>
    <option value="Ohio">Ohio</option>
    <option value="Oklahoma">Oklahoma</option>
    <option value="Oregon">Oregon</option>
    <option value="Pennsylvania">Pennsylvania</option>
    <option value="Rhode Island">Rhode Island</option>
    <option value="South Carolina">South Carolina</option>
    <option value="South Dakota">South Dakota</option>
    <option value="Tennessee">Tennessee</option>
    <option value="Texas">Texas</option>
    <option value="Utah">Utah</option>
    <option value="Vermont">Vermont</option>
    <option value="Virginia">Virginia</option>
    <option value="Washington">Washington</option>
    <option value="West Virginia">West Virginia</option>
    <option value="Wisconsin">Wisconsin</option>
    <option value="Wyoming">Wyoming</option>
  </select>
  </div>
  </div>
  <button class="submitButton" type="submit" value="Search">Search</button>
  </form`);
}

function displayResults(data) { 
  $('.results').empty();
  displayForm();
//if the response is empty, render no results found
data.length === 0 ? $('.results').append(`<p>No results found</p>`) : 
//otherwise map through and render lists for each animal
data.map((i) => {
  i.photos[0] === undefined ? 
 //list to render if no photos are provided (it was throwing errors with the api) 
        $('.results').append(`
    <ul class="resultCard" >
    <li class="petName"><h2>${i.name}</h2></li>
    <img src='images/noPhoto.jpg' alt='animal' class="imgNotAvail">
    <li class="breedType> ${i.breeds.primary}</li>
    <li class="gender">${i.gender}</li>
    <li class="age">${i.age}</li>
    <li class="linkForMore"><a href=${i.url} target="_blank"><strong>More about ${i.name} <strong></a></li>
    <li class="emailLink"><a href='mailto:${i.contact.email}'><em>Email Shelter</em></a></li>
    </ul>
    `)
    : 
  //otherwise render with animal photo
    $('.results').append(`
    <ul class="resultCard" >
    <li class="petName"><h2>${i.name}</h2></li>
    <img src='${i.photos[0].medium}' alt='animal' class="animalImg">
    <li class="breedType">${i.breeds.primary}</li>
    <li class="gender">${i.gender}</li>
    <li class="age">${i.age}</li>
    <li class="linkForMore"><a href=${i.url} target="_blank"><strong>More about ${i.name} </strong></a></li>
    <li class="emailLink"><a href='mailto:${i.contact.email}'><em>Email Shelter</em></a></li>
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
    $('.landing').hide();
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
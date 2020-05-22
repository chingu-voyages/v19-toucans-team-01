'use strict';
//need to eventually hide these in a private file (technically)
const key = 'DxMJ184GRqtRPnaqWdp3BbMtG00mbQtE8feSDnTiM6fAHO997P';
const secret = 'KOE3gOf7D7j36alVVrzPfGLZLzIQjnmXXUcQN4Rx';

//renders home from nav bar and hides results and search page form
function homeRender() {
  $('.home').click(function() {
    $('.bottom').show();
    $('.landing').show();
    $('.results').hide();
    $('.searchForm').hide();
  })
}

//renders search page from nav bar
function searchRender() {
  $('.searchPage').click(function() {
    $('.landing').hide();
    $('.bottom').hide();
    $('.searchForm').css('display', 'flex');
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
  $('.searchForm').show();
  $('.searchForm').css('display', 'flex');
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
    <li class="linkForMore"><a href=${i.url} target="_blank">More about ${i.name} </a></li>
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
    <li class="linkForMore"><a href=${i.url} target="_blank">More about ${i.name} </a></li>
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

//gets values from search page form.. size, gender, age
 function getSearchPageValues() {
  $('.searchForm').submit(event => {
    event.preventDefault();
    let type = $('#searchTypes').val();
    let location = $('#searchLocations').val();
    let size = $('#searchSize').val();
    let gender = $('#searchGender').val();
    let age = $('#searchAge').val();
    let fetchUrl = buildUrl(type, location);
    size == 'null' ? fetchUrl += '': fetchUrl += '&size=' + size;
    gender == 'null' ? fetchUrl +='': fetchUrl += '&gender=' + gender ;
    age == 'null' ? fetchUrl+='': fetchUrl += '&age=' + age;
    type =='null' || location =='null'?
      alert("Please select a type of animal and location.") :
    fetchAnimals(fetchUrl);
  }) 
 }

//renders different icons in nav bar 
function toggleNav() {
  $(".iconToggle").click(function(){
    $(this).find("i").toggleClass("fa-bars fa-times");
});
}

//run all search functionality
$(function() {
  toggleNav()
  homeRender()
  searchRender()
  getValues()
  getSearchPageValues()
});


// const navSlide = () => {
//   const burger = document.querySelector('.burger');
//   const nav = document.querySelector('.nav-links');
//   const navLinks = document.querySelectorAll('.nav-links li');

//   burger.addEventListener('click',()=>{
//       //Toggle Nav
//       nav.classList.toggle('nav-active');

//      //Animate LInks
//     navLinks.forEach((link, index) => {
//          if (link.style.animation) {
//              link. style.animation = ''
//          } else {
//      link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
//     }
//   });
// //Burger animation
// burger.classList.toggle('toggle');

//  });
// }

// navSlide();


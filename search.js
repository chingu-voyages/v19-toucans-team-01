'use strict';
//need to eventually hide these in a private file (technically)
const key = 'DxMJ184GRqtRPnaqWdp3BbMtG00mbQtE8feSDnTiM6fAHO997P';
const secret = 'KOE3gOf7D7j36alVVrzPfGLZLzIQjnmXXUcQN4Rx';

//renders home from nav bar and hides results and search page form
function homeRender() {
  $('.home').click(function() {
    $('.bottom').show();
    $('.landing').show();
    $('#results').hide();
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

function searchSubmitButton() {
    $('div.searchPageContainer').css('height', '0');
}

function fetchAnimals(fetchUrl) {
  $('.spinner').addClass('show');
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
      'Content-Type': 'application/x-www/form-urlencoded',
    }
  })
}).then(response => {
  return response.json()
 // running the rendering function 
}).then(data => 
  displayResults(data.animals),
  searchSubmitButton())
.catch(err => {
  console.log('something went wrong', err)
})
}

function displayResults(data) { 
  $('.spinner').removeClass('show');
  $('#results').empty();
  $('.searchForm').show();
  $('.searchForm').css('display', 'flex');
//if the response is empty, render no results found
data.length === 0 ? $('#results').append(`<p class="noResults">No Results Found</p>`) : 
//otherwise map through and render lists for each animal
data.map((i) => {
  i.photos[0] === undefined ? 
 //list to render if no photos are provided (it was throwing errors with the api) 
        $('#results').append(`
    <ul class="resultCard" >
    <li class="petName"><a href=${i.url} target="_blank"><h2>${i.name}</h2></a></li>
    <a href=${i.url} target="_blank"><img src='images/noPhoto.jpg' alt='animal' class="imgNotAvail"></a>
    <li class="breedType> ${i.breeds.primary}</li>
    <li class="gender">${i.gender}</li>
    <li class="age">${i.age}</li>
    <li class="emailLink"><a href='mailto:${i.contact.email}'><em>Email Shelter</em></a></li>
    </ul>
    `)
    : 
  //otherwise render with animal photo
    $('#results').append(`
    <ul class="resultCard" >
    <li class="petName"><a href=${i.url} target="_blank"><h2>${i.name}</h2></a></li>
    <a href=${i.url} target="_blank"><img src='${i.photos[0].medium}' alt='animal' class="animalImg"></a>
    <li class="breedType">${i.breeds.primary}</li>
    <li class="gender">${i.gender}</li>
    <li class="age">${i.age}</li>
    <li class="emailLink"><a href='mailto:${i.contact.email}'><em>Email Shelter</em></a></li>
    </ul>
    `);
  });
  $('#results').show();
  $('#results').append(`
  <a href="#topNav" id="btnToTop">Back To Top</a>`)
  $('.bottom').hide();
  homeRender();
}

//builds the fetch url based off of type of animal and state of location
function buildUrl(type, location) {
  let rootUrl = 'https://api.petfinder.com/v2/animals?type=' + type + '&status=adoptable' + '&limit=100' + '&page=1' + '&location=' + location;
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

//scrolls to results after search page submit
function scrollToResults() {
  $('html, body').animate({
    scrollTop: $("#results").offset().top
}, 2000);
}

//resets form after search
function resetForm() {
  $('.searchForm').each(function(){
    this.reset();
});
}

//gets values from search page form
 function getSearchPageValues() {
  $('.searchForm').submit(event => {
    event.preventDefault();
    let type = $('#searchTypes').val();
    let dogBreed = $('#searchDogBreeds').val();
    let catBreed = $('#searchCatBreeds').val();
    let rabbitBreed = $('#searchRabbitBreeds').val();
    let horseBreed = $('#searchHorseBreeds').val();
    let birdBreed = $('#searchBirdBreeds').val();
    let location = $('#searchLocations').val();
    let size = $('#searchSize').val();
    let gender = $('#searchGender').val();
    let age = $('#searchAge').val();
    let fetchUrl = 'https://api.petfinder.com/v2/animals?limit=100&'
    type == 'null' ? fetchUrl+='': fetchUrl += '&type=' + type;
    location == 'null' ? fetchUrl+='': fetchUrl += '&location=' + location;
    dogBreed == 'null' ? fetchUrl += '': fetchUrl += '&breed=' + dogBreed;
    catBreed == 'null' ? fetchUrl += '': fetchUrl += '&breed=' + catBreed;
    rabbitBreed == 'null' ? fetchUrl += '': fetchUrl += '&breed=' + rabbitBreed;
    horseBreed == 'null' ? fetchUrl += '': fetchUrl += '&breed=' + horseBreed;
    birdBreed == 'null' ? fetchUrl += '': fetchUrl += '&breed=' + birdBreed;
    size == 'null' ? fetchUrl += '': fetchUrl += '&size=' + size;
    gender == 'null' ? fetchUrl +='': fetchUrl += '&gender=' + gender ;
    age == 'null' ? fetchUrl+='': fetchUrl += '&age=' + age;
    fetchAnimals(fetchUrl);
    scrollToResults();
    resetForm();
  }) 
  $('.searchPageForm').submit(event => {
    event.preventDefault();
    let type = $('#searchTypes').val();
    let dogBreed = $('#searchDogBreeds').val();
    let catBreed = $('#searchCatBreeds').val();
    let rabbitBreed = $('#searchRabbitBreeds').val();
    let horseBreed = $('#searchHorseBreeds').val();
    let birdBreed = $('#searchBirdBreeds').val();
    let location = $('#searchLocations').val();
    let size = $('#searchSize').val();
    let gender = $('#searchGender').val();
    let age = $('#searchAge').val();
    let fetchUrl = 'https://api.petfinder.com/v2/animals?limit=100&'
    type == 'null' ? fetchUrl+='': fetchUrl += '&type=' + type;
    location == 'null' ? fetchUrl+='': fetchUrl += '&location=' + location;
    dogBreed == 'null' ? fetchUrl += '': fetchUrl += '&breed=' + dogBreed;
    catBreed == 'null' ? fetchUrl += '': fetchUrl += '&breed=' + catBreed;
    rabbitBreed == 'null' ? fetchUrl += '': fetchUrl += '&breed=' + rabbitBreed;
    horseBreed == 'null' ? fetchUrl += '': fetchUrl += '&breed=' + horseBreed;
    birdBreed == 'null' ? fetchUrl += '': fetchUrl += '&breed=' + birdBreed;
    size == 'null' ? fetchUrl += '': fetchUrl += '&size=' + size;
    gender == 'null' ? fetchUrl +='': fetchUrl += '&gender=' + gender ;
    age == 'null' ? fetchUrl+='': fetchUrl += '&age=' + age;
    fetchAnimals(fetchUrl);
    scrollToResults();
    resetForm();
  }) 
 }


//renders different icons in nav bar 
function toggleNav() {
  $(".iconToggle").click(function(){
    $(this).find("i").toggleClass("fa-bars fa-times");
});
}

//creates dropdowns for all types of breeds for each animal
function breeds() { 
  let dogBreedList = STORE.dogBreeds.map((i) => {
      return i.name;
  })
  let catBreedList = STORE.catBreeds.map((i) => {
    return i.name;
  })
  let birdBreedList = STORE.birdBreeds.map((i) => {
    return i.name;
  })
  let rabbitBreedList = STORE.rabbitBreeds.map((i) => {
    return i.name;
  })
  let horseBreedList = STORE.horseBreeds.map((i) => {
    return i.name;
  })
dogBreedList.map((i) => {
      $('#searchDogBreeds').append(`
      <option value="${i}">${i}</option>
      `)
  })
catBreedList.map((i) => {
   $('#searchCatBreeds').append(`
   <option value="${i}">${i}</option>
   `)
 }) 
birdBreedList.map((i) => {
  $('#searchBirdBreeds').append(`
  <option value="${i}">${i}</option>
  `)
}) 
rabbitBreedList.map((i) => {
  $('#searchRabbitBreeds').append(`
  <option value="${i}">${i}</option>
  `)
}) 
horseBreedList.map((i) => {
  $('#searchHorseBreeds').append(`
  <option value="${i}">${i}</option>
  `)
}) 
}

//displays other search filters after the type of animal is selected
function searchTypeToggle() {
  $('select#searchTypes').change(function() {
    let selectedType = $(this).children('option:selected').val();
    selectedType == 'Dog' ? $('#searchDogBreeds').show() && $('.hiddenSearchPageCategories').show(): $('#searchDogBreeds').hide();
    selectedType == 'Cat' ? $('#searchCatBreeds').show() && $('.hiddenSearchPageCategories').show(): $('#searchCatBreeds').hide();
    selectedType == 'Rabbit' ? $('#searchRabbitBreeds').show() && $('.hiddenSearchPageCategories').show(): $('#searchRabbitBreeds').hide();
    selectedType == 'Bird' ? $('#searchBirdBreeds').show() && $('.hiddenSearchPageCategories').show(): $('#searchBirdBreeds').hide();
    selectedType == 'Horse' ? $('#searchHorseBreeds').show() && $('.hiddenSearchPageCategories').show(): $('#searchHorseBreeds').hide()
  })
}

//run all search functionality
$(function() {
  
  searchTypeToggle()
  breeds()
  toggleNav()
  homeRender()
  searchRender()
  getValues()
  getSearchPageValues()
});





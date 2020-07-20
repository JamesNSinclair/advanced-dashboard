//WEATHER//

let appId = '6bab5d3bc7059b5bd099a5c9929580d1';
let units = 'metric';
let searchMethod;

function getSearchMethod(searchTerm) {
  if(searchTerm.length === 5 && Number.parseInt(searchTerm) + '' === searchTerm)
  searchMethod = 'zip';
  else {
    searchMethod = 'q';
  }
}

function searchWeather(searchTerm) {
  getSearchMethod(searchTerm);
  fetch(`http://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appId}&units=${units}`).then(result => {
    return result.json();
  }).then(result => {
    init(result);
  })
 function init(resultFromServer) {
   const weatherImg =   document.querySelector('.dashboardAppWeather');
   console.log(weatherImg);
   switch(resultFromServer.weather[0].main) {
     case 'Clear':
      weatherImg.style.backgroundImage = 'url("images/default.jpg")';
     break;

     case 'Clouds':
     weatherImg.style.backgroundImage = 'url("images/cloudy.jpg")';
     break;

     case 'Rain':
     case 'Drizzle':
     case 'Mist':
    weatherImg.style.backgroundImage = 'url("images/rain.jpg")';
     break;

     case 'Thunderstorm':
     weatherImg.style.backgroundImage = 'url("images/storm.jpg")';
     break;

     case 'Snow':
    weatherImg.style.backgroundImage = 'url("images/snow.jpg")';
     break;

   }
   let weatherDescriptionHeader = document.getElementById('weatherDescriptionHeader');
   let temperatureElement = document.getElementById('temperature');
   let humidityElement = document.getElementById('humidity');
   let windSpeedElement = document.getElementById('windSpeed');
   let cityHeader = document.getElementById('cityHeader');
   let weatherIcon = document.getElementById('documentIconImg');

   weatherIcon.src = 'http://openweathermap.org/img/w/' + resultFromServer.weather[0].icon + '.png';

   let resultDescription = resultFromServer.weather[0].description;
   weatherDescriptionHeader.innerText = resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1);

   temperatureElement.innerHTML = Math.floor(resultFromServer.main.temp) + '&#176';
   windSpeedElement.innerHTML = 'Winds at ' + Math.floor(resultFromServer.wind.speed) + 'm/s';
   cityHeader.innerHTML = resultFromServer.name;
   humidityElement.innerHTML = 'Humidity levels at ' + resultFromServer.main.humidity + '%' }
}

document.getElementById('searchBtn').addEventListener('click', () => {
  let searchTerm = document.getElementById('searchInput').value;
  if(searchTerm)
  searchWeather(searchTerm);
})


//IMAGE GALLERY//

 const impFile = document.getElementById("inpFile");
 const previewContainer = document.getElementById("imagePreview");
   const previewDefaultText = document.getElementsByClassName("image-text");
   const LOCAL_STORAGE_PHOTOSARR_KEY = "photoarr"
   let photoarr = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PHOTOSARR_KEY)) || [];

 inpFile.addEventListener("change", function() {

   const file = this.files[0];

   if (file) {
     const reader = new FileReader();


const previewImage = document.getElementsByClassName("image-preview__image");


     for (i = 0; i < previewImage.length; i++) {
       if (photoarr.length === 4) {
         for (f = 0; f < previewImage.length; f++) {

           previewImage[f].setAttribute('src', "");
           previewDefaultText[f].style.display = "block";
           previewImage[f].style.display = "none";
           photoarr = [];
         }
          }

    if ( previewDefaultText[i].style.display !== "none") {

     previewDefaultText[i].style.display = "none";
     previewImage[i].style.display = "block";

     reader.addEventListener("load", function() {
       photoarr.push(this.result);
       save();
       previewImage[i].setAttribute('src', photoarr[i]);
     });
     reader.readAsDataURL(file);

      break;
   }

   }
   }
 });

 //MEMO//

const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')

const LOCAL_STORAGE_LIST_KEY = "task.lists"
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId"
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

listsContainer.addEventListener('click', e => {
  if(e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId;
    saveAndRender()
  }
})

newListForm.addEventListener('submit', e => {
  e.preventDefault()
  const listName = newListInput.value
  if(listName == null || listName === "") return
  const list = createList(listName)
  newListInput.value = null
  lists.push(list)
  saveAndRender()
});

function createList(name) {
 return  {id: Date.now().toString(), name: name, tasks: []}
}

function saveAndRender() {
  save()
  render()
}


 function render() {
   clearElement(listsContainer)
   lists.forEach(list => {
     const listElement = document.createElement('li')
     listElement.dataset.listId= list.id
     listElement.classList.add("list-name")
     listElement.innerText = list.name
     if(list.id === selectedListId) {
     listElement.classList.add('active-list')
   }
     listsContainer.appendChild(listElement)
   })
 }

 function clearElement(element) {
 while(element.firstChild) {
   element.removeChild(element.firstChild)
    }
 }

 render()

 function save() {
   localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
   localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
   localStorage.setItem(LOCAL_STORAGE_PHOTOSARR_KEY, JSON.stringify(photoarr))
   }

/*===================================
            WEATHER
=====================================*/

let appId = '6bab5d3bc7059b5bd099a5c9929580d1';
let units = 'metric';
let searchMethod;

function getSearchMethod(searchTerm) {
    if (searchTerm.length === 5 && Number.parseInt(searchTerm) + '' === searchTerm)
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
        const weatherImg = document.querySelector('.dashboardAppWeather');
        console.log(weatherImg);
        switch (resultFromServer.weather[0].main) {
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
        humidityElement.innerHTML = 'Humidity levels at ' + resultFromServer.main.humidity + '%'
    }
}

document.getElementById('searchBtn').addEventListener('click', () => {
    let searchTerm = document.getElementById('searchInput').value;
    if (searchTerm)
        searchWeather(searchTerm);
})



/*===================================
            IMAGE GALLERY
=====================================*/

const impFile = document.getElementById("inpFile");
const previewContainer = document.getElementById("imagePreview");
const previewDefaultText = document.getElementsByClassName("image-text");
const LOCAL_STORAGE_PHOTOSARR_KEY = "photoarr";
let photoarr = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PHOTOSARR_KEY)) || [];

inpFile.addEventListener("change", function() {

    const file = this.files[0];

    if (file) {
        const reader = new FileReader();


        const previewImage = document.getElementsByClassName("image-preview__image");


        for (i = 0; i < previewImage.length; i++) {
            if (photoarr.length >= 4) {
                for (f = 0; f < previewImage.length; f++) {

                    previewImage[f].setAttribute('src', "");
                    previewDefaultText[f].style.display = "block";
                    previewImage[f].style.display = "none";
                    photoarr = [];
                }
            }

            if (previewDefaultText[i].style.display !== "none") {

                previewDefaultText[i].style.display = "none";
                previewImage[i].style.display = "block";

                reader.addEventListener("load", function() {
                    photoarr.push(this.result);
                    previewImage[i].setAttribute('src', photoarr[i]);
                    save();
                });
                reader.readAsDataURL(file);

                break;
            }

        }
    }
});

loadImages()

function loadImages() {
    const previewImage = document.getElementsByClassName("image-preview__image");

    console.log(photoarr)
    if (photoarr.length >= 5) {
        for (f = 0; f < previewImage.length; f++) {
            previewImage[f].setAttribute('src', "");
            previewDefaultText[f].style.display = "block";
            previewImage[f].style.display = "none";
            photoarr = [];
        }
    }

    for (i = 0; i < photoarr.length; i++) {
        if (previewDefaultText[i].style.display !== "none") {

            previewDefaultText[i].style.display = "none";
            previewImage[i].style.display = "block";
            previewImage[i].setAttribute('src', photoarr[i]);
        }
    }
}



/*===================================
           MEMOS
=====================================*/

const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const closeListButton = document.querySelector('[data-close-list-button]')

const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')

const LOCAL_STORAGE_LIST_KEY = "task.lists"
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId"
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId;
        saveAndRender()
        listDisplayContainer.style.zIndex = "15";
    }
})

tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedList)

    }
})

deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null;
    listDisplayContainer.style.zIndex = "";
    saveAndRender()
})

closeListButton.addEventListener('click', e => {
    listDisplayContainer.style.zIndex = "";
})

clearCompleteTasksButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})

newListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput.value
    if (listName == null || listName === "") return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()

});

newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if (taskName == null || taskName === "") return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
});

function createList(name) {
    return {
        id: Date.now().toString(),
        name: name,
        tasks: []
    }
}

function createTask(name) {
    return {
        id: Date.now().toString(),
        name: name,
        complete: false
    }
}


function saveAndRender() {
    save()
    render()
}


function render() {
    clearElement(listsContainer)
    renderLists()
    const selectedList = lists.find(list => list.id === selectedListId)
    if (selectedListId == null) {
        listDisplayContainer.style.zIndex = "";
    } else {
        listTitleElement.innerText = selectedList.name;
        renderTaskCount(selectedList)
        clearElement(tasksContainer)
        renderTasks(selectedList)


    }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)
    })
}

function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`

}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerText = list.name
        if (list.id === selectedListId) {

        }
        listsContainer.appendChild(listElement)
    })
}


function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

renderLists()

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
    localStorage.setItem(LOCAL_STORAGE_PHOTOSARR_KEY, JSON.stringify(photoarr))
}



/*===================================
            CLOTHING
=====================================*/

let myChart = document.getElementById('myChart')
myChart.height = 240;
let popChart = new Chart(myChart, {
    type: 'pie',
    data: {
        labels: ['jumpers', 'hoodies', 'sweaters', 'blazers', 'jackets', 'raincoats'],
        datasets: [{
            label: 'Clothes Worn',
            data: data,
            backgroundColor: ['#29066C', '#7D39C0', '#B04BCF', '#DC4BB4', '#EB548B', '#E97369']
        }]
    },
    options: {}
});


/*===================================
            SPORTS
=====================================*/

const sportsContainer = document.querySelector('[sports-list]')
const dashboardSports = document.getElementById('dashboardAppSports')
let appearences = [];
let h = 0;

document.getElementById('sportSearchBtn').addEventListener('click', () => {
    clearElement(sportsContainer)
    h = 0;
    appearences = [];
    const sportSearchTerm = document.getElementById('sportSearchInput').value;
    if (sportSearchTerm !== "") {
        console.log(sportSearchTerm)
        searchSports(titalize(sportSearchTerm));
    }
})

function titalize(entered) {
    return entered.charAt(0).toUpperCase() + entered.slice(1);
}


function searchSports(sportSearchTerm) {
    for (i = 0; i < sports.length; i += 1) {
        const teamName = sportSearchTerm;
        if (sports[i].HomeTeam.includes(teamName) && sports[i].FTR === 'H') {
            appearences.push(sports[i]);
            let opponent = sports[i].AwayTeam;
            let outcome = String(sports[i].Date)
            recentWins(teamName, appearences, opponent, outcome)
        } else if (sports[i].AwayTeam.includes(teamName) && sports[i].FTR === 'A') {
            appearences.push(sports[i]);
            let opponent = sports[i].HomeTeam;
            let outcome = String(sports[i].Date)
            recentWins(teamName, appearences, opponent, outcome)
        };
        if (h === 4) {
            break
        }
    }

};

function recentWins(teamName, appearences, opponent, outcome) {
    const winners = String(teamName + ' won against ' + opponent)
    console.log(outcome)
    renderWinners(winners, outcome)
}


function renderWinners(winners, outcome) {
    dashboardSports.style.backgroundImage = "url('images/trophy.png')";
    let list = "";
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add("victories")
    listElement.innerHTML = winners + '<br>' + outcome
    sportsContainer.appendChild(listElement)
    h += 1
    console.log(h)

}

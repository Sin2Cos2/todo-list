//Weather script
//Grab elements from weather-card
const timezone = document.querySelector(".timezone")
const degree = document.querySelector(".degree")
const descriptionWeather = document.querySelector(".description")
const weatherIcon = document.querySelector("#wicon")

window.addEventListener('load', () =>{
    let long;
    let lat;

    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude
            long = position.coords.longitude

            const key = 'b64f1269a14b1ce80aec934cd52398dd'
            const api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}`

            fetch(api)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    let {temp} = data.main
                    const {description} = data.weather[0]
                    const {name} = data
                    const {icon} = data.weather[0]
                    const iconurl = "http://openweathermap.org/img/w/" + icon + ".png"
                    temp = Math.round(temp - 273.15)

                    weatherIcon.src = iconurl
                    timezone.textContent = name
                    degree.textContent = temp
                    descriptionWeather.textContent = description                })
        })
        

    }
})

//Todo list
//Grab elements
const inputTodo = document.querySelector('#input-text')
const buttonAdd = document.querySelector('.Add')
const todoList = document.querySelector('.todo-list')
//Add new todo

window.addEventListener('load', loadStorage)
buttonAdd.addEventListener('click', addNewTodo)
inputTodo.addEventListener('keyup', event =>{
    if(event.keyCode === 13)
    {
        addNewTodo()
    }
})

function addNewTodo(){
    if(inputTodo.value === '') return
    
    const todoDiv = document.createElement('div')
    todoDiv.classList.add('todo-div')
    
    const todo = document.createElement('li')
    todo.classList.add('todo')
    todo.innerText = inputTodo.value
    appendTodoToStorage(inputTodo.value)
    inputTodo.value = ''
    todoDiv.appendChild(todo)
    //Saving value to Local Storage

    const completeButton = document.createElement('button')
    completeButton.classList.add("complete-btn")
    completeButton.innerHTML = '&#10004;'
    todoDiv.appendChild(completeButton)

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('delete-btn')
    deleteButton.innerHTML = '&#10008;'
    todoDiv.appendChild(deleteButton)

    todoList.appendChild(todoDiv)
}


//Grab delete and complete button

todoList.addEventListener('click', deleteCheck)
let direction = 1

function deleteCheck(event){
    const item = event.target

    if(item.classList[0] === 'complete-btn')
    {
        const todo = item.parentElement
        todo.classList.toggle('completed')
    }
    if(item.classList[0] === 'delete-btn')
    {
        const todo = item.parentElement
        removeFromStorage(todo.textContent)
        if(direction === 1)
        {
            todo.classList.add('fly-right')
            direction *= -1
        } else {
            todo.classList.add('fly-left')
            direction *= -1
        }
        todo.addEventListener('transitionend', () => {
            todo.remove()
        })
    }
}

//Local Storage
function appendTodoToStorage(todo){
    
    let todos;
    if(localStorage.getItem("todos") === null)
    {
        todos = [];
    } else 
    {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function removeFromStorage(todo){

    todo = todo.slice(0, -2)
    let todos;    
    todos = JSON.parse(localStorage.getItem("todos"))
    const index = todos.indexOf(todo)

    if(index !== -1){
        todos.splice(index, 1)
    }

    localStorage.setItem("todos", JSON.stringify(todos))
}

function loadStorage(){
    let todos;

    todos = JSON.parse(localStorage.getItem("todos"))
    if(todos === null) return

    todos.forEach(item => {

        const todoDiv = document.createElement('div')
        todoDiv.classList.add('todo-div')
    
        const todo = document.createElement('li')
        todo.classList.add('todo')
        todo.innerText = item
        inputTodo.value = ''
        todoDiv.appendChild(todo)
        //Saving value to Local Storage

        const completeButton = document.createElement('button')
        completeButton.classList.add("complete-btn")
        completeButton.innerHTML = '&#10004;'
        todoDiv.appendChild(completeButton)

        const deleteButton = document.createElement('button')
        deleteButton.classList.add('delete-btn')
        deleteButton.innerHTML = '&#10008;'
        todoDiv.appendChild(deleteButton)

        todoList.appendChild(todoDiv)

    })
}

//Music player
//Grab elements
const prev = document.querySelector('#prev')
const play = document.querySelector("#play")
const next = document.querySelector('#next')
const progress = document.querySelector('.progress')
const progressContainer = document.querySelector('.progress-container')
const music = document.querySelector('.music-container')
const title = document.querySelector('#title')
const cover = document.querySelector("#cover")
const audio = document.querySelector("#audio")


const songs = ['Selected', 'Beat', 'Lavish', 'Break', 'Hop', 'Kaxe']
let songIndex = 0

window.addEventListener('load', () => {
    loadSong()
    playSong()
})
play.addEventListener('click', playSong)
next.addEventListener('click', nextSong)
prev.addEventListener('click', prevSong)
audio.addEventListener('timeupdate', updateProgress)
progressContainer.addEventListener('click', setProgress)
audio.addEventListener('ended', nextSong)


function nextSong(){
    songIndex++

    if(songIndex > songs.length - 1){
        songIndex = 0
    }

    loadSong()
    audio.play()
}

function prevSong(){
    songIndex--

    if(songIndex < 0){
        songIndex = songs.length - 1
    }

    loadSong()
    audio.play()
}

function updateProgress(e){
    const {duration, currentTime} = e.srcElement
    const progressPercent = currentTime / duration * 100
    progress.style.width = `${progressPercent}%`
}

function setProgress(e){
    const width = this.clientWidth
    const clickX = e.offsetX
    const duration = audio.duration

    audio.currentTime = (clickX / width) * duration
}


function loadSong(){
    title.innerText = songs[songIndex]
    audio.src = `./music/${songs[songIndex]}.mp3`
    cover.src = `./img/${songs[songIndex]}.jpg`
}

function playSong(){
    if(music.classList.contains("play"))
    {
        music.classList.remove("play")
        play.querySelector('i.fas').classList.remove('fa-pause')
        play.querySelector('i.fas').classList.add('fa-play')
        audio.pause()
    } else {
        music.classList.add("play")
        play.querySelector('i.fas').classList.add('fa-pause')
        play.querySelector('i.fas').classList.remove('fa-play')
        audio.play()
    }
}



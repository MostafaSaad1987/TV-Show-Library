const searchBar = document.querySelector("#search-bar");

const cardContainer = document.querySelector("#container");

// Timeout for when the user stops typing, to not overuse the API.
// Works by having a timer be reset everytime the user types, and if he stops typing, and the timer
// runs out, the search function will be executed.
let timer;

const waitTime = 1250;

searchBar.addEventListener('keyup', SearchTimeout);
searchBar.addEventListener("focus", SearchTimeout);

function SearchTimeout() {
    clearTimeout(timer);

    timer = setTimeout(() => {
        Search();
    }, waitTime);
}

async function Search() {
    let userSearch = searchBar.value;
    const parameters = { params: { q: userSearch } };
    const response = await axios.get("https://api.tvmaze.com/search/shows", parameters);

    const shows = response.data;

    ClearResults();

    for (let show of shows) {
        ShowResults(show.show.name);
    }
}

async function GetShowDetails(show) {
    const parameters = { params: { q: show } };
    const response = await axios.get("https://api.tvmaze.com/search/shows", parameters);

    const details = response.data[0];

    const showName = details.show.name;
    let showImage;
    if (details.show.image) {
        showImage = details.show.image.medium;
    } else {
        showImage = "./images/placeholder.png";
    }
    const showStatus = details.show.status;
    const showEpNum = details.show.runtime;
    const showRating = details.show.rating.average;
    const showDate = details.show.premiered;

    CreateCard(showName, showImage, showStatus, showEpNum, showRating, showDate);
}

function CreateCard(title, image, status, num, score, year) {
    const newCard = document.createElement("div");
    newCard.classList.add("card");

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-button");
    removeButton.innerText = "Remove";
    newCard.append(removeButton);

    const newTitle = document.createElement("p");
    newTitle.textContent = title;
    newCard.append(newTitle);

    const newImage = document.createElement("img");
    newImage.src = image;
    newImage.alt = title;
    newCard.append(newImage);

    const newStatus = document.createElement("p");
    newStatus.textContent = status;
    newCard.append(newStatus);

    const newNum = document.createElement("p");
    newNum.textContent = num;
    newCard.append(newNum);

    const newScore = document.createElement("p");
    newScore.textContent = score;
    newCard.append(newScore);

    const newDate = document.createElement("p");
    newDate.textContent = year;
    newCard.append(newDate);

    if (newNum.textContent != "") {
        newCard.append(document.createElement("br"));

        const watchedLabel = document.createElement("label");
        watchedLabel.htmlFor = "watched";
        watchedLabel.innerText = "Progress";

        const watchIndicator = document.createElement("input");
        watchIndicator.type = "range";
        watchIndicator.classList.add("watched");
        watchIndicator.name = "watched";
        watchIndicator.min = 0;
        watchIndicator.max = parseInt(newNum.textContent);
        watchIndicator.value = 0;

        newCard.append(watchedLabel);
        newCard.append(watchIndicator);

        const watchContainer = document.createElement("p");
        watchContainer.classList.add("watch-container");

        const epWatchCount = document.createElement("span");
        epWatchCount.classList.add("ep-watch-count");
        epWatchCount.textContent = 0;

        const epCount = document.createElement("span");
        epCount.classList.add("ep-count");
        epCount.textContent = parseInt(newNum.textContent);

        watchContainer.append(epWatchCount, " / ", epCount);

        newCard.append(watchContainer);

        const increaseButton = document.createElement("button");
        increaseButton.classList.add("increase");
        increaseButton.innerHTML = "+";


        const decreaseButton = document.createElement("button");
        decreaseButton.classList.add("decrease");
        decreaseButton.innerHTML = "-";

        newCard.append(increaseButton, decreaseButton);
    }

    cardContainer.append(newCard);

    SaveCards();
}

const searchBarResults = document.querySelector("#search-results");

function ShowResults(name) {
    const res = document.createElement("div");
    res.classList.add("result");
    res.innerText = name;
    searchBarResults.append(res);
}

document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("result")) {
        GetShowDetails(e.target.innerText);
        ClearResults();
    }

    if (e.target.classList.contains("remove-button")) {
        e.target.parentElement.remove();
    }

    if (e.target.classList.contains("increase")) {
        const progressBar = e.target.parentElement.querySelector(".watched");
        const watched = e.target.parentElement.querySelector(".ep-watch-count");

        progressBar.value++;
        watched.textContent = parseInt(progressBar.value);

        if (watched.textContent == progressBar.getAttribute("max")) {
            watched.style.color = "green";
        }
    }

    if (e.target.classList.contains("decrease")) {
        const progressBar = e.target.parentElement.querySelector(".watched");
        const watched = e.target.parentElement.querySelector(".ep-watch-count");

        progressBar.value--;
        watched.textContent = parseInt(progressBar.value);

        watched.style.color = "black";
    }

    SaveCards();
});

document.body.addEventListener("input", (e) => {
    if (e.target.classList.contains("watched")) {
        e.target.value = e.target.value;

        const watchedNum = e.target.parentElement.querySelector(".ep-watch-count");
        const maxEp = e.target.parentElement.querySelector(".ep-count");

        watchedNum.textContent = e.target.value;

        if (watchedNum.textContent == maxEp.textContent) {
            watchedNum.style.color = "green";
        } else {
            watchedNum.style.color = "black";
        }
    }
});

function ClearResults() {
    searchBarResults.innerText = "";
}


// Trying to implement saving using local storage.
function SaveCards() {
    localStorage.setItem("cards", cardContainer.innerHTML);
    console.log(cardContainer);
}

let savedCards = localStorage.getItem("cards");

if (savedCards) {
    cardContainer.innerHTML = savedCards;

    // Range inputs weren't working properly, so I had to change them manually after loading.
    let progressBar = document.querySelectorAll(".watched");
    for (let p of progressBar) {
        let w = p.parentElement.querySelector(".ep-watch-count");
        p.value = w.textContent;
    }
}
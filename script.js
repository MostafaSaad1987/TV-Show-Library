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
        showImage = "images/placeholder.png";
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

    cardContainer.append(newCard);
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
});

function ClearResults() {
    searchBarResults.innerText = "";
}
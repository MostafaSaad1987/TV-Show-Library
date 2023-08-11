const searchBar = document.querySelector("#search-bar");

// Timeout for when the user stops typing, to not overuse the API.
// Works by having a timer be reset everytime the user types, and if he stops typing, and the timer
// runs out, the search function will be executed.
let timer;

const waitTime = 1500;

searchBar.addEventListener('keyup', () => {
    clearTimeout(timer);

    timer = setTimeout(() => {
        Search();
    }, waitTime);
});

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
    const showStatus = details.show.status;
    const showEpNum = details.show.runtime;
    const showRating = details.show.rating.average;
    const showDate = details.show.premiere;
}

function CreateCard(title, status, num, score, year) {

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
const form = document.getElementById("form");
const query = document.getElementById("query");
const result = document.getElementById("result");
const error = document.getElementById("error");
const loading = document.getElementById("loading");
const recent = document.getElementById("recent");
const recentWrap = document.getElementById("recentWrap");
const clear = document.getElementById("clear");

let searches = JSON.parse(
    localStorage.getItem("task4Recent") || "[]"
);


// ===============================
// RECENT SEARCHES
// ===============================

function renderRecent() {
    recent.innerHTML = "";

    recentWrap.style.display =
        searches.length ? "block" : "none";

    searches.forEach((country) => {

        const button = document.createElement("button");

        button.textContent = country;
        button.type = "button";

        button.onclick = () => {
            searchCountry(country);
        };

        recent.appendChild(button);
    });
}


function saveRecent(country) {

    searches = [
        country,
        ...searches.filter(
            x => x.toLowerCase() !== country.toLowerCase()
        )
    ].slice(0, 3);

    localStorage.setItem(
        "task4Recent",
        JSON.stringify(searches)
    );

    renderRecent();
}


// ===============================
// NUMBER FORMAT
// ===============================

function formatNumber(number) {

    return new Intl.NumberFormat().format(
        number || 0
    );
}


// ===============================
// SEARCH COUNTRY
// ===============================

async function searchCountry(searchText) {

    const q = searchText.trim();

    if (!q) {

        error.textContent =
            "Please enter a country name.";

        return;
    }

    error.textContent = "";
    result.innerHTML = "";

    loading.classList.add("show");


    try {

        // CURRENT REST COUNTRIES API V5
        const url =
            "https://api.restcountries.com/countries/v5?q=" +
            encodeURIComponent(q) +
            "&

const form = document.getElementById("form");
const query = document.getElementById("query");
const result = document.getElementById("result");
const error = document.getElementById("error");
const loading = document.getElementById("loading");
const recent = document.getElementById("recent");
const recentWrap = document.getElementById("recentWrap");
const clear = document.getElementById("clear");

const API_URL =
    "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";

let countriesData = [];
let searches = JSON.parse(
    localStorage.getItem("task4Recent") || "[]"
);


// Load country data
async function loadCountries() {

    try {

        loading.classList.add("show");

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Data loading failed");
        }

        countriesData = await response.json();

        searchCountry("Pakistan");

    } catch (error) {

        console.error(error);

        result.innerHTML = `
            <div class="empty">
                ❌ Country data load nahi ho saka.
                Internet connection check karein.
            </div>
        `;

        document.getElementById("error").textContent =
            "Unable to load live country data.";

    } finally {

        loading.classList.remove("show");

    }
}


// Recent searches display
function renderRecent() {

    recent.innerHTML = "";

    recentWrap.style.display =
        searches.length ? "block" : "none";

    searches.forEach(function (name) {

        const button = document.createElement("button");

        button.type = "button";
        button.textContent = name;

        button.addEventListener("click", function () {

            query.value = name;
            searchCountry(name);

        });

        recent.appendChild(button);

    });

}


// Save recent searches
function saveRecent(name) {

    searches = [
        name,
        ...searches.filter(function (item) {

            return item.toLowerCase() !== name.toLowerCase();

        })
    ].slice(0, 3);

    localStorage.setItem(
        "task4Recent",
        JSON.stringify(searches)
    );

    renderRecent();

}


// Format number
function formatNumber(number) {

    return new Intl.NumberFormat().format(number || 0);

}


// Search country
function searchCountry(searchText) {

    const search = searchText.trim().toLowerCase();

    if (!search) {

        error.textContent =
            "Please enter a country name.";

        return;

    }

    if (!countriesData.length) {

        error.textContent =
            "Country data is still loading.";

        return;

    }

    error.textContent = "";
    result.innerHTML = "";

    loading.classList.add("show");


    try {

        const country = countriesData.find(function (item) {

            const common =
                item.name?.common?.toLowerCase() || "";

            const official =
                item.name?.official?.toLowerCase() || "";

            return (
                common === search ||
                official === search ||
                common.includes(search)
            );

        });


        if (!country) {

            throw new Error("Country not found");

        }


        const name =
            country.name?.common || "Not available";

        const official =
            country.name?.official || "Not available";

        const capital =
            country.capital?.[0] || "Not available";

        const region =
            country.region || "Not available";

        const subregion =
            country.subregion || "Not available";

        const population =
            country.population || 0;


        const currency = country.currencies
            ? Object.entries(country.currencies)
                .map(function ([code, value]) {

                    return `${value.name} (${code})`;

                })
                .join(", ")
            : "Not available";


        const languages = country.languages
            ? Object.values(country.languages).join(", ")
            : "Not available";


        const flag =
            country.flags?.png ||
            country.flags?.svg ||
            "";


        const mapURL =
            country.latlng?.length >= 2
                ? `https://www.google.com/maps/search/?api=1&query=${country.latlng[0]},${country.latlng[1]}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;


        result.innerHTML = `

            <article class="card">

                <img
                    class="flag"
                    src="${flag}"
                    alt="${name} flag"
                >

                <div class="info">

                    <h2>${name}</h2>

                    <p class="official">
                        ${official}
                    </p>

                    <div class="grid">

                        <div class="item">
                            <b>Capital</b>
                            <span>${capital}</span>
                        </div>

                        <div class="item">
                            <b>Region</b>
                            <span>${region}</span>
                        </div>

                        <div class="item">
                            <b>Subregion</b>
                            <span>${subregion}</span>
                        </div>

                        <div class="item">
                            <b>Population</b>
                            <span>${formatNumber(population)}</span>
                        </div>

                        <div class="item">
                            <b>Currency</b>
                            <span>${currency}</span>
                        </div>

                        <div class="item">
                            <b>Languages</b>
                            <span>${languages}</span>
                        </div>

                    </div>

                    <a
                        class="map"
                        href="${mapURL}"
                        target="_blank"
                        rel="noopener"
                    >
                        View on Google Maps ↗
                    </a>

                </div>

            </article>

        `;


        saveRecent(name);


    } catch (err) {

        console.error(err);

        result.innerHTML = `

            <div class="empty">
                😕 No country found.
                Please try another name.
            </div>

        `;

        error.textContent =
            "Country not found. Try Pakistan, India or Turkey.";

    } finally {

        loading.classList.remove("show");

    }

}


// Form submit
form.addEventListener("submit", function (event) {

    event.preventDefault();

    searchCountry(query.value);

});


// Clear recent
clear.addEventListener("click", function () {

    searches = [];

    localStorage.removeItem("task4Recent");

    renderRecent();

});


// Start
renderRecent();
loadCountries();

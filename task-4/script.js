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


// Recent searches show
function renderRecent() {

    recent.innerHTML = "";

    recentWrap.style.display =
        searches.length > 0 ? "block" : "none";

    searches.forEach(function (country) {

        const button = document.createElement("button");

        button.textContent = country;
        button.type = "button";

        button.addEventListener("click", function () {
            query.value = country;
            searchCountry(country);
        });

        recent.appendChild(button);

    });
}


// Save recent search
function saveRecent(country) {

    searches = [
        country,
        ...searches.filter(function (item) {
            return item.toLowerCase() !== country.toLowerCase();
        })
    ].slice(0, 3);

    localStorage.setItem(
        "task4Recent",
        JSON.stringify(searches)
    );

    renderRecent();
}


// Format population
function formatNumber(number) {
    return new Intl.NumberFormat().format(number || 0);
}


// Search country
async function searchCountry(countryName) {

    const country = countryName.trim();

    if (!country) {
        error.textContent = "Please enter a country name.";
        return;
    }

    error.textContent = "";
    result.innerHTML = "";
    loading.classList.add("show");

    try {

        const apiURL =
            "https://restcountries.com/v3.1/name/" +
            encodeURIComponent(country);

        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error("Country not found");
        }

        const countries = await response.json();

        if (!Array.isArray(countries) || countries.length === 0) {
            throw new Error("No country data");
        }

        const data = countries[0];

        const name =
            data.name?.common || country;

        const official =
            data.name?.official || "Not available";

        const capital =
            data.capital?.[0] || "Not available";

        const region =
            data.region || "Not available";

        const subregion =
            data.subregion || "Not available";

        const population =
            data.population || 0;

        const currency =
            data.currencies
                ? Object.entries(data.currencies)
                    .map(function ([code, value]) {
                        return `${value.name} (${code})`;
                    })
                    .join(", ")
                : "Not available";

        const languages =
            data.languages
                ? Object.values(data.languages).join(", ")
                : "Not available";

        const flag =
            data.flags?.png || "";

        const map =
            data.maps?.googleMaps || "#";


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
                        href="${map}"
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

        console.error("API Error:", err);

        result.innerHTML = `
            <div class="empty">
                😕 No country found.
                Please try another name.
            </div>
        `;

        error.textContent =
            "API error. Please try again.";

    } finally {

        loading.classList.remove("show");

    }

}


// Form submit
form.addEventListener("submit", function (event) {

    event.preventDefault();

    searchCountry(query.value);

});


// Clear recent searches
clear.addEventListener("click", function () {

    searches = [];

    localStorage.removeItem("task4Recent");

    renderRecent();

});


// Initial setup
renderRecent();


// Automatically load Pakistan
searchCountry("Pakistan");

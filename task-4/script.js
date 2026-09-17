const form = document.getElementById("form");
const query = document.getElementById("query");
const result = document.getElementById("result");
const error = document.getElementById("error");
const loading = document.getElementById("loading");
const recent = document.getElementById("recent");
const recentWrap = document.getElementById("recentWrap");
const clear = document.getElementById("clear");

const API_URL =
    "https://cdn.jsdelivr.net/gh/mledoze/countries@master/countries.json";

let countriesData = [];

let searches = JSON.parse(
    localStorage.getItem("task4Recent") || "[]"
);


// Fallback data
const fallbackData = [
    {
        name: {
            common: "Pakistan",
            official: "Islamic Republic of Pakistan"
        },
        cca2: "PK",
        capital: ["Islamabad"],
        region: "Asia",
        subregion: "Southern Asia",
        population: 241499431,
        currencies: {
            PKR: {
                name: "Pakistani rupee"
            }
        },
        languages: {
            urd: "Urdu",
            eng: "English"
        },
        latlng: [30, 70],
        flag: "🇵🇰"
    },
    {
        name: {
            common: "India",
            official: "Republic of India"
        },
        cca2: "IN",
        capital: ["New Delhi"],
        region: "Asia",
        subregion: "Southern Asia",
        population: 1428627663,
        currencies: {
            INR: {
                name: "Indian rupee"
            }
        },
        languages: {
            hin: "Hindi",
            eng: "English"
        },
        latlng: [20, 77],
        flag: "🇮🇳"
    },
    {
        name: {
            common: "Turkey",
            official: "Republic of Türkiye"
        },
        cca2: "TR",
        capital: ["Ankara"],
        region: "Asia",
        subregion: "Western Asia",
        population: 853260000,
        currencies: {
            TRY: {
                name: "Turkish lira"
            }
        },
        languages: {
            tur: "Turkish"
        },
        latlng: [39, 35],
        flag: "🇹🇷"
    }
];


// Format number
function formatNumber(number) {
    return new Intl.NumberFormat().format(number || 0);
}


// Recent searches
function renderRecent() {

    recent.innerHTML = "";

    recentWrap.style.display =
        searches.length > 0 ? "block" : "none";

    searches.forEach(function (name) {

        const button = document.createElement("button");

        button.type = "button";
        button.textContent = name;

        button.onclick = function () {
            query.value = name;
            searchCountry(name);
        };

        recent.appendChild(button);

    });
}


// Save searches
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


// Load country data
async function loadCountries() {

    loading.classList.add("show");

    try {

        const controller = new AbortController();

        const timeout = setTimeout(function () {
            controller.abort();
        }, 15000);

        const response = await fetch(API_URL, {
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error("API failed");
        }

        countriesData = await response.json();

        if (!Array.isArray(countriesData)) {
            throw new Error("Invalid data");
        }

    } catch (err) {

        console.error("API Error:", err);

        // Fallback data
        countriesData = fallbackData;

    } finally {

        loading.classList.remove("show");

        searchCountry("Pakistan");

    }

}


// Search country
function searchCountry(searchText) {

    const search = searchText.trim().toLowerCase();

    if (!search) {

        error.textContent =
            "Please enter a country name.";

        return;

    }

    error.textContent = "";

    loading.classList.add("show");

    setTimeout(function () {

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


            const code =
                country.cca2?.toLowerCase() || "";


            const flag = code
                ? `https://flagcdn.com/w640/${code}.png`
                : "";


            const mapURL =
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;


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
                                <span>
                                    ${formatNumber(population)}
                                </span>
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

    }, 300);

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


// Start app
renderRecent();

loadCountries();

// Update search bar depending on category selected
const updateSearchBar = () => {
    if(document.querySelector('#category').value == "name") {
        document.querySelector("#search").type = "name";
        document.querySelector('#search').classList.remove("pointer");
    } else {
        document.querySelector("#search").type = "date";
        document.querySelector('#search').classList.add("pointer");
    }
};
updateSearchBar();

// Return url for api depending on category, search and country
const setUrlSearch = () => {
    const search = document.querySelector('#search').value;
    const country = document.querySelector('#country').value;
    const timezone = document.querySelector('#time-zone').value;
    
    switch(document.querySelector('#category').value) {
        case 'name':
            return `https://api.abalin.net/getdate?name=${search}&country=${country}`;
        case 'date':
            const month = parseInt(search.slice(6, 7), 10);
            const day = parseInt(search.slice(8, 10), 10);
            return `https://api.abalin.net/namedays?country=${country}&month=${month}&day=${day}`;
        default:
    };
};

// Return url for api depending on proximty day, country and timezone 
const setUrlProximityDate= () => {
    const country = document.querySelector('#proximity-date-country').value;
    const timezone = document.querySelector('#time-zone').value;
    const proximityDate = document.querySelector('#proximity-date').value;
    return `https://api.abalin.net/${proximityDate}?timezone=${timezone}&country=${country}`;
};

// Display day and month as text
const getDateText = (day, month) => {
    const date = new Date(new Date().getFullYear(), (month-1), day);
    const monthText = date.toLocaleString('default', { month: 'short' });
    return  day + " " + monthText;
};

// Get country name from country code
const getCountry = countryCode => {
    const countries = {
        us: "USA",
        sk: "Slovakia",
        se: "Sweden",
        pl: "Poland",
        it: "Italy",
        hu: "Hungary",
        hr: "Croatia",
        fr: "France",
        fi: "Finland",
        es: "Spain",
        dk: "Denmark",
        de: "Germany",
        cz: "Czechia",
        at: "Austria"
    };
    for (var key in countries) {
        if(countryCode == key) return countries[key];
    }
    return "";
}

// Display alert, used for errors and no search matches found
const displayAlert = (msg, context) => {
    document.querySelector("#result").innerHTML  = `
        <div class="alert alert-${context} text-center" role="alert">
            ${msg}
        </div>
    `;
};

// Displays the response of a name search 
const displayByName = resp => {
    const search = document.querySelector('#search').value;
    const searchUpperCase = (search.charAt(0).toUpperCase() +search.slice(1));
    const countryCode = document.querySelector('#country').value;
    const country = getCountry(countryCode);

    resp.results.forEach(days => {
        const date = getDateText(days.day, days.month);
        const names = days.name.split(", ");
        let searchFoundHTML = "";

        // See if search name was found and seperator for highlight
        names.forEach((name,i) => {
            if(name === search || name === searchUpperCase) {
                searchFoundHTML = `
                    <p class="text-center mb-1">${name}</p>
                `;
                names.splice(i, 1);
            }
        });
        let nameString = names.join(', ');

        // Display all names found
        document.querySelector("#result").innerHTML += `
            <div class="jumbotron bg-primary">
                <h2 class="text-center mb-3">${country} - <span class="line-break">${date}</span></h2></h2>
                ${searchFoundHTML}
                <p class="text-center mb-4 other-names">${nameString}</p>
            </div>
        `;  
    });
};

// Displays the response of a date search 
const displayByDate = resp => {
    const date = getDateText(resp.data[0].dates.day, resp.data[0].dates.month);
    const countryCode = document.querySelector('#country').value;
    const country = getCountry(countryCode);
    const names = resp.data[0].namedays[countryCode];
    
    document.querySelector("#result").innerHTML += `
        <div class="jumbotron bg-primary">
            <h2 class="text-center mb-3">${country} - <span class="line-break">${date}</span></h2></h2>
            <p class="text-center">${names}</p>
        </div>
    `;
};

// Displays the response of a proximity day search 
const displayProximityDate = resp => {
    document.querySelector("#result").innerHTML = "";
    const date = getDateText(resp.data[0].dates.day, resp.data[0].dates.month);
    const countryCode = document.querySelector('#proximity-date-country').value;
    const country = getCountry(countryCode);
    const names = resp.data[0].namedays[countryCode];
    const proximityDate = document.querySelector('#proximity-date').value;
    const proximityDateUpperCase = (proximityDate.charAt(0).toUpperCase() +proximityDate.slice(1))
    
    document.querySelector("#result").innerHTML += `
        <div class="jumbotron bg-primary">
            <h2 class="text-center mb-2">${country} - ${proximityDateUpperCase} <span class="line-break">${date}</span></h2>
            <p class="text-center">${names}</p>
        </div>
    `;
};

// Checks if the search was for a name or a date
const display = resp => {
    document.querySelector("#result").innerHTML = "";
    switch(document.querySelector('#category').value) {
        case 'name':
            //handle no search results
            if(resp.results.length < 1) {
                displayAlert("No matches found", "warning");
            } else {
                displayByName(resp);
            }
            return;
        case 'date':
            //handle no search results
            if(resp.data.length < 1) {
                displayAlert("No matches found", "warning");
            } else {
                displayByDate(resp);
            }
            return;
        default:
    };
};

/** 
 * Event Listeners
**/

// Reset page if someone presses main header
document.querySelector("#main-header").addEventListener("click", function(e) {
    document.querySelector("#search").value = "";
    document.querySelector("#country").value = "us";
    document.querySelector("#category").value = "name";
    document.querySelector("#result").innerHTML = "";
    document.querySelector("#proximity-date").value = "today";
    document.querySelector("#proximity-date-country").value = "us";
    document.querySelector("#time-zone").value = "America/Denver";
    updateSearchBar();
});

// Change search field depending on category selected
document.querySelector('#category').addEventListener('change', function(e) {
    updateSearchBar();
    document.querySelector('#search').value = "";
});

// Display search result if something was found 
document.querySelector('#finder').addEventListener('submit', function(e) {
    e.preventDefault();
    getNameday(setUrlSearch())
        .then(display)
        .catch(err =>{
            displayAlert(err, "danger");
        });
    
});

// Display search for proximity days if something was found
document.querySelector('#proximity-date-finder').addEventListener('submit', function(e) {
    e.preventDefault();
    getNameday(setUrlProximityDate())
        .then(displayProximityDate)
        .catch(err =>{
            displayAlert(err, "danger");
        });
    
});

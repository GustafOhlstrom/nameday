// Update search bar depending on category selected
const updateSearchBar = () => {
    if(document.querySelector('#category').value == "name") {
        document.querySelector("#search").type = "name";
        document.querySelector('#search').classList.remove("pointer");
    } else {
        document.querySelector("#search").type = "date";
        document.querySelector('#search').classList.add("pointer");
    }
}
updateSearchBar();

// Return url for api depending on category, search and country
const setUrlSearch = () => {
    const search = document.querySelector('#search').value;
    const country = document.querySelector('#country').value;
    const timezone = document.querySelector('#time-zone').value;
    
    // Return if no value and if name is less than 3 characters long, api need 3 or more chars 
    if(!search || search.lenght < 3) return;

    switch(document.querySelector('#category').value) {
        case 'name':
            return `https://api.abalin.net/getdate?name=${search}&country=${country}`;
        case 'date':
            const month = parseInt(search.slice(6, 7), 10);
            const day = parseInt(search.slice(8, 10), 10);
            return `https://api.abalin.net/namedays?country=${country}&month=${month}&day=${day}`;
        default:
    }
}

// Return url for api depending on proximty day, country and timezone 
const setUrlProximityDate= () => {
    const country = document.querySelector('#proximity-date-country').value;
    const timezone = document.querySelector('#time-zone').value;
    const proximityDate = document.querySelector('#proximity-date').value;
    return `https://api.abalin.net/${proximityDate}?timezone=${timezone}&country=${country}`;
}

// Converts a month and day into a string for this year with atleast 2 numbers
const getDateString = (month, day) => {
    month = ('0' + month).slice(-2);
    day = ('0' + day ).slice(-2);
    return new Date().getFullYear() + "-" + month + "-" + day;
}

// Displays the response of a name search 
const displayByName = resp => {
    const search = document.querySelector('#search').value;
    const searchUpperCase = (search.charAt(0).toUpperCase() +search.slice(1))

    resp.results.forEach(days => {
        const date = getDateString(days.month, days.day);
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
                <h2 class="text-center mb-3">${date}</h2>
                ${searchFoundHTML}
                <p class="text-center mb-4 other-names">${nameString}</p>
            </div>
        `;  
    });
};

// Displays the response of a date search 
const displayByDate = resp => {
    const date = getDateString(resp.data[0].dates.month, resp.data[0].dates.day);
    const country = document.querySelector('#country').value;
    const names = resp.data[0].namedays[country];
    
    document.querySelector("#result").innerHTML += `
        <div class="jumbotron bg-primary">
            <h2 class="text-center mb-3">${date}</h2>
            <p class="text-center">${names}</p>
        </div>
    `;
};

// Displays the response of a proximity day search 
const displayProximityDate = resp => {
    console.log(resp);
    document.querySelector("#result").innerHTML = "";
    const date = getDateString(resp.data[0].dates.month, resp.data[0].dates.day);
    const country = document.querySelector('#proximity-date-country').value;
    const names = resp.data[0].namedays[country];
    const proximityDate = document.querySelector('#proximity-date').value;
    const proximityDateUpperCase = (proximityDate.charAt(0).toUpperCase() +proximityDate.slice(1))
    
    document.querySelector("#result").innerHTML += `
        <div class="jumbotron bg-primary">
            <h2 class="text-center mb-3">${proximityDateUpperCase} ${date}</h2>
            <h3 class="text-center mb-2"></h3>
            <p class="text-center">${names}</p>
        </div>
    `;
};

// Checks if the search was for a name or a date
const display = resp => {
    console.log(resp);
    document.querySelector("#result").innerHTML = "";
    switch(document.querySelector('#category').value) {
        case 'name':
            displayByName(resp);
            return;
        case 'date':
            displayByDate(resp);
            return;
        default:
    }
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
    
    console.log(e);
    console.log(setUrlSearch());

    if(setUrlSearch()){
        getNameday(setUrlSearch())
            .then(display)
            .catch(err =>{
                console.error("An error occured", err);
            });
    }
});

// Display search for proximity days if something was found
document.querySelector('#proximity-date-finder').addEventListener('submit', function(e) {
    e.preventDefault();
    
    console.log(e);
    console.log(setUrlProximityDate());

    if(setUrlProximityDate()){
        getNameday(setUrlProximityDate())
            .then(displayProximityDate)
            .catch(err =>{
                console.error("An error occured", err);
            });
    }
});

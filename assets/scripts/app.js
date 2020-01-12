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

const setUrlSearch = () => {
    const search = document.querySelector('#search').value;
    const country = document.querySelector('#country').value;
    const timezone = document.querySelector('#time-zone').value;
    
    //return if no value and if name is less than 3 characters long, api need 3 or more chars 
    if(!search || search.lenght < 3) return;

    switch(document.querySelector('#category').value) {
        case 'name':
            return `https://api.abalin.net/getdate?name=${search}&country=${country}`;
        case 'date':
            const month = parseInt(search.slice(6, 7), 10);
            const day = parseInt(search.slice(8, 10), 10);
            return `https://api.abalin.net/namedays?country=${country}&month=${month}&day=${day}&timezone=${timezone}`;
        default:
    }
}

const setUrlProximityDate= () => {
    const country = document.querySelector('#proximity-date-country').value;
    const timezone = document.querySelector('#time-zone').value;
    const proximityDate = document.querySelector('#proximity-date').value;

    return `https://api.abalin.net/${proximityDate}?timezone=${timezone}&country=${country}`;
}

const getDateString = (month, day) => {
    month = ('0' + month).slice(-2);
    day = ('0' + day ).slice(-2);
    return new Date().getFullYear() + "-" + month + "-" + day;
}

const displayByName = resp => {
    const search = document.querySelector('#search').value;
    const searchUpperCase = (search.charAt(0).toUpperCase() +search.slice(1))

    resp.results.forEach(days => {

        const date = getDateString(days.month, days.day);
        const names = days.name.split(", ");
        let searchFoundHTML = "";

        names.forEach((name,i) => {
            if(name === search || name === searchUpperCase) {
                searchFoundHTML = `
                    <p class="text-center mb-1">${name}</p>
                `;
                names.splice(i, 1);
            }
        });
        let nameString = names.join(', ');

        document.querySelector("#result").innerHTML += `
            <div class="jumbotron bg-primary">
                <h2 class="text-center mb-3">${date}</h2>
                ${searchFoundHTML}
                <p class="text-center mb-4 other-names">${nameString}</p>
            </div>
        `;  
    });
};

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

// Event Listeners
document.querySelector("#main-header").addEventListener("click", function(e) {
    document.querySelector("#search").value = "";
    document.querySelector("#country").value = "us";
    document.querySelector("#category").value = "name";
    document.querySelector("#result").innerHTML = "";
    updateSearchBar();
});

document.querySelector('#category').addEventListener('change', function(e) {
    updateSearchBar();
    document.querySelector('#search').value = "";
});

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

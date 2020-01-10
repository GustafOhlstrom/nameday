// Update search bar depending on category selected
const updateSearchBar = () => {
    document.querySelector('#category').value == "name" ? 
        document.querySelector("#search").type = "name": 
        document.querySelector("#search").type = "date";
}
updateSearchBar();

document.querySelector('#category').addEventListener('change', function(e) {
    updateSearchBar();
    document.querySelector('#search').value = "";
});

const setUrl = () => {
    const search = document.querySelector('#search').value;
    const country = document.querySelector('#country').value;
    
    //return if no value and if name is less than 3 characters long, api need 3 or more chars 
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

const displayByName = resp => {
    const search = document.querySelector('#search').value;
    const searchUpperCase = (search.charAt(0).toUpperCase() +search.slice(1))

    resp.results.forEach(days => {

        const date = new Date().getFullYear() + "-" + days.month + "-" + days.day;
        const names = days.name.split(", ");
        let searchFoundHTML = "";

        names.forEach((name,i) => {
            if(name === search || name === searchUpperCase) {
                searchFoundHTML = `<p class="mb-1">${name}</p>`;
                names.splice(i, 1);
            }
        });
        let nameString = names.join(', ');

        document.querySelector("#result").innerHTML += `
            <p class="mb-1">${date}</p>
            ${searchFoundHTML}
            <p class="mb-4 other-names">${nameString}</p>
        `;  
    });
};

const display = resp => {
    console.log(resp);
    document.querySelector("#result").innerHTML = "";
    switch(document.querySelector('#category').value) {
        case 'name':
            displayByName(resp);
            return;
        case 'date':
            console.log(resp.data);
            return;
        default:
    }
};

document.querySelector('#finder').addEventListener('submit', function(e) {
    e.preventDefault();
    
    console.log(e);
    console.log(setUrl());

    if(setUrl()){
        getNameday(setUrl())
            .then(display)
            .catch(err =>{
                console.error("An error occured", err);
            });
    }
});
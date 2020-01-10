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
    if(!search && search.lenght < 3) return;

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

const display = resp => {
    switch(document.querySelector('#category').value) {
        case 'name':
            console.log(resp.results);
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
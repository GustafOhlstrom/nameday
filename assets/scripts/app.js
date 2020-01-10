// Update search bar depending on category selected
const updateSearchBar = () => {
    document.querySelector('#category').value == "name" ? 
        document.querySelector("#search").type = "name": 
        document.querySelector("#search").type = "date";
}
updateSearchBar();

document.querySelector('#finder').addEventListener('submit', function(e) {
    e.preventDefault();
    console.log(e);

    getNameday()
        .then(resp => {
            console.log(resp);
            console.log(resp.data[0].namedays);
        })
        .catch(err =>{
            console.error("An error occured", err);
        });
});
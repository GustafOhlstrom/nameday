

const updateSearchBar = () => {
    document.querySelector('#category').value == "name" ? 
        document.querySelector("#search").type = "name": 
        document.querySelector("#search").type = "date";
}
updateSearchBar();

document.querySelector('#category').addEventListener('change', function(e) {
    updateSearchBar();
});
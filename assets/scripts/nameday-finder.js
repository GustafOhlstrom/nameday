// Get data from api
const getNameday = async (url) => {
    const response = await fetch(url);
    return await response.json();
};


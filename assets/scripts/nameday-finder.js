const getNameday = async () => {
    const response = await fetch('https://api.abalin.net/namedays?month=7&day=15');
    return await response.json();
};


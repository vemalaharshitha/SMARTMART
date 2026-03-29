const axios = require("axios");

async function fetchSerp(query) {
    try {
        const API_KEY = "a0bce3b543f3d2644efe4607615996e56e7a9d922c9a67f60749df4971a31b22";

        const url = `https://serpapi.com/search.json?q=${query}&tbm=shop&api_key=${API_KEY}&gl=in`;

        const res = await axios.get(url);

        const items = res.data.shopping_results;

        if (!items) return [];

        let results = items.map(item => ({
            site: item.source || "Store",
            name: item.title,
            price: item.price ? item.price.replace(/[^\d]/g, "") : "",
            link: item.link,
            image: item.thumbnail
        }));

        return results.slice(0, 6);

    } catch (err) {
        console.log("SerpAPI Error:", err.message);
        return [];
    }
}

module.exports = fetchSerp;
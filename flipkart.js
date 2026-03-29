const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeFlipkart(query) {
    try {
        const url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;

        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept-Language": "en-US,en;q=0.9"
            }
        });

        const $ = cheerio.load(data);

        let products = [];

        // 🔥 Updated selector (works for most products)
        $("div._1AtVbE").each((i, el) => {

            const name = $(el).find("div.KzDlHZ").text().trim();
            const price = $(el).find("div.Nx9bqj").text().trim();
            const link = $(el).find("a.CGtC98").attr("href");

            if (name && price && link) {
                products.push({
                    site: "Flipkart",
                    name: name,
                    price: price.replace("₹", "").replace(/,/g, ""),
                    link: "https://www.flipkart.com" + link
                });
            }
        });

        return products.slice(0, 5); // top 5 products

    } catch (error) {
        console.log("Flipkart Scraping Error:", error.message);
        return [];
    }
}

module.exports = scrapeFlipkart;
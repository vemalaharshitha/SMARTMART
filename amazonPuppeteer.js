const puppeteer = require("puppeteer");

async function scrapeAmazon(query) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(`https://www.amazon.in/s?k=${query}`, {
            waitUntil: "domcontentloaded"
        });

        await page.waitForSelector("div.s-main-slot");

        const products = await page.evaluate(() => {
            let items = [];

            document.querySelectorAll("div.s-main-slot div[data-component-type='s-search-result']").forEach(el => {
                const name = el.querySelector("h2 span")?.innerText;
                const price = el.querySelector(".a-price-whole")?.innerText;
                const link = el.querySelector("h2 a")?.getAttribute("href");

                if (name && price && link) {
                    items.push({
                        site: "Amazon",
                        name,
                        price: price.replace(/,/g, ""),
                        link: "https://www.amazon.in" + link
                    });
                }
            });

            return items.slice(0, 5);
        });

        await browser.close();
        return products;

    } catch (error) {
        console.log("Amazon Error:", error.message);
        return [];
    }
}

module.exports = scrapeAmazon;
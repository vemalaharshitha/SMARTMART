const puppeteer = require("puppeteer");

async function scrapeFlipkart(query) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(`https://www.flipkart.com/search?q=${query}`, {
            waitUntil: "domcontentloaded"
        });

        // Close login popup
        try {
            await page.click("button._2KpZ6l._2doB4z");
        } catch (e) {}

        const products = await page.evaluate(() => {
            let items = [];

            document.querySelectorAll("div._1AtVbE").forEach(el => {

                const name =
                    el.querySelector("div._4rR01T")?.innerText ||  // electronics
                    el.querySelector("a.s1Q9rs")?.innerText ||    // general
                    el.querySelector("div.IRpwTa")?.innerText;    // clothing

                const price =
                    el.querySelector("div._30jeq3")?.innerText;

                const link =
                    el.querySelector("a._1fQZEK")?.getAttribute("href") ||
                    el.querySelector("a.s1Q9rs")?.getAttribute("href") ||
                    el.querySelector("a.IRpwTa")?.getAttribute("href");

                if (name && price && link) {
                    items.push({
                        site: "Flipkart",
                        name,
                        price: price.replace("₹", "").replace(/,/g, ""),
                        link: "https://www.flipkart.com" + link
                    });
                }
            });

            return items.slice(0, 5);
        });

        await browser.close();
        return products;

    } catch (err) {
        console.log("Error:", err.message);
        return [];
    }
}

module.exports = scrapeFlipkart;
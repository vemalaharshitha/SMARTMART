const puppeteer = require("puppeteer");

async function scrapeGoogle(query) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(`https://www.google.com/search?tbm=shop&q=${query}`, {
            waitUntil: "domcontentloaded"
        });

        const products = await page.evaluate(() => {
            let items = [];

            document.querySelectorAll(".sh-dgr__content").forEach(el => {
                const name = el.querySelector(".tAxDx")?.innerText;
                const price = el.querySelector(".a8Pemb")?.innerText;
                const link = el.querySelector("a")?.href;

                if (name && price && link) {
                    items.push({
                        site: "Google",
                        name,
                        price: price.replace("₹", "").replace(/,/g, ""),
                        link
                    });
                }
            });

            return items.slice(0, 5);
        });

        await browser.close();
        return products;

    } catch (err) {
        console.log(err.message);
        return [];
    }
}

module.exports = scrapeGoogle;
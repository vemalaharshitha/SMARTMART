const express = require("express");
const fetchSerp = require("./scraper/serpapi");

const app = express();

app.use(express.static("public"));

// SEARCH ROUTE
app.get("/search", async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.json({ error: "Enter product" });
    }

    console.log("Searching:", query);

    const data = await fetchSerp(query);

    // ✅ API SUCCESS
    if (data.length > 0) {
        const best = data.reduce((a, b) =>
            parseInt(a.price) < parseInt(b.price) ? a : b
        );

        return res.json({
            product: query,
            results: data,
            best: best
        });
    }

    // ⚠️ FALLBACK
    return res.json({
        product: query,
        results: [
            {
                site: "Amazon",
                name: `${query} search`,
                price: "-",
                link: `https://www.amazon.in/s?k=${query}`
            },
            {
                site: "Flipkart",
                name: `${query} search`,
                price: "-",
                link: `https://www.flipkart.com/search?q=${query}`
            }
        ],
        best: null
    });
});

app.listen(3000, () => {
    console.log("🚀 Server running http://localhost:3000");
});
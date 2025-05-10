const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
const { Parser } = require("json2csv");

puppeteer.use(StealthPlugin());

// Your Google search query
const searchQuery =
  'site:linkedin.com/in/ "Paid Media" intitle:"founder" "United Kingdom"';

// Number of result pages to scrape (10 results per page)
const maxPages = 10;

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // Set to true if you want headless mode
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Use a realistic User-Agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
  );

  const baseUrl =
    "https://www.google.com/search?q=" + encodeURIComponent(searchQuery);
  const results = [];

  for (let pageNum = 10; pageNum < maxPages + 10; pageNum++) {
    const url = `${baseUrl}&start=${pageNum * 10}`;
    console.log(`🔍 Scraping Google page ${pageNum + 1}: ${url}`);

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Wait for search result container
    try {
      await page.waitForSelector("div#search", { timeout: 60000 });
    } catch (err) {
      console.warn("⚠️ Search results not found. Skipping this page.");
      continue;
    }

    const data = await page.evaluate(() => {
      const items = [];
      const resultNodes = document.querySelectorAll("div#search .tF2Cxc");

      resultNodes.forEach((node) => {
        const linkTag = node.querySelector("a");
        const titleTag = node.querySelector("h3");
        const snippetTag = node.querySelector(".VwiC3b");

        if (linkTag && titleTag) {
          const url = linkTag.href;
          const title = titleTag.innerText;
          const snippet = snippetTag?.innerText || "";

          // Name is usually before the first dash
          const name = title.split(" - ")[0]?.trim() || "N/A";

          // Try to extract company from title or snippet (best-effort)
          const company =
            title.split(" - ")[2]?.trim() ||
            snippet?.split("\n")[0]?.trim() ||
            "N/A";

          items.push({ name, url, company });
        }
      });

      return items;
    });

    console.log(`✅ Found ${data.length} results on page ${pageNum + 1}`);
    results.push(...data);

    // Random delay between 2–4 sec before next page
    const delay = 2000 + Math.random() * 2000;
    console.log(`⏳ Waiting ${Math.round(delay)}ms before next page...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  await browser.close();

  // Save JSON
  fs.writeFileSync("google_profiles.json", JSON.stringify(results, null, 2));
  console.log("📝 Saved to google_profiles.json");

  // Save CSV
  const parser = new Parser();
  const csv = parser.parse(results);
  fs.writeFileSync("google_profiles.csv", csv);
  console.log("🗂️  Saved to google_profiles.csv");
})();

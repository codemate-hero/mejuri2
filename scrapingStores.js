const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://mejuri.com/world/en/stores/hub", {
    waitUntil: "networkidle",
  });

  await page.waitForTimeout(5000);

  const stores = await page.evaluate(() => {
    const cards = [...document.querySelectorAll("a")]
      .filter(a => a.innerText.trim().toUpperCase().includes("VIEW STORE INFO"));

    function deriveRegion(city, name, storeUrl) {
      if (!city && !storeUrl && !name) return "";
      const c = (city || "").toLowerCase();
      const u = (storeUrl || "").toLowerCase();

      // Quick checks by country/city keywords
      if (c.includes("london") || c.includes("england") || u.includes("uk") || c.includes("selfridges")) return "UK";
      if (c.includes("kuwait") || u.includes("kuwait")) return "MIDDLE EAST";
      if (c.includes("sydney") || c.includes("melbourne") || u.includes(".au")) return "AUSTRALIA";
      if (c.includes("toronto") || c.includes(", on") || c.includes("ontario") || u.includes(".ca")) return "CANADA";

      // Try to extract US state code from city like 'CITY, ST'
      const stateMatch = (city || "").match(/,\s*([A-Za-z]{2})$/);
      if (stateMatch) {
        const st = stateMatch[1].toUpperCase();
        const northeast = new Set(["ME","NH","VT","MA","RI","CT","NY","NJ","PA","MD","DE"]);
        const midwest = new Set(["IL","IN","IA","KS","MI","MN","MO","NE","ND","OH","SD","WI"]);
        const southeast = new Set(["FL","GA","SC","NC","TN","AL","MS","VA","WV","KY","DC"]);
        const southwest = new Set(["AZ","NM","OK","TX"]);
        const west = new Set(["CA","OR","WA","CO","NV","UT","ID"]);

        if (northeast.has(st)) return "US - NORTHEAST";
        if (midwest.has(st)) return "US - MIDWEST";
        if (southeast.has(st)) return "US - SOUTHEAST";
        if (southwest.has(st)) return "US - SOUTHWEST";
        if (west.has(st)) return "US - WEST";
      }

      // Fallback: empty so it can be reviewed/assigned later
      return "";
    }

    return cards.map(a => {
      const card =
        a.closest("article") ||
        a.closest("li") ||
        a.closest("div");

      let parent = card;
      for (let i = 0; i < 4; i++) {
        if (parent?.querySelector("img") && parent.innerText.includes("VIEW STORE INFO")) break;
        parent = parent?.parentElement;
      }

      const textLines = parent?.innerText
        ?.split("\n")
        .map(x => x.trim())
        .filter(Boolean) || [];

      const img = parent?.querySelector("img");

      const city = textLines[0] || "";
      const name = textLines[1] || "";
      const address = textLines[2] || "";
      const storeUrl = a.href;
      const image = img?.src || img?.getAttribute("src") || "";

      return {
        city,
        name,
        address,
        storeUrl,
        image,
        region: deriveRegion(city, name, storeUrl),
      };
    });
  });

  console.log(stores);

  fs.writeFileSync("mejuri-stores.json", JSON.stringify(stores, null, 2));

  console.log(`Done: ${stores.length} stores saved`);
  await browser.close();
})();
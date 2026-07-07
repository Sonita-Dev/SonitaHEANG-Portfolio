const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  try {
    const urls = [
      "http://localhost:8000/portfolio.html",
      "http://localhost:8000/index.html",
    ];

    fs.mkdirSync("screenshots", { recursive: true });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Desktop
    await page.setViewport({ width: 1280, height: 900 });
    for (const url of urls) {
      await page.goto(url, { waitUntil: "networkidle2" });
      const name = url.split("/").pop() || "index.html";
      const out = `screenshots/desktop-${name.replace(".html", "")}.png`;
      await page.screenshot({ path: out, fullPage: true });
      console.log("Saved", out);
    }

    // Mobile
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    for (const url of urls) {
      await page.goto(url, { waitUntil: "networkidle2" });
      const name = url.split("/").pop() || "index.html";
      const out = `screenshots/mobile-${name.replace(".html", "")}.png`;
      await page.screenshot({ path: out, fullPage: true });
      console.log("Saved", out);
    }

    await browser.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

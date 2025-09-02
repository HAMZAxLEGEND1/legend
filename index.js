const express = require("express");
const puppeteer = require("puppeteer-core"); // <-- puppeteer-core use karo
const chromium = require("chrome-aws-lambda"); // <-- chromium package use karo

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/lookup", async (req, res) => {
  const number = req.query.num; // ?num=9727612577
  if (!number) {
    return res.json({ status: "error", message: "Number required! use ?num=xxxx" });
  }

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(`https://numlooking.rf.gd/?num=${number}`, {
      waitUntil: "networkidle2",
    });

    const content = await page.evaluate(() => document.body.innerText);
    await browser.close();

    let data = JSON.parse(content);

    let dataStr = JSON.stringify(data);
    dataStr = dataStr.replace(/@GODCHEATOFFICIAL/g, "LegendxHamza");
    data = JSON.parse(dataStr);

    res.json(data);
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

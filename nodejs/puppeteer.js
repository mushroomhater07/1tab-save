const puppeteer = require("puppeteer");
const path = require("path");

const loadReport = async (req, res) => {};

const generateReport = async (req, res) => {
  try {
    // const browser = await puppeteer.connect({      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}`,    });
    const browser = await puppeteer.launch({      executablePath:        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",headless: false,      
      ignoreDefaultArgs: ["--disable-extensions"],
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(`${req.protocol}://${req.get("host")}/`, {
      waitUntil: "networkidle2",
    });
    
//   await page.screenshot({path: 'example.png'});
    const today = new Date();
    const pdfURL = `${path.join(
      __dirname,
      "../public"
    )}/report-${today.getTime()}.pdf`;
    await page.setViewport({ width: 1680, height: 1050 });
    const pdfn = page.pdf({
      path: pdfURL,
      format: "A4",
      printBackground: true,
    });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "content-length": pdfn.length,
    });
    res.sendFile(pdfURL);

    // res.download(pdfURL,(err)=>{err?console.log(err):""});
  } catch (error) {
    console.log(error);
    res.send("An error occurred");
  }
};

module.exports = {
  loadReport,
  generateReport,
};

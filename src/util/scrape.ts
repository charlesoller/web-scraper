import puppeteer from "puppeteer";
import { convertPriceToFloat } from "./helper";

export const tenTreeScrape = async(url: string) => {
    console.log("URL: ", url)

      // Launch the browser
    const browser = await puppeteer.launch();

    // Create a page
    const page = await browser.newPage();

    // Go to your site
    await page.goto(url);

    // Getting the product's name
    const titleSelector = await page.waitForSelector('#pdp-product-title')
    const productName = await titleSelector?.evaluate(el => el.textContent)
    await titleSelector!.dispose()

    // Getting product's description
    const descriptionSelector = await page.waitForSelector('#meet-the-product-container > p')
    const description = await descriptionSelector?.evaluate(el => el.textContent)
    console.log("DESCRIPTION: ", description)
    await descriptionSelector!.dispose()

    const priceSelector = await page.waitForSelector('#product_price')
    const priceAsString = await priceSelector?.evaluate(el => el.textContent)
    const price = convertPriceToFloat(priceAsString!)
    console.log("PRICE: ", price)
    priceSelector!.dispose()

    const images = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("img")
      ).map((image) => image.getAttribute("src"));
    })

    await browser.close();
    return {
      productName, description, price, images
    }
}

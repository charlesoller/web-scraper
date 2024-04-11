import puppeteer, { Page } from "puppeteer";
import { convertPriceToFloat, formatImgString } from "./helper";

// Scraper for product pages on https://www.tentree.com/
export const tenTreeScrape = async(url: string) => {
    const page = await setup(url)

    // Getting the product's name
    const titleSelector = await page.waitForSelector('#pdp-product-title')
    const productName = await titleSelector?.evaluate(el => el.textContent)
    await titleSelector!.dispose()

    // Getting product's description
    const descriptionSelector = await page.waitForSelector('#meet-the-product-container > p')
    const description = await descriptionSelector?.evaluate(el => el.textContent)
    // console.log("DESCRIPTION: ", description)
    await descriptionSelector!.dispose()

    const priceSelector = await page.waitForSelector('#product_price')
    const priceAsString = await priceSelector?.evaluate(el => el.textContent)
    const price = convertPriceToFloat(priceAsString!)
    // console.log("PRICE: ", price)
    priceSelector!.dispose()

    const images = await scrapeImages(page)

    await cleanup(page)
    return {
      productName, description, price, images
    }
}

export const generalScraper = async(url: string) => {
  const page = await setup(url)

  const headers = await scrapeHeaders(page)
  const images = await scrapeImages(page)
  const paragraphs = await scrapeParagraphs(page)

  await page.close()
  return { headers, images, paragraphs }
}

export const smartScrape = async(url: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Searches for the first element that is with an h1-h6 tag, and a class name that includes "product" OR "title"
  const productName = await scrapeProductName(page)
  // console.log("PRODUCT NAME: ", productName)

  // Searches for a h1-h6, div, span, or p tag with a class name that includes "price", or with textContent that includes "$"
  const price = await scrapePrice(page)
  // console.log("PRICE: ", price)

  // Searches for p tag with the longest length in the first half of the p tags
  const description = await scrapeDescription(page)
  // console.log("DESCRIPTION: ", description)

  // Searches for img tags with role set to "img", a jpg extension, or a class including product name
  const images = await scrapeProductPhotos(page)
  // console.log("IMAGES: ", images)

  return { productName, price, description, images}
}

//  ------------------------- HELPERS -------------------------

const setup = async(url: string) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)
  return page
}

const cleanup = async(page: Page) => {
  await page.browser().close()
}

const scrapeImages = async (page: Page) => {
  const images = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll("img")
    ).map((image) => image.getAttribute("src"));
  })
  return images
}

const scrapeHeaders = async (page: Page) => {
  const h1 = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll("h1")
    ).map((header) => header.innerText);
  })
  return h1
}

const scrapeParagraphs = async (page: Page) => {
  const p = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll("p")
    ).map((p) => p.innerText);
  })
  return p
}

const scrapeProductName = async(page: Page) => {
  const headers = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll("h1,h2,h3,h4,h5,h6")
    ).map(h => {
      if(h.className.includes('product') || h.className.includes('title') || h.id.includes('product')){
        return h.textContent
      }
    })
  }).then(elements => elements.filter(ele => ele !== null))
  // console.log(headers)
  return headers[0]
}

const scrapePrice = async(page: Page) => {
  const prices = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span")
    ).map(ele => {
      if(ele.textContent && ele.textContent.includes('$')){
        console.log(ele.textContent)
        return ele.textContent
      }
    })
  }).then(elements => elements.filter(ele => ele !== null && ele!.length < 10)) // This is to try to prevent headers from registering
  return convertPriceToFloat(prices[0]!)
}

const scrapeDescription = async(page: Page) => {
  let paragraphs = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll("p")
    ).map(p => p.textContent)
  }).then(elements => elements.filter(ele => ele !== null))
  paragraphs = paragraphs.slice(0, Math.floor(paragraphs.length / 2))
  // @ts-ignore
  const description = paragraphs.reduce((longest, current) => longest?.length > current?.length ? longest : current)
  return description;
}

const scrapeProductPhotos = async(page:Page) => {
  const images = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll("img")
    ).map(img => {
      if(img.getAttribute("src")?.includes("jpg") || img.getAttribute("role") === "img" || img.className.toLowerCase().includes("product")){
        return img.getAttribute("src")
      }
    })
  })

  return images.filter(img => img !== null).map(img => formatImgString(img!))
}

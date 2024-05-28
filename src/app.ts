// Import node modules
import path = require('path');
import puppeteer = require('puppeteer');
import readline = require('readline');
import fs = require('fs');
import dotenv = require('dotenv');

// Import custom modules
import { getLoggerLevel, setLoggerLevel } from './utils/common.util';

// Import variables from .env file in root folder
const ENV_FILE = path.join(__dirname, '../.env');
dotenv.config({ path: ENV_FILE });

// To set logger level global using ENV
setLoggerLevel();
// Logger initialise
const logger = getLoggerLevel();

navigatetoHomePage();

async function navigatetoHomePage() {
  logger.warn(`Inside navigatetoHomePage menthod`);

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1000 });

  //Step 1: Open Bookstore page
  await page.goto('https://test.yssofindia.org/bookstore', { waitUntil: 'networkidle0' }); // wait until page load
  logger.info(`Bookstore page is loaded`);

  //Step 2: Open My Account page
  await page.goto('https://test.yssofindia.org/my-account', { waitUntil: 'networkidle0' }); // wait until page load
  logger.info(`My Account page is loaded`);

  //Step 3: Open Login page
  await page.goto('https://test.yssofindia.org/wp-login.php?redirect_to=https://test.yssofindia.org/my-account', { waitUntil: 'networkidle0' }); // wait until page load
  logger.info(`Login page is loaded`);

  //Step 4: Enter email and password in email input box
  await page.type('#email', `${process.env.LOGIN_EMAIL}`);
  await page.type('#password', `${process.env.LOGIN_PASSWORD}`);

  await Promise.all([
    page.click('#btn-login'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]).then(async ()=>{
    logger.warn(`Back to My Account page after Login is successfull!`);

    //Step 5: Navigate back to Bookstore page after successful login
    await page.goto('https://test.yssofindia.org/bookstore', { waitUntil: 'networkidle0' }); // wait until page load
    logger.info(`LOGGED IN: Bookstore page is loaded`);

    //Step : Open AOY page in bookstore
    await page.goto('https://test.yssofindia.org/product/autobiography-of-a-yogi', { waitUntil: 'networkidle0' }); // wait until page load
    logger.info(`LOGGED IN: AOY is loaded`);

    //Step : Click on Add to Cart button
    await page.waitForSelector('.single_add_to_cart_button');
    logger.debug(`LOGGED IN: Add to Cart button is found`);
    await page.click('.single_add_to_cart_button');
    logger.info(`LOGGED IN: Add to Cart button is clicked`);

    //Step : Click on Proceed to Checkout button
    await page.waitForSelector('.checkout-button');
    logger.debug(`LOGGED IN: Proceed to Checkout button is found`);
    await page.click('.checkout-button');
    logger.info(`LOGGED IN: Proceed to Checkout button is clicked`);
  
    //Step : Enter all form details for guest user
    // await page.type('#billing_email', `${process.env.BILLING_EMAIL}`);
    // await page.type('#billing_phone', `${process.env.BILLING_PHONE}`);
    // await page.type('#billing_first_name', `${process.env.BILLING_FIRST_NAME}`);
    // await page.type('#billing_last_name', `${process.env.BILLING_LAST_NAME}`);
    // await page.type('#billing_address_1', `${process.env.BILLING_ADDR1}`);
    // await page.type('#billing_city', `${process.env.BILLING_CITY}`);
    // //Set Dropdown value on Form  
    // await page.select('#billing_state', `${process.env.BILLING_STATE}`)
    // await page.type('#billing_postcode', `${process.env.BILLING_POSTCODE}`);

    //Step : Click on Pay Now button
    await page.waitForSelector('#place_order');
    logger.debug(`LOGGED IN: Pay Now button is found`);
    await page.$eval('#place_order', (element) => { 
      if (element instanceof HTMLElement) {
        element.click();
      }
    });
    logger.info(`LOGGED IN: Pay Now button is clicked`);

    // });

  }).finally(async ()=>{
    //Step 6: Close the browser 
    // logger.warn(`Closing browser :)`);
    // await browser.close();
  });
}

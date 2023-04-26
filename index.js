const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// URL to scrape
const url = 'https://www.yellowpages.com/los-angeles-ca/restaurants';

// Send a GET request to the URL
request(url, (error, response, html) => {
  if (!error && response.statusCode == 200) {
    // Load the HTML into cheerio
    const $ = cheerio.load(html);
    
    // Array to store scraped data
    const data = [];

    // Iterate through each ".result" class
    $('.result').each((index, element) => {
      const result = $(element);
      const href = result.find('.track-visit-website').attr('href');
      const phone = result.find('.phones.phone.primary').text();
      const streetAddress = result.find('.street-address').text();
      const businessName = result.find('.business-name span').text();
      const locality = result.find('.locality').text();
      // Push the scraped data to the data array
      data.push({
        a: href,
        aa: phone,
        aaa: streetAddress,
        aaaa: businessName,
        aaaaa: locality
      });
    });

    // Create CSV writer
    const csvWriter = createCsvWriter({
      path: 'scraped_data.csv',
      header: [
        {id: 'a', title: 'Href'},
        {id: 'aa', title: 'Phone'},
        {id: 'aaa', title: 'Street Address'},
        {id: 'aaaa', title: 'Business Name'},
        {id: 'aaaaa', title: 'Locality'}
      ]
    });

    // Write data to CSV file
    csvWriter.writeRecords(data)
      .then(() => {
        console.log('Scraping completed successfully. Data written to scraped_data.csv file.');
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    console.error('Failed to retrieve data. Error:', error);
  }
});

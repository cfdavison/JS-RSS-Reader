//Vanilla JS RSS Feed Reader
  
// CONSTANTS
const FEED_URL = "https://news.uwgb.edu/tag/art-and-design/feed/";
const MONTH_ABR = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jun", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MAX_ITEMS = 5;
const TARGET_ID = "js-rss-feed-content"

// FLAGS
const hasItemLimit = true;
const showDescription = true;
const showPubDate = true;

//Get the feed
fetch(FEED_URL)
    //Parse the response as text
    .then(response => response.text())
    //Parse that text as a DOM document
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    //Convert the XML into HTML
    .then(data => {
        // get list of items in feed doc
        const items = data.querySelectorAll("item");

        let maxItems = (MAX_ITEMS > items.length || !hasItemLimit) ? items.length : MAX_ITEMS;

        // create string to hold HTML and feed data
        let rssContent = ``;

        // iterate through items in the RSS feed, up to the max
        for (i = 0; i < maxItems; i++) {
            let item, title, link, description, pubDate, pubDateString;
            item = items[i];
            title = item.querySelector("title").innerHTML;
            link = item.querySelector("link").innerHTML;
            if(showDescription) { description = item.querySelector("description").innerHTML; }
            if(showPubDate) 
            {
                //Date.parse gets a unix timestamp
                pubDate = new Date (Date.parse(item.querySelector("pubDate").innerHTML));
                pubDateString = MONTH_ABR[pubDate.getMonth()] + " " + pubDate.getDate() + ", " + pubDate.getFullYear();
            }

            //Format output html
            rssContent += `
            <div class='rss-item'>
            <div class='item-title'><a href='${ link }'>${ title }</a></div>
            <div class='item-description'>${ description }</div>\n`;

            if(showDescription) { rssContent += `<div class='item-description'>${ description }</div>\n`; }
            if(showPubDate) { rssContent += `<div class='item-date'>${ pubDateString }</div>\n`; }
        }

        document.getElementById(TARGET_ID).innerHTML = rssContent;
    })
    .catch(error => {
        document.getElementById(TARGET_ID).innerHTML = "RSS feed failed to load";
        console.log(error);
    })

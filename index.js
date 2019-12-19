require('console-super');
const puppeteer = require('puppeteer');
const brain = require('brain.js')
const fs = require('fs')

let allResults = fs.readFileSync("./results.csv","utf8");

allResults = allResults.split("\r\n");

doTheMagic(allResults)

// console.log(allResults)

// main();

// function main() {
//     console.timeTag(" - Crawling - ");

//     let stockPromise = async () => {
//         const browser = await puppeteer.launch({
//             headless: true
//         });
//         const page = await browser.newPage();

//         try {
//             await page.goto('https://campograndesantos.wordpress.com/64-concurso-da-mega-senatodos-os-resultados/');
//             await page.waitFor(1000);

//             // Scrape
//             const result = await page.evaluate(() => {
//                 let data = [];
//                 let aux = [];
//                 let nOfGames = document.querySelector('#post-10245 > div').children.length - 4;

//                 for (let i = 1; i < nOfGames; i++) {
//                     let querySelector = "#post-10245 > div > p:nth-child(" + i.toString() + ")";
//                     aux[i] = document.querySelector(querySelector).textContent;
//                     aux[i] = aux[i].split("\n");
//                     aux[i].forEach(function (el, index) {
//                         data.push(el.split(" "));
//                     });
//                 }

//                 nOfGames = data.length;

//                 for (let i = 1; i < nOfGames; i++) {
//                     data[i].shift();
//                     data[i][0] = data[i][0].replace("(", "");
//                     data[i][0] = data[i][0].replace(")", "");
//                     data[i][0] = data[i][0].replace("/", " ");
//                     data[i][0] = data[i][0].replace("/", " ");
//                     data[i][0] = data[i][0].split(" ");

//                     data[i][0] = [data[i][0][1], data[i][0][0], data[i][0][2]].join(" ");

//                     data[i][0] = (new Date()).getDay();

//                     while(data[i] > 7){
//                         data[i].pop();
//                     }

//                     // data[i] = data[i].map(function (num) {
//                     //     return parseInt(num)
//                     // });
//                 }

//                 return data;
//             });

//             browser.close();
//             return result;

//         } catch (e) {
//             browser.close();
//             console.timeTag("Error:" + e);
//         }

//     };

//     stockPromise().then(value => {
//         // value = value.split("\n").split(" ").slice(1,3);

//         console.timeTag(value.length);
//         // console.timeTag(value);
        
//         console.timeTag(" - Processing - ");
//         // doTheMagic(value);
//     });
// }

function doTheMagic(data) {
    const lstm = new brain.recurrent.LSTM();
    const result = lstm.train(data, {
        iterations: 3500,
        log: details => console.timeTag(details),
        errorThresh: 0.001
    });

    const run1 = lstm.run("2221");

    console.log(run1)
}
let process = require("process");
require('console-super');
const brain = require('brain.js');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

let predict = {
    gameNumber: 2217 / 10000,
    // day: 17 / 31,
    // month: 12 / 12,
    // year: 2019 / 2120,
    dayOfWeek: 3 / 7,
    // prize: 3e6 / 1e9,
    // flipGame: 0
}

let allResults = {
    game: [],
    data: []
};
let correctSequence = [10, 14, 16, 30, 32, 36];
let bestMatch = {
    game: "",
    quantity: 0,
    dozens: []
};

const directoryPath = path.join(__dirname, 'results');
fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    files.forEach(function (file) {
        allResults.game.push(file);
        allResults.data.push(fs.readFileSync(directoryPath + "\\" + file, "utf8"));
    });
    
    let allFormatedData = formatData(allResults.data);
    // console.timeTag(allFormatedData[4][20]);
    
    allFormatedData.forEach(function(el, index){
        // let ltsmResult = ltsm(el);
        // console.timeTag(ltsmResult);
        // let neuralResult = neural(el);
        // console.timeTag(neuralResult);
        // let neuralResult = lstmTimeStep(allResults.data[index]);
        // console.timeTag(neuralResult);
        let neuralResult = predictNumbers(allResults.data[index]);
        console.timeTag(neuralResult);

        // let intersection = correctSequence.filter(x => neuralResult.includes(x));
        // console.timeTag(intersection);

        // if(intersection.length > bestMatch.quantity) {
        //     bestMatch.quantity = intersection.length;
        //     bestMatch.dozens = neuralResult;
        //     bestMatch.game = allResults.game[index];
        // }

    })

    console.timeTag(" - " + bestMatch.quantity.toString() + " MATCHES USING " + bestMatch.game + " -> " + bestMatch.dozens.toString(), {mod1: 'cyan'});

});


// console.timeTag(" - Predict for " + (predict.gameNumber*10000).toString());
// console.log(" ");

// doTheMagic("2019a2013");
// doTheMagic("2019");
// doTheMagic("2018");
// doTheMagic("2017");
// doTheMagic("2016");
// doTheMagic("2015");
// doTheMagic("2014");
// doTheMagic("2013");
// doTheMagic("2012");
// doTheMagic("2011");
// doTheMagic("2010");
// doTheMagic("2009");
// doTheMagic("2008");
// doTheMagic("2007");
// doTheMagic("2006");
// doTheMagic("2005");
// doTheMagic("2004");
// doTheMagic("2003");
// doTheMagic("2002");
// doTheMagic("2001");
// doTheMagic("2000");
// doTheMagic("1999");
// doTheMagic("1998");
// doTheMagic("1997");
// doTheMagic("1996");
// doTheMagic("virada");
// doTheMagic("todos");

function formatData(dataToFormat) {

    let auxDataToFormat = dataToFormat.map(function (el) {return el});

    let formatedData = [];

    for (let i = 0; i < auxDataToFormat.length; i++) {

        auxDataToFormat[i] = auxDataToFormat[i].split("\r\n");

        auxDataToFormat[i] = auxDataToFormat[i].map(function (game) {
            return game.split(";");
        });

        formatedData.push([])
        auxDataToFormat[i].forEach(function (el, index) {

            el.pop();

            formatedData[i].push({
                input: {
                    gameNumber: 0,
                    day: 0,
                    month: 0,
                    year: 0,
                    dayOfWeek: 0,
                    numberOfWinners: 0,
                    prize: 0,
                    flipGame: 0
                },
                output: {
                    dozen0: 0,
                    dozen1: 0,
                    dozen2: 0,
                    dozen3: 0,
                    dozen4: 0,
                    dozen5: 0
                }
            });


            formatedData[i][index].input.gameNumber = parseInt(el[0]) / 10000;
            formatedData[i][index].input.day = parseInt(el[1]) / 31;
            formatedData[i][index].input.month = parseInt(el[2]) / 12;
            formatedData[i][index].input.year = parseInt(el[3]) / 2120;
            formatedData[i][index].input.dayOfWeek = parseInt(el[4]) / 7;
            formatedData[i][index].output.dozen0 = parseInt(el[5]) / 60;
            
            formatedData[i][index].output.dozen1 = parseInt(el[6]) / 60;
            
            formatedData[i][index].output.dozen2 = parseInt(el[7]) / 60;
            
            formatedData[i][index].output.dozen3 = parseInt(el[8]) / 60;
            
            formatedData[i][index].output.dozen4 = parseInt(el[9]) / 60;
            
            formatedData[i][index].output.dozen5 = parseInt(el[10]) / 60;
            
            formatedData[i][index].input.numberOfWinners = parseInt(el[11]) / 100;

            if (el.length > 12) {
                formatedData[i][index].input.prize = parseFloat(el[12]) / 1e9;
                if (el.length == 14) {
                    formatedData[i][index].input.flipGame = parseInt(el[13]);
                } else {
                    formatedData[i][index].input.flipGame = 0;
                }
            } else {
                formatedData[i][index].input.prize = 0;
            }
        })
    }

    return formatedData;
}

// function doTheMagic(period) {

//     allResults = allResults.split("\r\n");

//     // lstm(allResults, period);

//     allResults = allResults.map(function (game) {
//         return game.split(";");
//     });

//     let formatedData = [];

//     allResults.forEach(function (el, index) {

//         el.pop();

//         formatedData.push({
//             input: {
//                 gameNumber: 0,
//                 day: 0,
//                 month: 0,
//                 year: 0,
//                 dayOfWeek: 0,
//                 numberOfWinners: 0,
//                 prize: 0,
//                 flipGame: 0
//             },
//             output: {
//                 dozen0: 0,
//                 dozen1: 0,
//                 dozen2: 0,
//                 dozen3: 0,
//                 dozen4: 0,
//                 dozen5: 0
//             }
//         });

//         formatedData[index].input.gameNumber = parseInt(el[0]) / 10000;
//         formatedData[index].input.day = parseInt(el[1]) / 31;
//         formatedData[index].input.month = parseInt(el[2]) / 12;
//         formatedData[index].input.year = parseInt(el[3]) / 2120;
//         formatedData[index].input.dayOfWeek = parseInt(el[4]) / 7;
//         formatedData[index].output.dozen0 = parseInt(el[5]) / 60;
//         formatedData[index].output.dozen1 = parseInt(el[6]) / 60;
//         formatedData[index].output.dozen2 = parseInt(el[7]) / 60;
//         formatedData[index].output.dozen3 = parseInt(el[8]) / 60;
//         formatedData[index].output.dozen4 = parseInt(el[9]) / 60;
//         formatedData[index].output.dozen5 = parseInt(el[10]) / 60;
//         formatedData[index].input.numberOfWinners = parseInt(el[11]) / 100;

//         if (el.length > 12) {
//             formatedData[index].input.prize = parseFloat(el[12]) / 1e9;
//             if (el.length == 14) {
//                 formatedData[index].input.flipGame = parseInt(el[13]);
//             } else {
//                 formatedData[index].input.flipGame = 0;
//             }
//         } else {
//             formatedData[index].input.prize = 0;
//         }
//     })

// }

// function lstm(data, period) {
//     const lstm = new brain.recurrent.LSTM();
//     const result = lstm.train(data, {
//         iterations: 400,
//         log: details => console.inlineTimeTag(details),
//         errorThresh: 0.0001
//     });

//     let output = lstm.run((predict.gameNumber*10000).toString() + (predict.day*31).toString() + (predict.month*12).toString() + (predict.year*2120).toString() + (predict.dayOfWeek*7).toString());

//     console.timeTag(" [LSTM] - Dozens based on " + period + ":", {mod1: 'cyan'});

//     output = output.split(" ").slice(5, 11).join(" ");

//     console.timeTag(output);
//     console.log(" ");
// }

function predictNumbers(data) {
    data = data.split("\r\n");

    data = data.map(function(el) {
        el = el.split(";");
        while(el.length > 11){
            el.pop();
        }
        // el.shift();
        // el.shift();
        // el.shift();
        // el.shift();
        // el.shift();
        return el.map(function(data){return parseInt(data)});
    })

    // console.log(data);

    const net = new brain.recurrent.LSTMTimeStep({
        inputSize: 11,
        // hiddenLayers: [10],
        outputSize: 11
      });
      
      net.train(data, { iterations: 400,log: false, errorThresh: 0.01 });
      
    //   const output = net.run([[2217,17,12,2019,3,10,14,16,30,32,36],[2216,14,12,2019,7,10,24,42,43,48,49],[2215,11,12,2019,4,1,19,21,23,33,43],[2214,07,12,2019,7,4,10,18,30,34,47]]);
    //   const output = net.run(([[10,14,16,30,32,36],[10,24,42,43,48,49],[1,19,21,23,33,43],[4,10,18,30,34,47]]));
    //   console.log(output);

        let output = net.forecast([[2217,17,12,2019,3,10,14,16,30,32,36],[2216,14,12,2019,7,10,24,42,43,48,49],[2215,11,12,2019,4,1,19,21,23,33,43],[2214,07,12,2019,7,4,10,18,30,34,47]] ,1)
      console.timeTag(output);
      return output.map(function(num){return Math.round(num)});

      assert(Math.round(closeToFiveAndOne[0]) === 5, `${ closeToFiveAndOne[0] } does not round to 5`);
      assert(Math.round(closeToFiveAndOne[1]) === 1, `${ closeToFiveAndOne[1] } does not round to 1`);
      console.log(closeToFiveAndOne);
      
      // now we're cookin' with gas!
      const forecast = net.forecast([[1,5],[2,4]], 3);
      assert(Math.round(forecast[2][0]) === 5, `${ forecast[2][0] } does not round to 5`);
      assert(Math.round(forecast[2][1]) === 1, `${ forecast[2][1] } does not round to 1`);
      console.log('next 3 predictions', forecast);
}

function lstmTimeStep(data) {
    data = data.split("\r\n");

    data = data.map(function(el) {
        el = el.split(";");
        while(el.length > 11){
            el.pop();
        }
        return el.map(function(data){return parseInt(data)/60});
    })

    // console.timeTag(data);

    // data = [[1, 3], [2, 2], [3, 1]];

    const ltsm = new brain.recurrent.LSTMTimeStep({
        inputSize: 11,
        hiddenLayers: [10],
        outputSize: 11,
    });
    const result = ltsm.train(data, {
        iterations: 1000,
        // log: details => console.inlineTimeTag(details),
        errorThresh: 0.001
    });

    let output = ltsm.run([[2216,14,12,2019,7,10,24,42,43,48,49], [2215,11,12,2019,4,1,19,21,23,33,43], [2214,07,12,2019,7,4,10,18,30,34,47]]);

    return [Math.round(output["5"] * 60),Math.round(output["6"] * 60),Math.round(output["7"] * 60),Math.round(output["8"] * 60),Math.round(output["9"] * 60),Math.round(output["10"] * 60)];
    
    // let output = ltsm.run([2217, 17, 12, 2019, 3,0,0,0,0,0,0]);
    // let output = ltsm.run([[1, 3], [2, 2], [2,2]]);
    // var output = net.run(predict);

    return output;
}

function rnn(data) {
    const config = {
        inputSize: 20,
        inputRange: 20,
        hiddenLayers: [20, 20],
        outputSize: 20,
        learningRate: 0.01,
        decayRate: 0.999,
    }
    
    // create a simple recurrent neural network
    const net = new brain.recurrent.RNN(config)
    
    net.train(data);
    
    var output = net.run(predict);

    output.dozen0 = Math.round(output.dozen0 * 60);
    output.dozen1 = Math.round(output.dozen1 * 60);
    output.dozen2 = Math.round(output.dozen2 * 60);
    output.dozen3 = Math.round(output.dozen3 * 60);
    output.dozen4 = Math.round(output.dozen4 * 60);
    output.dozen5 = Math.round(output.dozen5 * 60);

    return [output.dozen0, output.dozen1, output.dozen2, output.dozen3, output.dozen4, output.dozen5];
}

function ltsm(data) {

    const ltsm = new brain.recurrent.LSTM();
    const result = ltsm.train(data, {
        iterations: 400,
        // log: details => console.inlineTimeTag(details),
        errorThresh: 0.001
    });

    let output = ltsm.run((predict.gameNumber * 10000).toString() + ";" + (predict.day * 31).toString() + ";" + (predict.month * 12).toString() + ";" + (predict.year * 2120).toString() + ";" + (predict.dayOfWeek * 7).toString());
    // var output = net.run(predict);

    return output;

    output.dozen0 = Math.round(output.dozen0 * 60);
    output.dozen1 = Math.round(output.dozen1 * 60);
    output.dozen2 = Math.round(output.dozen2 * 60);
    output.dozen3 = Math.round(output.dozen3 * 60);
    output.dozen4 = Math.round(output.dozen4 * 60);
    output.dozen5 = Math.round(output.dozen5 * 60);

    return [output.dozen0, output.dozen1, output.dozen2, output.dozen3, output.dozen4, output.dozen5];

    Object.keys(output).forEach(function (el, index) {
        process.stdout.write(output[el].toString() + ' ');
        // console.timeTag(output[el]);
    })
    process.stdout.write("\n\n");
}

function neural(data) {
    var net = new brain.NeuralNetwork();

    net.train(data, {
        iterations: 20000,
        activation: 'relu',
        // log: details => console.inlineTimeTag(details),
        errorThresh: 0.001,
        learningRate: 0.01
    });

    var output = net.run(predict);

    output.dozen0 = Math.round(output.dozen0 * 60);
    output.dozen1 = Math.round(output.dozen1 * 60);
    output.dozen2 = Math.round(output.dozen2 * 60);
    output.dozen3 = Math.round(output.dozen3 * 60);
    output.dozen4 = Math.round(output.dozen4 * 60);
    output.dozen5 = Math.round(output.dozen5 * 60);

    return [output.dozen0, output.dozen1, output.dozen2, output.dozen3, output.dozen4, output.dozen5];

    Object.keys(output).forEach(function (el, index) {
        process.stdout.write(output[el].toString() + ' ');
        // console.timeTag(output[el]);
    })
}
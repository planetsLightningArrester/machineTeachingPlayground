let process= require("process");
require('console-super');
const brain = require('brain.js')
const fs = require('fs');

let predict = {
    gameNumber: 2217/10000,
    // day: 17/31,
    // month: 12/12,
    // year: 2019/2120,
    // dayOfWeek: 3/7,
    // prize: 3e6/1e9,
    // flipGame: 0
}

console.timeTag(" - Predicao para o jogo " + (predict.gameNumber*10000).toString());
console.log(" ");

doTheMagic("2019a2013");
doTheMagic("2019");
doTheMagic("2018");
doTheMagic("2017");
doTheMagic("2016");
doTheMagic("2015");
doTheMagic("2014");
doTheMagic("2013");
doTheMagic("2012");
doTheMagic("2011");
doTheMagic("2010");
doTheMagic("2009");
doTheMagic("2008");
doTheMagic("2007");
doTheMagic("2006");
doTheMagic("2005");
doTheMagic("2004");
doTheMagic("2003");
doTheMagic("2002");
doTheMagic("2001");
doTheMagic("2000");
doTheMagic("1999");
doTheMagic("1998");
doTheMagic("1997");
doTheMagic("1996");
doTheMagic("virada");
doTheMagic("todos");

function doTheMagic(period) {
    let allResults = fs.readFileSync("./results/" + period + ".csv", "utf8");

    allResults = allResults.split("\r\n");

    lstm(allResults, period);

    allResults = allResults.map(function(game){
        return game.split(";");
    });

    let formatedData = [];

    allResults.forEach(function(el, index) {

        el.pop();
        
        formatedData.push({
            input:{
                gameNumber: 0,
                day: 0,
                month: 0,
                year: 0,
                dayOfWeek: 0,
                numberOfWinners: 0,
                prize: 0,
                flipGame: 0
            },
            output:{
                dozen0: 0,
                dozen1: 0,
                dozen2: 0,
                dozen3: 0,
                dozen4: 0,
                dozen5: 0
            }
        });

        formatedData[index].input.gameNumber = parseInt(el[0])/10000;
        formatedData[index].input.day = parseInt(el[1])/31;
        formatedData[index].input.month = parseInt(el[2])/12;
        formatedData[index].input.year = parseInt(el[3])/2120;
        formatedData[index].input.dayOfWeek = parseInt(el[4])/7;
        formatedData[index].output.dozen0 = parseInt(el[5])/60;
        formatedData[index].output.dozen1 = parseInt(el[6])/60;
        formatedData[index].output.dozen2 = parseInt(el[7])/60;
        formatedData[index].output.dozen3 = parseInt(el[8])/60;
        formatedData[index].output.dozen4 = parseInt(el[9])/60;
        formatedData[index].output.dozen5 = parseInt(el[10])/60;
        formatedData[index].input.numberOfWinners = parseInt(el[11])/100;
        
        if(el.length > 12) {
            formatedData[index].input.prize = parseFloat(el[12])/1e9;
            if(el.length == 14) {
                formatedData[index].input.flipGame = parseInt(el[13]);
            } else {
                formatedData[index].input.flipGame = 0;
            }
        } else {
            formatedData[index].input.prize = 0;
        }
    })

    neural(formatedData, period)

}

function lstm(data, period) {
    const lstm = new brain.recurrent.LSTM();
    const result = lstm.train(data, {
        iterations: 400,
        log: details => console.inlineTimeTag(details),
        errorThresh: 0.0001
    });
    
    let output = lstm.run((predict.gameNumber*10000).toString() + (predict.day*31).toString() + (predict.month*12).toString() + (predict.year*2120).toString() + (predict.dayOfWeek*7).toString());

    console.timeTag(" [LSTM] - Dezenas para " + period + ":");

    output = output.split(" ").slice(5, 11).join(" ");

    console.timeTag(output);
    console.log(" ");
}

function neural(data, period){
    var net = new brain.NeuralNetwork();
    
    net.train(data, {
        iterations: 15000,
        log: details => console.inlineTimeTag(details),
        errorThresh: 0.000001
    });
    
    var output = net.run(predict);
    
    output.dozen0 = Math.round(output.dozen0*60);
    output.dozen1 = Math.round(output.dozen1*60);
    output.dozen2 = Math.round(output.dozen2*60);
    output.dozen3 = Math.round(output.dozen3*60);
    output.dozen4 = Math.round(output.dozen4*60);
    output.dozen5 = Math.round(output.dozen5*60);
    
    console.timeTag(" [NEURAL] - Dezenas para rede formada com base em " + period + ":");

    Object.keys(output).forEach(function(el, index){
        process.stdout.write(output[el].toString() + ' ');
        // console.timeTag(output[el]);
    })
    process.stdout.write("\n\n");
}
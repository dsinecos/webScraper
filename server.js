var express = require('express');
var fs = require('fs');
var request = require('request');
var requestP = require('request-promise');
var cheerio = require('cheerio');
var app = express();

var urlArray = [];
var finalUrlArray = [];

function insertUrlIntoArray(str) {
    urlArray.push("http://books.goalkicker.com/" + str);
    var newStr = str.replace(/Book/i, 'NotesForProfessionals.pdf')
    finalUrlArray.push("http://books.goalkicker.com/" + str + "/" + newStr);
}

app.get('/scrape', function (req, res) {
    res.send("Request received");

    var url = "http://books.goalkicker.com/";

    console.log("Inside scrape");

    request(url, function (error, response, html) {

        console.log("Inside request");

        if (!error) {
            var $ = cheerio.load(html);

            $('a').each(function (element) {
                // console.log($(this).attr().href);
                var href = $(this).attr().href;
                // console.log("-----------------------------------")
                insertUrlIntoArray(href);
            })

            console.log(finalUrlArray);
            processUrlArray();

        } else {
            console.log(error);
        }
    })
});

function processUrlArray() {
    requestP(urlArray[0])
        .then(function (html) {
            // console.log(html);

            var $ = cheerio.load(html);

            // console.log($('#footer').has("button"));
            console.log($("button[onclick*='location.href=']").attr('onclick'));
        })
        .catch(function (err) {
            console.log("Crawling failed");
            console.log(err);
        })

    requestP(urlArray[1])
        .then(function (html) {
            // console.log(html);

            var $ = cheerio.load(html);

            // console.log($('#footer').has("button"));
            console.log($("button[onclick*='location.href=']").attr('onclick'));
        })
        .catch(function (err) {
            console.log("Crawling failed");
            console.log(err);
        })
}

app.listen(8081, '0.0.0.0');
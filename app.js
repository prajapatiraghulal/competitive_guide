const express = require('express');
const config = require("./config.js");
const ejs = require('ejs');
const jsonFile = require('jsonfile');
const axios = require('axios');

var fs = require('fs');

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const query_strings = [
    "How to implement the Bubble Sort algorithm",
    "How to implement the Insertion Sort Algorithm",
    "How to implement Merge Sort Algorithm",
    "How to implement the Bucket Sort Algorithm",
    "How to reverse a linked list",
    "How to find duplicate numbers in an array if it contains multiple duplicates",

];


/*
const func = async(query, req, res) => {
    var obj;

    fs.readFile('loop.json', 'utf8', async(err, data) => {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);

            await axios.get(`https://www.googleapis.com/youtube/v3/search?part=id&q=${query}&type=video&&key=${config.my_key}`)
                .then(async(response) => {

                    for (var item of response.data.items) {
                        var v_id = item.id.videoId;


                        await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${v_id}&key=${config.my_key}`)
                            .then((new_res) => {
                                var y = new_res.data.items[0];
                                console.log(y);
                                obj.table.push({ dat: y, priority: y.statistics.likeCount / y.statistics.dislikeCount });
                                console.log(obj.table);

                            }).catch((er) => {
                                console.log("innter axios error: " + er);
                            });
                    }
                })
                .catch((error) => {
                    console.log("error: " + error);
                });


            //console.log(obj);
            let json = JSON.stringify(obj);
            fs.writeFile('loop.json', json, 'utf8', (error) => {
                if (error) {
                    console.log(error);
                }
            });
        }
    })




};

*/
app.get("/", async(req, res) => {


    //await func(search_list.join("+"), req, res);

    fs.readFile('video_data.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var temp = JSON.parse(data);



            res.render("index.ejs", { data: temp, vocab: query_strings });

        }
    });









});

app.listen(3000, () => {
    console.log("listening");

});
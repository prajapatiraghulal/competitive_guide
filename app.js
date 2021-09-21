const express = require('express');
const config = require("./config.js");
const ejs = require('ejs');
const jsonFile = require('jsonfile');
const axios = require('axios');

var fs = require('fs');

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const search_list = [

    "problem",
    "programming"

];

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


app.get("/", async(req, res) => {


    //await func(search_list.join("+"), req, res);
    var idd;
    var temp;
    fs.readFile('loop.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            temp = JSON.parse(data);
            var table = temp.table;
            var answer = 0;

            for (var element of table) {
                if (element.dat.statistics.viewCount >= 1000) {
                    if (element.priority > answer) {
                        answer = element.priority;
                        idd = element.dat.id;
                    }
                }
            }
            console.log(answer, idd);
            res.render("index.ejs", { id: idd });

        }
    });









});

app.listen(3000, () => {
    console.log("listening");

});
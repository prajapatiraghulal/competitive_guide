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


//////string query conversion
const queries = [];
const query_prepare = (strings) => {
    for (var str of strings) {
        queries.push(str.split(" "));
    }

}

query_prepare(query_strings);



//to get data from youtube 
const yt_data_extract = () => {
    var obj;

    fs.readFile('video_data.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);
            for (var query of queries) {
                var temp_query = query.join(".");
                axios.get(`https://www.googleapis.com/youtube/v3/search?part=id&q=${temp_query}&type=video&&key=${config.my_key}`)
                    .then((response) => {
                        var id_temp;
                        var ratio_max = 0;
                        for (var item of response.data.items) {
                            var v_id = item.id.videoId;

                            axios.get(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${v_id}&key=${config.my_key}`)
                                .then((new_res) => {
                                    var y = new_res.data.items[0].statistics;

                                    if (y.viewCount > 1000 && y.likeCount / y.dislikeCount > ratio_max) {
                                        ratio_max = y.likeCount / y.dislikeCount;
                                        id_temp = v_id;
                                        console.log(y, id_temp, ratio_max);
                                    }

                                }).catch((er) => {
                                    console.log("innter axios error: " + er);
                                });
                        }
                        obj.table.push({ id: id_temp, ratio: ratio_max });
                    })
                    .catch((error) => {
                        console.log("error: " + error);
                    });
            }

            let json = JSON.stringify(obj);
            fs.writeFile('video_data.json', json, 'utf8', (error) => {
                if (error) {
                    console.log(error);
                }
            });
        }
    });

};


yt_data_extract();


const data_collect = () => {
    var idd;
    var temp;
    var ids = [];
    fs.readFile('video_data.json', 'utf8', (err, data) => {
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
            res.render("index.ejs", { data: { id: idd, ids: ids } });

        }
    });
}
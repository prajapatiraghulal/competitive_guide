const express = require('express');
const config = require("./config.js");
const ejs = require('ejs');
const jsonFile = require('jsonfile');
const axios = require('axios');

var fs = require('fs');

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));




const query_strings = [];


//////string query conversion
const queries = [];
const query_prepare = (strings) => {
    console.log(strings);
    for (var str of strings) {
        queries.push(str.split(" "));
    }
    console.log(queries);
}




function query_inserter() {
    fs.readFile("topics.txt", 'utf8', (err, data) => {
        var x = data.split(",");
        for (var i = 0; i < 2; ++i) {
            query_strings.push(x[i]);
        }

        query_prepare(query_strings);

    })
}


var temporary = [];


function max_ratio(response) {
    console.log("max_ratio");
    var id_temp;
    var ratio_max = 0;
    for (var item of response.data.items) {
        var v_id = item.id.videoId;
        console.log(v_id);
        axios.get(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${v_id}&key=${config.my_key}`)
            .then(async(new_res) => {
                var y = new_res.data.items[0].statistics;

                if (y.viewCount > 1000 && y.likeCount / y.dislikeCount > ratio_max) {
                    ratio_max = y.likeCount / y.dislikeCount;
                    id_temp = v_id;
                    //console.log(id_temp, ratio_max);
                }

            }).catch((er) => {
                console.log("innter axios error: " + er);
            });
    }

    var obj = {};
    obj.id = id_temp;
    obj.ratio = ratio_max;
    console.log("obj" + obj);
    return obj;

}

function max_ratio_video_search_by_id() {
    console.log("max_ratio_video_search_by_id");
    for (var query of queries) {

        var temp_query = query.join("+");
        axios.get(`https://www.googleapis.com/youtube/v3/search?part=id&q=${temp_query}&type=video&&key=${config.my_key}`)
            .then((response) => {
                temporary.push(max_ratio(response));
            })
            .catch((error) => {
                console.log("error: " + error);
            });

    }
    console.log("temporary", temporary);
    return temporary;

}





//to get data from youtube 
const yt_data_extract = async() => {
    console.log("yt_data_extract");
    var obj;
    query_inserter();
    await fs.readFile('video_data.json', 'utf8', async(err, data) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(data);
            obj = JSON.parse(data);
            const returned = max_ratio_video_search_by_id();
            console.log("returned", returned);
            for (var i = 0; i < returned.length; ++i) {
                returned[i].query = query_strings[j];
                obj.table.push(returned[i]);
                //console.log(obj.table);
            }
            console.log(obj.table.length);
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
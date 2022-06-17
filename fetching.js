const axios = require('axios');
const express = require('express');
const app = express();
const fs = require('fs');




app.get("/", (req, res) => {

    fs.readFile("hrefs.txt", 'utf8', (err, data) => {
        var x = data.split(",");
        var new_x = [];
        for (var i = 0; i < 5; ++i) {
            new_x.push(x[i]);
        }
        console.log(new_x);
    })
});


app.listen(8000, () => {
    console.log("listening at 8000");
})
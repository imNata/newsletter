const express = require('express');
const parser = require('body-parser');
const https = require('https');

const app = express();
app.use(express.static("assets"));
app.use(parser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const age = req.body.age;
    const mobNumber = req.body.mobNumber;
    const email = req.body.email;
    const apiKey = "ef294d080493cd88d6a869a55ece00a6-us14";
    const listId = "c0c872cb42";
    const url = "https://us14.api.mailchimp.com/3.0/lists/" + listId;

    const options = {
        method: 'POST',
        auth: "Neeraj:" + apiKey
    };

    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fname,
                LNAME: lname,
                PHONE: mobNumber,
                AGE: age
            },

        }]
    };

    const JSONdata = JSON.stringify(data);

    const requested = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + '/failure.html');
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    requested.write(JSONdata);
    requested.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log('server started...');
});
const asyncRequest = require('async-request');
const express = require('express');
const app = express();
const path = require('path');
const port = 7000;

const getLongitudeLatitude = async (location) => {
    const accesstoken = 'pk.eyJ1Ijoidm9naWFodXk5NyIsImEiOiJjbDhjM214YzIwMnJjM3VwZXlqeDB4ams4In0.CY3JVKKEVHCayUFlNlTXcQ';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?proximity=-73.990593%2C40.740121&types=place%2Cpostcode%2Caddress&access_token=${accesstoken}`;

    try {
        const res = await asyncRequest(url);
        const data = JSON.parse(res.body);
        // console.log('data', data);

        const map = {
            place: data.features[0].place_name,
            longitude: data.features[0].geometry.coordinates[0],
            latitude: data.features[0].geometry.coordinates[1],
        };

        console.log('map', map);

        return map;

    } catch (error) {
        console.log('error', error);
    }
}

// getLongitudeLatitude('tokyo');

const pathPublic = path.join(__dirname, './public');
app.use(express.static(pathPublic));

app.get('/', async (req, res) => {
    // res.send("Hello kaiser");
    const params = req.query;
    console.log('params', params);

    const location = params.address;
    const map = await getLongitudeLatitude(location);
    console.log('map', map);

    if (location) {
        res.render('map', { // map.bhs
            status: true,
            place: map.place,
            longitude: map.longitude,
            latitude: map.latitude,        
        });
    }else{
        res.render('map', { 
            status: false,
        });
    }
});

app.set("view engine", "hbs");

app.listen(port, () => {
    console.log(`The app run on http://localhost:${port}`);
});

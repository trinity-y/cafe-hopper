const axios = require('axios').default;
const fs = require('fs/promises');
require('dotenv').config();

// places NearbySearch requires that we put in a location, and it will return up to 20 results per location
// i tried to keep the locations fairly small due to the 20 results limit
LOCATIONS = [
    { // university of waterloo + northeast
        "center": {
            "latitude": 43.467877,
            "longitude": -80.546907,
        },
        "radius": 1000,
    },
    { // gyubee area
        "center": {
            "latitude": 43.475507,
            "longitude": -80.523819,
        },
        "radius": 1000,
    },
    { // uptown
        "center": {
            "latitude": 43.460666,
            "longitude": -80.521244,
        },
        "radius": 661,
    },
    { // d2l adjacent
        "center": {
            "latitude": 43.447067,
            "longitude": -80.513691,
        },
        "radius": 966,
    },
    { // the part of kitchener ive never been to
        "center": {
            "latitude": 43.464949,
            "longitude": -80.499786,
        },
        "radius": 1125,
    },
    { // kitchener market
        "center": {
            "latitude": 43.449747,
            "longitude": -80.491332,
        },
        "radius": 702,
    },
    { // erb west-ish
        "center": {
            "latitude": 43.455032,
            "longitude": -80.553564,
        },
        "radius": 1000,
    },
    { // conestoga mall adjacent
        "center": {
            "latitude": 43.498632,
            "longitude": -80.527266,
        },
        "radius": 1000,
    },
    { // costco/boardwalk area
        "center": {
            "latitude": 43.448160,
            "longitude": -80.576945,
        },
        "radius": 1000,
    },
    { // finch
        "center": {
            "latitude": 43.78207,
            "longitude": -79.41690
        },
        radius: 5000
    },
    { // bloor–yonge
        "center": {
            "latitude": 43.668664,
            "longitude": -79.386439
        },
        "radius": 500
    },
    { // castle frank
        "center": {
            "latitude": 43.674912,
            "longitude": -79.368611
        },
        "radius": 500
    },
    { // college
        "center": {
            "latitude": 43.659550,
            "longitude": -79.384701
        },
        "radius": 400
    },
    { // union
        "center": {
            "latitude": 43.640728,
            "longitude": -79.379411
        },
        "radius": 500
    },
    { // dundas west
        "center": {
            "latitude": 43.656403,
            "longitude": -79.448472
        },
        "radius": 500
    },
    { // yorkdale shopping centre
        "center": {
            "latitude": 43.725338,
            "longitude": -79.451111,
        },
        "radius": 600,
    },
    { // wilson station area
        "center": {
            "latitude": 43.725969,
            "longitude": -79.450521,
        },
        "radius": 400,
    },
    { // lawrence west station
        "center": {
            "latitude": 43.716389,
            "longitude": -79.464167,
        },
        "radius": 450,
    },
    { // glencairn station
        "center": {
            "latitude": 43.700155,
            "longitude": -79.434913,
        },
        "radius": 400,
    },
    { // high park
        "center": {
            "latitude": 43.646548,
            "longitude": -79.463703,
        },
        "radius": 550,
    },
    { // trinity bellwoods park
        "center": {
            "latitude": 43.647148,
            "longitude": -79.419364,
        },
        "radius": 500,
    },
    { // rogers centre area
        "center": {
            "latitude": 43.641532,
            "longitude": -79.389165,
        },
        "radius": 450,
    },
    { // queen street west & ossington
        "center": {
            "latitude": 43.647374,
            "longitude": -79.418571,
        },
        "radius": 400,
    },
    { // distillery district
        "center": {
            "latitude": 43.650313,
            "longitude": -79.359019,
        },
        "radius": 400,
    },
    { // yonge and eglinton
        "center": {
            "latitude": 43.705574,
            "longitude": -79.397839,
        },
        "radius": 500,
    },
    { // mcmaster adjacent
        "center": {
            "latitude": 43.29115,
            "longitude": -79.92616
        },
        radius: 5000
    },
    { // west hamilton
    "center": {
        "latitude": 43.243078,
        "longitude": -79.805877
    },
        radius: 5000
    },
    { // trins ends
    "center": {
        "latitude": 43.887700,
        "longitude": -79.420543
    },
        radius: 2424
    },
    { // trins ends pt 3
    "center": {
        "latitude": 43.909080,
        "longitude": -79.373974
    },
        radius: 1962
    },
    { // trins ends pt 4 (bubble tea plaza)
    "center": {
        "latitude": 43.848682,
        "longitude": -79.382759
    },
        radius: 1962
    },
    { // markham + unionville
    "center": {
        "latitude": 43.879163,
        "longitude": -79.315032
    },
        radius: 3805
    },
    { // vaughan
    "center": {
        "latitude": 43.826794,
        "longitude": -79.555663
    },
        radius: 3235
    },
    { // trins ends part 5
    "center": {
        "latitude": 43.841172,
        "longitude": -79.449837
    },
        radius: 3234
    },
    { // ajax
    "center": {
        "latitude": 43.8654885,
        "longitude": -79.0542726
    },
        radius: 10000
    }
]

const CAFE_DATA_PATH = './prod_data/cafes.json'; // from root (!! this may be a point of error if running from docker)

async function writeCafeData() {
    console.log(`writing cafe data to ${CAFE_DATA_PATH}`);
    cafeData = []
    for (let i = 0; i < LOCATIONS.length; i++) {
        let response;
        try {
            response = await axios.post('https://places.googleapis.com/v1/places:searchNearby',
                {
                    "includedTypes": ['cafe'],
                    "locationRestriction": { 'circle': LOCATIONS[i] }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
                        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.regularOpeningHours,places.rating,places.location,places.priceRange',
                    }
                }
            );
        } catch (err) {
            if (err.response) {
                console.error('status:', err.response.status);
                console.error('error body:', err.response.data);
            } else {
                console.error(err.message);
            }
        }

        if (response.status === 200) {
            const { places } = response.data;
            if (!places) {
                console.error('no places returned. below is the response data.');
                console.log(response.data);
                console.log(`this was for location #${i}`)
                continue;
            }
            for (let j = 0; j < places.length; j++) {
                const { displayName, formattedAddress, regularOpeningHours, rating, location, priceRange } = places[j]
                if (displayName?.text !== "Tim Hortons" && displayName?.text !== "McDonald's") { // FAKE CAFES!!
                    const place = {
                        name: displayName.text,
                        address: formattedAddress,
                        openingDays: JSON.stringify(regularOpeningHours),
                        googleRating: rating,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        startPrice: priceRange?.startPrice?.units,
                        endPrice: priceRange?.endPrice?.units,
                    };
                    cafeData.push(place);
                }
            }
        }
    }
    await fs.writeFile(CAFE_DATA_PATH, JSON.stringify(cafeData, null, 2));
    return cafeData;
}

async function getCafeData() {
    try {
        const stringifiedCafeData = await fs.readFile(CAFE_DATA_PATH);
        const cafeData = JSON.parse(stringifiedCafeData);
        return cafeData;
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('cafe data not found');
            return await writeCafeData();
        } else {
            throw err;
        }
    }
}

module.exports = { getCafeData };
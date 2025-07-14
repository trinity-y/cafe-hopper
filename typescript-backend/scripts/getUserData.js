const fs = require('fs/promises');
const { generateUsername } = require('unique-username-generator');
const { customAlphabet } = require('nanoid')
require('dotenv').config();

const USERS_DATA_PATH = './prod_data/users.json'; // from root (!! this may be a point of error if running from docker)
const NUMBER_OF_RECORDS = 750;
const generateFirebaseUID = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 28); // firebase UIDS are alphanumeric + 28 digs

async function writeUserData() {
    userData = [];
    for (let i=0; i<NUMBER_OF_RECORDS; i++) {
        userData.push({ "username": generateUsername(), "firebase_uid": generateFirebaseUID() });
    }
    
    await fs.writeFile(USERS_DATA_PATH, JSON.stringify(userData, null, 2));
    return userData;
}

async function getUserData() {
    try {
        const stringifiedUserData = await fs.readFile(USERS_DATA_PATH);
        const userData = JSON.parse(stringifiedUserData);
        return userData;
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('user data not found');
            return await writeUserData();
        } else {
            throw err;
        }
    }
}

module.exports = { getUserData };


const bcrypt = require("bcrypt");

const saltRounds = 10;

function MakeHash(text) {

    return bcrypt.hash(text, saltRounds).then((hash)=>{

        return hash;
    });
}

function CompareHash(text, hash) {

    return bcrypt.compare(text, hash).then((result)=>{

        return result;
    });
}

module.exports = { MakeHash, CompareHash }
const fetch = require('node-fetch');

function matchCountDB(){
    const fetchedData = fetch('http://localhost:7071/api/matchCount')
    .then(result => result.json())
    .then(data => {
        return data;
    })
    return fetchedData;
}
module.exports.matchCountDB = matchCountDB

async function countMatches(){
    let count;
    let number;
    await matchCountDB().then(result => number = result)
    console.log(number);
    if(number == null){
        return "No Users in App"
    } else {
        count = number
        return count.value
    }    
}
module.exports.countMatches = countMatches
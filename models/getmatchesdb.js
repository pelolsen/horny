const { json } = require('express');
const fetch = require('node-fetch');

function getMatches(id){
    const fetchedData = fetch(`http://localhost:7071/api/getUserMatches?id=${id}`)
    .then(result => result.json())
    .then(data => {
        return data;
    })
    return fetchedData;
}


async function translatematches(id){
    let matches;
    await getMatches(id).then(result => matches = result)
    return matches
}


async function showmatches(id){
    try{
        const match = await translatematches(id)
        let result = ""
        for(i = 1; i < Object.keys(match).length +1; i++){
            result += "Match "+ i + ": " + match[i].name + ", " + match[i].age + ", id: " + match[i].id + '<br>'
        }
        return result
    } catch(e){
        console.log(e);
    }
}
module.exports = showmatches


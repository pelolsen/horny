const fetch = require('node-fetch');

function testMatch(user_id, likes){
    const fetchedData = fetch(`http://localhost:7071/api/likes?user_id=${user_id}&likes=${likes}`)
    .then(result => result.json())
    .then(data => {
        return data;
    })
    return fetchedData;
}

async function matchTester(user_id, likes){
    let something;
    let match;
    await testMatch(user_id, likes).then(result => something = result)
    //console.log(something);
    if(something == null){
        return "No something in App"
    } else {
        match = something
        return match
    }    
}
module.exports = matchTester;

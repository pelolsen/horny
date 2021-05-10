const fetch = require('node-fetch');

function haveseensearch(user_id, have_seen_id){
    const fetchedData = fetch(`http://localhost:7071/api/have_seen?user_id=${user_id}&have_seen_id=${have_seen_id}`)
    .then(result => result.json())
    .then(data => {
        return data;
    })
    return fetchedData;
}
module.exports = haveseensearch
/*
async function testfunc() {
    try{
        let virkerlortet;
        await haveseensearch(1, 4).then(result => virkerlortet = result)
        console.log(virkerlortet);
    }
    catch{
        console.log("videre med lortet");
    }
}
testfunc()
*/
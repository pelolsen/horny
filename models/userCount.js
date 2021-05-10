const fetch = require('node-fetch');

function userCountDB(){
    const fetchedData = fetch('http://localhost:7071/api/userCount')
    .then(result => result.json())
    .then(data => {
        return data;
    })
    return fetchedData;
}
module.exports.userCountDB = userCountDB

async function countUsers(){
    let count;
    let number;
    await userCountDB().then(result => number = result)
    //console.log(number);
    if(number == null){
        return "No Users in App"
    } else {
        count = number
        return count.value
    }    
}
module.exports.countUsers = countUsers

//countUsers(userCountDB())
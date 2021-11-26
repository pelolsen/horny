const fetch = require('node-fetch');

const getFromDB = (email) => {
    const fetchedData = fetch(`http://localhost:7071/api/user?email=${email}`)
    .then(result => result.json())
    .then(data => {
        return data;
    })
    return fetchedData;
}

module.exports = getFromDB;
//---------------------TEST------------------
/*
async function test(email){
    try{
        let user;
        await getFromDB(email).then(data => user=data)
        console.log(user) //virker udmærket den logger en objekt som står den user som har den mail
         // output: Promise {<pending>}
    }catch(error){
        return error.message
    }
}
let userbro= test('p@p')
console.log(userbro);// output: Promise {<pending>}
*/
/*
async function test(email){
    let user = ""
    await getFromDB(email).then(data => {
        data;
        user = data;
        console.log(user)
        return user // fetched user
    })
    return user
}
test('p@p')
console.log(test('p@p'));
*/
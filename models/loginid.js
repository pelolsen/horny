const fetch = require('node-fetch');

const getIDFromDB = (id) => {
    const fetchedData = fetch(`http://localhost:7071/api/getUserbyID?id=${id}`)
      .then(result => result.json())
      .then(data => {
          return data;
      })
  
      return fetchedData;
}

module.exports = getIDFromDB;
//---------------------TEST------------------
/*
async function test(id){
    try{
        let user;
        await getIDFromDB(id).then(data => user=data)
        console.log(user) //virker udmærket den logger en objekt som står den user som har den mail
         // output: Promise {<pending>}
    }catch(error){
        return error.message
    }
}
let userbro= test(1)
console.log(userbro);// output: Promise {<pending>}

function getFromDBid(id){
    const fetchedData = fetch(`http://localhost:7071/api/user?email=${id}`)
    .then(
        function(response){
            if (response.status !== 200){
                console.log("Noget gik galt" + response.status);
                return;
            }

            response.json()
        }

    )
    .then(function (data) {
        return data 
    });
    return fetchedData
}
getFromDBid('p@p').then(data => console.log(data))
*/


//module.exports = getFromDBid;
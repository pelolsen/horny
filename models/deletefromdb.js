const fetch = require('node-fetch')

function deleteFromDB(id){
    fetch(`http://localhost:7071/api/getUserbyID?id=${id}`, {method: 'POST'})
    .then((response) => {
        response.json()
        console.log("Success")
    }).catch((err) =>{
        console.log(err)
    }) 
}


module.exports = deleteFromDB;
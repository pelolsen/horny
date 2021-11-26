const fetch = require('node-fetch')

function deleteMatchFromDB(id){
    fetch(`http://localhost:7071/api/matchCount?id=${id}`, {method: 'POST'})
    .then((response) => {
        response.json()
        console.log("Success")
    }).catch((err) =>{
        console.log(err)
    }) 
}


module.exports = deleteMatchFromDB;
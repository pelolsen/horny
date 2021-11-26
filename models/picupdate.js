const fetch = require('node-fetch')

function updatePicToDB(id, picture){
    fetch(`http://localhost:7071/api/userPicUpdate?id=${id}`, {
        method: 'POST',
        body: JSON.stringify({picture}), 
        headers: {
            "Content-Type": "application/json; charset-UTF-8"
        }
    })
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        console.log(data)
    }).catch((err) =>{
        console.log(err)
    }) 

}

module.exports = updatePicToDB;
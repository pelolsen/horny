const fetch = require('node-fetch')

function matchesToDB(user_id, match){
    fetch("http://localhost:7071/api/matchestoDB", {
        method: 'POST',
        body: JSON.stringify({
            user_id,
            match
        }), 
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

module.exports = matchesToDB;
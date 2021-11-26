const fetch = require('node-fetch')

function haveseenToDB(user_id, have_seen_id){
    fetch("http://localhost:7071/api/have_seen", {
        method: 'POST',
        body: JSON.stringify({
            user_id,
            have_seen_id
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

module.exports = haveseenToDB;
const fetch = require('node-fetch')

function likesToDB(user_id, likes){
    fetch("http://localhost:7071/api/likes", {
        method: 'POST',
        body: JSON.stringify({
            user_id,
            likes
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

module.exports = likesToDB;
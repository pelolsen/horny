const fetch = require('node-fetch')

function dislikesToDBfunc(user_id, dislikes){
    fetch("http://localhost:7071/api/dislike", {
        method: 'POST',
        body: JSON.stringify({
            user_id,
            dislikes
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

module.exports = dislikesToDBfunc;
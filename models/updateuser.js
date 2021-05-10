const fetch = require('node-fetch')

function updateToDB(id, name, email, gender, age, height, interrested, interrestedgender, interrestedagefrom, interrestedageto){
    fetch(`http://localhost:7071/api/updateUser?id=${id}`)
    .then(
        function(response){
            if(response.status !== 200){
                console.log("Oh no! Something is terribly wrong")
            } else{
                fetch(`http://localhost:7071/api/updateUser?id=${id}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        name,
                        email,
                        gender, 
                        age,
                        height,
                        interrested,
                        interrestedgender,
                        interrestedagefrom,
                        interrestedageto
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
        }
    )

}

module.exports = updateToDB;
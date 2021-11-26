const fetch = require('node-fetch')

function registerToDB(name, email,gender, password, age, height, interrested, interrestedgender, interrestedagefrom, interrestedageto){
    fetch(`http://localhost:7071/api/user?email=${email}`)
    .then(
        function(response){
            if (response.status !== 200){
                fetch("http://localhost:7071/api/user", {
                    method: 'POST',
                    body: JSON.stringify({
                        name,
                        email,
                        gender, 
                        password,
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
            } else{
                console.log("email in use")
            }
        }
    )
}

module.exports = registerToDB;
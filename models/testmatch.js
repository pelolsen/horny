const fetch = require('node-fetch');

function testMatch(user_id, likes){
    const fetchedData = fetch(`http://localhost:7071/api/likes?user_id=${user_id}&likes=${likes}`)
    .then(result => result.json())
    .then(data => {
        return data;
    })
    return fetchedData;
}

async function matchTester(user_id, likes){
    let something;
    let match;
    await testMatch(user_id, likes).then(result => something = result)
    //console.log(something);
    if(something == null){
        return "No something in App"
    } else {
        match = something
        return match
    }    
}
module.exports = matchTester;
/*
function testMatch(user_id, likes){
    fetch(`http://localhost:7071/api/likes?user_id=${likes}&likes=${user_id}`)
    .then(
        function(response){
            if (response.status !== 200){
                console.log("no match for you")
            } else{
                fetch("http://localhost:7071/api/", {
                    method: 'POST',
                    body: JSON.stringify({
                        user_id,
                        match: likes
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

module.exports = testMatch;
*/
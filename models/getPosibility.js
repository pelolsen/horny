const fetch = require('node-fetch');

const getpossibility= (id, height, interrested, interrestedgender, interrestedagefrom, interrestedageto, age) => {
    const fetchedData = fetch(`http://localhost:7071/api/getMatchPos?id=${id}&height=${height}&interrested=${interrested}&interrestedgender=${interrestedgender}&interrestedagefrom=${interrestedagefrom}&interrestedageto=${interrestedageto}&age=${age}`)
      .then(result => result.json())
      .then(data => {
          return data;
      })
  
      return fetchedData;
}

module.exports.getpossibility = getpossibility;

async function returnpossibility(id, height, interrested, interrestedgender, interrestedagefrom, interrestedageto, age){
    let possibilities;
    let array;
    await getpossibility(id, height, interrested, interrestedgender, interrestedagefrom, interrestedageto, age).then(result => possibilities = result)
    //console.log(possibilities);
    if(possibilities == null){
        return "No possibilities in App"
    } else {
        array = possibilities
        return array
    }    
}
//returnpossibility(1, 180, 160180, 'female', 20, 30, 20);
module.exports.returnpossibility = returnpossibility;
/*
async function showperson(id, height, interrested, interrestedgender){
    const possibilityarray = await returnpossibility(id, height, interrested, interrestedgender)
    //console.log(possibilityarray)
    for(i=1; i < Object.keys(possibilityarray).length; i++){
        user_return = {};
        if(possibilityarray[i].id !== 3){
            user_return = possibilityarray[i]
            //console.log(user_return);
            break
        }
    }
    return user_return
}

async function testfunc() {
    const virkerlortet = await showperson(1, 180, 160180, 'female')
    console.log(virkerlortet);
}

testfunc()

/*
async function testfunc() {
    const virkerlortet = await returnpossibility(1, 180, 160180, 'female')
    console.log(virkerlortet[1].id);
}

testfunc()
*/
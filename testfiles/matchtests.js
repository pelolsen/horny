const gmp = require('../models/getPosibility')
const haveseenToDB = require('../models/haveseen')
const haveseensearch = require('../models/haveseensearch')
async function showperson(id, height, interrested, interrestedgender){
    const possibilityarray = await gmp.returnpossibility(id, height, interrested, interrestedgender)
    //console.log(possibilityarray)
    for(i=1; i < Object.keys(possibilityarray).length + 1; i++){
        user_return = {};
        if(possibilityarray[i] !== null){
            let tjek;
            let letsgo = 0;
            try{
                await haveseensearch(id, possibilityarray[i].id).then(result => tjek = result);
                console.log(tjek);
            } catch{
                letsgo = 1
            }
            if(letsgo ==1){
                user_return = possibilityarray[i]
                haveseenToDB(id, user_return.id)
                //console.log(user_return);
                break
            }
        }
    }
    return user_return
}

async function testfunc() {
    const virkerlortet = await showperson(1, 180, 160180, 'female')
    console.log(virkerlortet);
}

testfunc()
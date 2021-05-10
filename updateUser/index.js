const db = require('../database/db');


module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.')

    try {
        await db.startDb(); //start db connection
    } catch (error) {
        console.log("Error connecting to the database", error.message)
    }
    switch (req.method) {
        case 'GET':
            await get(context, req);
            break;
        case 'POST':
            await post(context, req);
            break
        default:
            context.res = {
                body: "Please get, post or update"
            };
            break
    }
}

async function get(context, req){
    try{
        let id = req.query.id;
        let user = await db.selectid(id)
        context.res = {
            body: { 
                id: user[0].value,
                gender: user[1].value,
                name: user[2].value,
                email: user[3].value,
                password: user[4].value,
                age: user[5].value,
                matches: user[6].value,
                picture: user[7].value,
                height: user[8].value,
                interrested: user[9].value,
                interrestedgender: user[10].value,
                interrestedagefrom: user[11].value,
                interrestedageto: user[12].value
            }
        };
    } catch(error){
        context.res = {
            status: 400,
            body: `No User - ${error.message}`
        }
    }
}


async function post(context, req){
    try{
        let id = req.query.id
        let payload = req.body;
        await db.updateuser(payload, id)
        context.res = {
            body: {status: 'Success'}
        }
    } catch(error){
        context.res = {
            status: 400,
            body: error.message
        }
    }
}

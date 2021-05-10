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
                body: "Please get or post"
        };
            break
    }
}

async function get(context, req){
    try{
        let id = req.query.id;
        let height = req.query.height
        let interrested = req.query.interrested
        let interrestedgender = req.query.interrestedgender
        let interrestedagefrom = req.query.interrestedagefrom
        let interrestedageto = req.query.interrestedageto
        let age = req.query.age;
        let user = await db.selectpossiblematches(id, height, interrested, interrestedgender, interrestedagefrom, interrestedageto, age)
        context.res = {
            body: user
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
        let payload = req.body;
        await db.insertMatchtoDB(payload)
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
const db = require('../../database/db');


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
        let user = await db.getMatchesFromDB(id)
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
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
            await get(context);
            break;
        case 'POST':
            await post(context, req);
            break;
        default:
            context.res = {
                body: "Please gotta GET that - bum bum bum"
            };
            break
    }
}

async function get(context){
    try{
        let result = await db.countmatches()
        context.res = {
            body: {
                value: result[0].value,
                
            }
        };
    } catch(error){
        context.res = {
            status: 400,
            body: `Cant get that - ${error.message}`
        }
    }
}
async function post(context, req){
    try{
        let id = req.query.id;
        await db.deletematch(id)
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
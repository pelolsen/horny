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
        default:
            context.res = {
                body: "Please gotta GET that - bum bum bum"
            };
            break
    }
}

async function get(context){
    try{
        let result = await db.countuser()
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
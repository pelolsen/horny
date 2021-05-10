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
        let user_id = req.query.user_id;
        let have_seen_id = req.query.have_seen_id;
        let user = await db.searchhaveseen(user_id, have_seen_id)
        context.res = {
            body: {
                user_id: user[0].value,
                have_seen_id: user[1].value
            }
        };
    } catch(error){
        context.res = {
            status: 400,
            body: `No user - ${error.message}`
        }
    }
}

async function post(context, req){
    try{
        let payload = req.body;
        await db.inserthaveseen(payload)
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
const httpFunction = require('./index');
const context = require('../testing/defaultContext')

test('Http trigger should return known text', async () => {

    const request = {
        method: 'POST',
        query: JSON.stringify({
            gender: 'male',
            name: 'unittest',
            email: 'unit@unit',
            password: 'unit',
            age: 20,
            matches: null,
            picture: null,
            height: 180,
            interrested: 160180,
            interrestedgender: 'female',
            interrestedagefrom: 20,
            interrestedageto: 28
            })
            
    };

    await httpFunction(context, request);

    expect(context.log.mock.calls.length).toBe(1);
    expect(context.res.body).toEqual('Success');
});
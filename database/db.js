const { Connection, Request, TYPES} = require('tedious');
const config = require('./config.json')
var connection = new Connection(config)
//Connect to DB
function startDb(){
    return new Promise((resolve, reject) => {
        connection.on('connect', (err) => {
            if (err) {
                console.log("Connection failed")
                reject(err)
                throw err;
            } else {
                console.log("Connected")
                resolve();
            }
        })
        connection.connect();
    })
}
module.exports.sqlConnection = connection;
module.exports.startDb = startDb;

function insert(payload){
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO [datingschema].[user] (name, email, gender, password, age, height, interrested, interrestedgender, interrestedagefrom, interrestedageto) VALUES (@name, @email, @gender, @password, @age, @height, @interrested, @interrestedgender, @interrestedagefrom, @interrestedageto)`
        const request = new Request(sql, (err) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });
        request.addParameter('name', TYPES.VarChar, payload.name)
        request.addParameter('email', TYPES.VarChar, payload.email)
        request.addParameter('gender', TYPES.VarChar, payload.gender)
        request.addParameter('password', TYPES.VarChar, payload.password)
        request.addParameter('age', TYPES.Int, payload.age)
        request.addParameter('height', TYPES.Int, payload.height)
        request.addParameter('interrested', TYPES.Int, payload.interrested)
        request.addParameter('interrestedgender', TYPES.VarChar, payload.interrestedgender)
        request.addParameter('interrestedagefrom', TYPES.Int, payload.interrestedagefrom)
        request.addParameter('interrestedageto', TYPES.Int, payload.interrestedageto)


        request.on('requestCompleted', (row) => {
            console.log('User inserted', row);
            resolve('user inserted', row)
        });
        connection.execSql(request)

    });
}
module.exports.insert = insert;

function select(email){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM [datingschema].[user] where email = @email'
        const request = new Request(sql, (err, rowcount) => {
            if (err){
                reject(err)
                console.log(err)
            } else if (rowcount == 0) {
                reject({message: 'User does not exist'})
            }
        });
        request.addParameter('email', TYPES.VarChar, email)
    
        request.on('row', (columns) => {
            resolve(columns)
        });
        connection.execSql(request)
    })

}
module.exports.select = select;

function selectid(id){
    return new Promise((resolve, reject) => {
        if (connection.state !== connection.STATE.LOGGED_IN) {
            // Put the request back on the dispatcher if connection is not in LoggedIn state
            setTimeout(selectid, 2000, id);
            return;
        }
        const sql = 'SELECT * FROM [datingschema].[user] where id = @id'
        const request = new Request(sql, (err, rowcount) => {
            if (err){
                reject(err)
                console.log(err)
            } else if (rowcount == 0) {
                reject({message: 'User does not exist'})
            }
        });
        request.addParameter('id', TYPES.Int, id)
    
        request.on('row', (columns) => {
            resolve(columns)
        });
        connection.execSql(request)
    })

}
module.exports.selectid = selectid;

function deleteuser(id){
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM datingschema.[user] WHERE id = @id'
        const request = new Request(sql, (err, rowcount) => {
            if (err){
                reject(err)
                console.log(err)
            } else if (rowcount == 0) {
                reject({message: 'User does not exist'})
            }
        });
        request.addParameter('id', TYPES.Int, id)
    
        request.on('row', (columns) => {
            resolve(columns)
        });
        connection.execSql(request)
    })

}
module.exports.deleteuser = deleteuser;

function updateuser(payload, id){
    return new Promise((resolve, reject) => {
        const sql = `UPDATE datingschema.[user] SET name = @name, email = @email, gender = @gender, age = @age, height = @height, interrested = @interrested, interrestedgender = @interrestedgender, interrestedagefrom = @interrestedagefrom, interrestedageto = @interrestedageto WHERE id = @id`
        const request = new Request(sql, (err) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });
        request.addParameter('id', TYPES.Int, id)
        request.addParameter('name', TYPES.VarChar, payload.name)
        request.addParameter('email', TYPES.VarChar, payload.email)
        request.addParameter('gender', TYPES.VarChar, payload.gender)
        request.addParameter('age', TYPES.Int, payload.age)
        request.addParameter('height', TYPES.Int, payload.height)
        request.addParameter('interrested', TYPES.Int, payload.interrested)
        request.addParameter('interrestedgender', TYPES.VarChar, payload.interrestedgender)
        request.addParameter('interrestedagefrom', TYPES.Int, payload.interrestedagefrom)
        request.addParameter('interrestedageto', TYPES.Int, payload.interrestedageto)

        request.on('requestCompleted', (row) => {
            console.log('User updated', row);
            resolve('user updated', row)
        });
        connection.execSql(request)

    });
}
module.exports.updateuser = updateuser;

function updateuserpicture(payload, id){
    return new Promise((resolve, reject) => {
        const sql = `UPDATE datingschema.[user] SET picture = @picture WHERE id = @id`
        const request = new Request(sql, (err) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });
        request.addParameter('id', TYPES.Int, id)
        request.addParameter('picture', TYPES.VarChar, payload.picture)
    
        request.on('requestCompleted', (row) => {
            console.log('Picture updated', row);
            resolve('Picture updated', row)
        });
        connection.execSql(request)

    });
}
module.exports.updateuserpicture = updateuserpicture;

function selectpossiblematches(id, height, interrested, interrestedgender, interrestedagefrom, interrestedageto, age){
    return new Promise((resolve, reject) => {
        if (connection.state !== connection.STATE.LOGGED_IN) {
            // Put the request back on the dispatcher if connection is not in LoggedIn state
            setTimeout(selectpossiblematches, 2000, (id, height, interrested, interrestedgender));
            return;
        }
        const sql = 'SELECT * FROM datingschema.[user] WHERE id != @id AND height = @interrested AND interrested = @height AND gender = @interrestedgender AND (age >= @interrestedagefrom AND age <= @interrestedageto) AND (interrestedagefrom <= @age AND interrestedageto >= @age)'
        const request = new Request(sql, (err, rowcount) => {
            if (err){
                reject(err)
                console.log(err)
            } else if (rowcount == 0) {
                reject({message: 'User does not exist'})
            }
        });
        request.addParameter('id', TYPES.Int, id)
        request.addParameter('height', TYPES.Int, height)
        request.addParameter('interrested', TYPES.Int, interrested)
        request.addParameter('interrestedgender', TYPES.VarChar, interrestedgender)
        request.addParameter('interrestedagefrom', TYPES.Int, interrestedagefrom)
        request.addParameter('interrestedageto', TYPES.Int, interrestedageto)
        request.addParameter('age', TYPES.Int, age)
    
        var response = {};
        var counter = 1;
        request.on('row', (columns) => {
            response[counter] = {}
            columns.forEach(function(column){
                response[counter][column.metadata.colName] = column.value;
            })
            counter += 1;
        })
        request.on('requestCompleted', function() {
            resolve(response);
        })
        connection.execSql(request)
    })

}
module.exports.selectpossiblematches = selectpossiblematches;

function inserthaveseen(payload){
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO [datingschema].[have_seen] (user_id, have_seen_id) VALUES (@user_id, @have_seen_id)`
        const request = new Request(sql, (err) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });
        request.addParameter('user_id', TYPES.Int, payload.user_id)
        request.addParameter('have_seen_id', TYPES.Int, payload.have_seen_id)



        request.on('requestCompleted', (row) => {
            console.log('Data inserted', row);
            resolve('data inserted', row)
        });
        connection.execSql(request)

    });
}
module.exports.inserthaveseen = inserthaveseen;

function searchhaveseen(user_id, have_seen_id){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM [datingschema].[have_seen] where user_id = @user_id AND have_seen_id = @have_seen_id'
        const request = new Request(sql, (err, rowcount) => {
            if (err){
                reject(err)
                console.log(err)
            } else if (rowcount == 0) {
                reject({message: 'User has not seen yet'})
            }
        });
        request.addParameter('user_id', TYPES.Int, user_id)
        request.addParameter('have_seen_id', TYPES.Int, have_seen_id)
    
        request.on('row', (columns) => {
            resolve(columns)
        });
        connection.execSql(request)
    })

}
module.exports.searchhaveseen = searchhaveseen;

function disliketoDB(payload){
    return new Promise((resolve, reject) => {
        if (connection.state !== connection.STATE.LOGGED_IN) {
            // Put the request back on the dispatcher if connection is not in LoggedIn state
            setTimeout(disliketoDB, 2000, payload);
            return;
        }
        const sql = `INSERT INTO [datingschema].[dislikes] (user_id, dislikes) VALUES (@user_id, @dislikes)`
        const request = new Request(sql, (err) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });
        request.addParameter('user_id', TYPES.Int, payload.user_id)
        request.addParameter('dislikes', TYPES.Int, payload.dislikes)



        request.on('requestCompleted', (row) => {
            console.log('Data inserted', row);
            resolve('data inserted', row)
        });
        request.setTimeout(5000);
        connection.execSql(request)

    });
}
module.exports.disliketoDB = disliketoDB;

function liketoDB(payload){
    return new Promise((resolve, reject) => {
        if (connection.state !== connection.STATE.LOGGED_IN) {
            // Put the request back on the dispatcher if connection is not in LoggedIn state
            setTimeout(liketoDB, 2000, payload);
            return;
        }
        const sql = `INSERT INTO [datingschema].[likes] (user_id, likes) VALUES (@user_id, @likes)`
        const request = new Request(sql, (err) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });
        request.addParameter('user_id', TYPES.Int, payload.user_id)
        request.addParameter('likes', TYPES.Int, payload.likes)



        request.on('requestCompleted', (row) => {
            console.log('Data inserted', row);
            resolve('data inserted', row)
        });
        request.setTimeout(5000);
        connection.execSql(request)

    });
}
module.exports.liketoDB = liketoDB;

function testMatchDB(user_id, likes){
    return new Promise((resolve, reject) => {
        if (connection.state !== connection.STATE.LOGGED_IN) {
            // Put the request back on the dispatcher if connection is not in LoggedIn state
            setTimeout(testMatchDB, 2000, (user_id, likes));
            return;
        }
        const sql = 'SELECT * FROM [datingschema].[likes] where user_id = @likes AND likes = @user_id'
        const request = new Request(sql, (err, rowcount) => {
            if (err){
                reject(err)
                console.log(err)
            } else if (rowcount == 0) {
                reject({message: 'No match'})
            }
        });
        request.addParameter('user_id', TYPES.Int, user_id)
        request.addParameter('likes', TYPES.Int, likes)
    
        request.on('row', (columns) => {
            resolve(columns)
        });
        connection.execSql(request)
    })
}
module.exports.testMatchDB = testMatchDB;

function insertMatchtoDB(payload){
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO [datingschema].[matches] (user_id, match) VALUES (@user_id, @match)`
        const request = new Request(sql, (err) => {
            if (err){
                reject(err)
                console.log(err)
            }
        });
        request.addParameter('user_id', TYPES.Int, payload.user_id)
        request.addParameter('match', TYPES.Int, payload.match)



        request.on('requestCompleted', (row) => {
            console.log('Data inserted', row);
            resolve('data inserted', row)
        });
        connection.execSql(request)

    });
}
module.exports.insertMatchtoDB = insertMatchtoDB;

function testfunc(age){
    return new Promise ((resolve, reject) =>{
        const sql = 'SELECT * FROM datingschema.[user] where age = @age'
        const request = new Request(sql, (err, rowcount) => {
            if (err){
                reject(err);
                console.log(err)
            } else if(rowcount == 0) {
                console.log(rowcount)
                reject({ message: 'not exist' })
            }
        })
        request.addParameter('age', TYPES.Int, age)
        var response = {};
        var counter = 1;
        request.on('row', (columns) => {
            response[counter] = {}
            columns.forEach(function(column){
                response[counter][column.metadata.colName] = column.value;
            })
            counter += 1;
        })
        request.on('requestCompleted', function() {
            resolve(response);
        })
        connection.execSql(request)
    })
}
module.exports.testfunc = testfunc

function countuser(){
    return new Promise ((resolve, reject) =>{
        const sql = 'SELECT COUNT(*) FROM [datingschema].[user]'
        const request = new Request(sql, function(err){
            if (err){
                console.log("beforeerr");
                console.log(err) //ingen err - så det godt nok!
                console.log("aftererr");
                reject(err);
            }
        })
        request.on('row', (columns) => {
            resolve(columns)
        });
        
    
        connection.execSql(request)
    })
       

}
module.exports.countuser = countuser

function getMatchesFromDB(id){
    return new Promise((resolve, reject) => {
        if (connection.state !== connection.STATE.LOGGED_IN) {
            // Put the request back on the dispatcher if connection is not in LoggedIn state
            setTimeout(selectpossiblematches, 2000, (id, height, interrested, interrestedgender));
            return;
        }
        const sql = 'SELECT u.name, u.age, m.id FROM datingschema.[user] as u INNER JOIN datingschema.matches as m ON m.match = u.id WHERE m.user_id = @id'
        const request = new Request(sql, (err, rowcount) => {
            if (err){
                reject(err)
                console.log(err)
            } else if (rowcount == 0) {
                reject({message: 'User does not exist'})
            }
        });
        request.addParameter('id', TYPES.Int, id)
    
        var response = {};
        var counter = 1;
        request.on('row', (columns) => {
            response[counter] = {}
            columns.forEach(function(column){
                response[counter][column.metadata.colName] = column.value;
            })
            counter += 1;
        })
        request.on('requestCompleted', function() {
            resolve(response);
        })
        connection.execSql(request)
    })
}
module.exports.getMatchesFromDB = getMatchesFromDB

function deletematch(id){
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM datingschema.[matches] WHERE id = @id'
        const request = new Request(sql, (err, rowcount) => {
            if (err){
                reject(err)
                console.log(err)
            } else if (rowcount == 0) {
                reject({message: 'User does not exist'})
            }
        });
        request.addParameter('id', TYPES.Int, id)
    
        request.on('row', (columns) => {
            resolve(columns)
        });
        connection.execSql(request)
    })

}
module.exports.deletematch = deletematch;

function countmatches(){
    return new Promise ((resolve, reject) =>{
        const sql = 'SELECT COUNT(*) FROM [datingschema].[matches]'
        const request = new Request(sql, function(err){
            if (err){
                console.log("beforeerr");
                console.log(err) //ingen err - så det godt nok!
                console.log("aftererr");
                reject(err);
            }
        })
        request.on('row', (columns) => {
            resolve(columns)
        });
        
    
        connection.execSql(request)
    })
       

}
module.exports.countmatches = countmatches
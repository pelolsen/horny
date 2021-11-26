if (process.env.Node_ENV !== 'production') {
    require('dotenv').config()
}
//Node Modules
const express = require('express')
const app = express()
const bcrypt = require('bcrypt') // To encrypt the Password
const passport = require('passport') //Module used to authentification form
const flash = require('express-flash') // Display flash messages in the frontend
const session = require('express-session') //Create a local-session
const fetch = require('node-fetch') // Need is to Database access
const methodOverride = require("method-override") //To override Post method with Delete
const multer = require('multer') //Multer to picture Uploads and store in local system

//Database Access
const registerToDB = require('./models/registertodb')
const getFromDB = require('./models/login')
const getIDFromDB = require('./models/loginid')
const deleteFromDB = require('./models/deletefromdb')
const updateToDB = require('./models/updateuser')
const updatePicToDB = require('./models/picupdate')
const deleteMatchFromDB = require('./models/deletematchdb')
const likesToDB = require('./models/likestodb')
const matchesToDB = require('./models/matchtodb')
const matchTester = require('./models/testmatch')
const gmp = require('./models/getPosibility')
const haveseenToDB = require('./models/haveseen')
const haveseensearch = require('./models/haveseensearch')
const dislikesToDBfunc = require('./models/dislikestodb')
const showmatches = require('./models/getmatchesdb')
const uc = require('./models/userCount')
const mc = require('./models/matchCount')

//Multer - Picture Upload
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function(req, file, cb){
        //I use Date.now so I'm sure that there is no pictures with the same name
        cb(null, Date.now().toString() + file.originalname)
    }
})
const upload = multer({storage: storage}).single('UserFile');

//Passport - Authentification Form
const initialize = require('./models/passport-config')
initialize(
    passport, 
    email => getFromDB(email),
    id => getIDFromDB(id)
)

app.set('view-engine', 'ejs')
app.use('/public', express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

const ts = require('./models/translatefromdb')
//Home Page
app.get('/', checkAuthenticated, (req, res) => {
    const gender = ts.translate_gender(req.user.gender)
    const height = ts.translate_height(req.user.height)
    const intheight = ts.translate_height(req.user.interrested)
    //const dbnr = req.user.interrested
    //const nr = DBnrtoEjs(dbnr)
    //console.log(nr)
    res.render('index.ejs', { name: req.user.name, age: req.user.age, gender: gender, picture: req.user.picture, matches: req.user.matches, height: height, interrested: intheight, interrestedagefrom: req.user.interrestedagefrom, interrestedageto: req.user.interrestedageto })
})
// Match Alert
app.get('/itsamatch', checkAuthenticated, (req,res)=>{
    res.render("itsamatch.ejs")
})
// Login Page
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post("/login", checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))
//Register Page
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})
//Working without problems
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try{
        //Request the inputed data from the Frontend
        const name = req.body.name
        const email= req.body.email
        const gender= req.body.gender
        const height= req.body.height
        const heightint = req.body.heightint
        const genderint = req.body.interrestedgender
        const intagefrom = req.body.interrestedagefrom
        const intageto = req.body.interrestedageto
                        //Bcrypt - Here we encrypt the password so it is not possible to read it in the database
        const password= await bcrypt.hash(req.body.password, 10)
        const age= req.body.age
        //We send all the data to the DB
        registerToDB(name, email, gender, password, age, height, heightint, genderint,intagefrom,intageto)
        //console.log(password)
        //If all worked, redirect to login, else redirect to register again
        res.redirect('/login')
      }catch{
        res.redirect('/register')
    }
})

// Update Profile Page
app.get("/updateprofile", checkAuthenticated, (req,res)=> {
    res.render("updateprofile.ejs")
})
// Minor Error - Doesn't redirect to /. But it works tho.
app.post("/updateprofile", checkAuthenticated, (req,res) =>{
    try{
        const id=req.user.id
        const name = req.body.name
        const email= req.body.email
        const gender= req.body.gender
        const height= req.body.height
        const heightint = req.body.heightint
        const age= req.body.age
        const genderint = req.body.interrestedgender
        const intagefrom = req.body.interrestedagefrom
        const intageto = req.body.interrestedageto

        updateToDB(id, name, email, gender, age, height, heightint, genderint,intagefrom,intageto)
        
        res.redirect('/')
    } catch {
        res.redirect('/')
    }
})
//Update Picture
//Same problem as /updateprofile
app.post("/pictureuptade", checkAuthenticated, (req,res) =>{
    try{
        upload(req, res, (err) =>{
            if(err){
                res.redirect('/')
            }else{
                //console.log(req.file);
                const id = req.user.id
                const picture = '../public/uploads/' + req.file.filename
                updatePicToDB(id, picture);
                res.redirect('/')
            }
        })
    } catch {
        res.redirect('/')
    }
})

//Maching Part
async function test_match(user_id, likes){
    let isitamatch;
    let match;
    try{
        isitamatch = await matchTester(user_id, likes)
        //console.log(match);
        if(isitamatch !== null){
            match = true
        }
        return match
    } catch(e){
        console.log(e);
        match = false
        return match
    }
}
//Show one person at the time
async function showperson(id, height, interrested, interrestedgender, interrestedagefrom, interrestedageto, age){
    const possibilityarray = await gmp.returnpossibility(id, height, interrested, interrestedgender, interrestedagefrom, interrestedageto, age)
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
// Matching Page
app.get("/match", checkAuthenticated, async (req,res) =>{
    try{
        const id = req.user.id
        const height = req.user.height
        const interrested = req.user.interrested
        const interrestedgender = req.user.interrestedgender
        const interrestedagefrom = req.user.interrestedagefrom
        const interrestedageto = req.user.interrestedageto
        const age = req.user.age

        let user_find = await showperson(id,height,interrested,interrestedgender, interrestedagefrom, interrestedageto, age)

        //rerender the screen with the found user
        res.render("match.ejs", {id: user_find.id,name: user_find.name,picture: user_find.picture, age: user_find.age});

    }catch{   
        res.redirect('/')
    }    
})
app.post('/match', (req,res) =>{
    res.redirect('/match')
})

//Like Button
app.post('/like', checkAuthenticated, async (req,res) => {
    try{
        
        const id = req.user.id
        const height = req.user.height
        const interrested = req.user.interrested
        const interrestedgender = req.user.interrestedgender
        const interrestedagefrom = req.user.interrestedagefrom
        const interrestedageto = req.user.interrestedageto
        const age = req.user.age
        //console.log('req = '+req);
        likes = parseInt(req.body.id);
       // console.log(id);
        //console.log(likes);

        likesToDB(id, likes);
        let match = await test_match(id, likes)
        console.log(match);
        if(match == true){
            await matchesToDB(id, likes)
            res.render('itsamatch.ejs')
        } else{
            let user_find = await showperson(id,height,interrested,interrestedgender, interrestedagefrom, interrestedageto, age)
            //rerender the screen with the found user
            res.render("match.ejs", {id: user_find.id,name: user_find.name, picture: user_find.picture, age: user_find.age});
        }
        
    } catch{
        res.redirect('/')
    } 
})
//Dislike Button
app.post('/dislike', checkAuthenticated, async (req,res) => {
    try{
        
        const id = req.user.id
        const height = req.user.height
        const interrested = req.user.interrested
        const interrestedgender = req.user.interrestedgender
        const interrestedagefrom = req.user.interrestedagefrom
        const interrestedageto = req.user.interrestedageto
        const age = req.user.age
        console.log('req = '+req);
        dislikes = parseInt(req.body.id);
        console.log(id);
        console.log(dislikes);

         dislikesToDBfunc(id, dislikes);

        let user_find = await showperson(id,height,interrested,interrestedgender, interrestedagefrom, interrestedageto, age)
            //rerender the screen with the found user
        res.render("match.ejs", {id: user_find.id,name: user_find.name,picture: user_find.picture, age: user_find.age});
        
    } catch{
        res.redirect('/')
    } 
})
// View and Delete Matches
app.get('/viewdeletematches', checkAuthenticated, async (req,res)=>{
    const id = req.user.id
    const matches = await showmatches(id)

    res.render("viewdeletematches.ejs", {matches: matches})
})

app.post('/viewdeletematches', checkAuthenticated, async (req,res) =>{
    try{
        const id = req.body.id
        await deleteMatchFromDB(id);
        res.redirect('/')
    } catch{
        res.redirect('/')
    }
})
//Delete User
//Working
app.post('/deleteuser', checkAuthenticated, (req,res) =>{
    try{
        const id = req.user.id
        deleteFromDB(id);
        req.logOut();
        res.redirect('/register')
    } catch{
        res.redirect('/')
    }
})
//Logout
app.delete('/logout', async (req,res) => {
    req.logOut()
    res.redirect('/login')
})
// Functions to check if user is logget in or not, so no one can access restrictet pages
function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}


// ---------------------------------------------------------ADMIN PAGE----------------------------------------------------------------------------------------
//Check if the logget user is an ADMIN
function checkAdmin (req, res, next){
    const admid = req.user.id //Or const adminEmail = req.user.email, const adminX = req.user.X
    if (admid == 1) { //Change this if statment if to the Clients desired way of admin account.
        return next()
    }
    res.redirect('/')
}
//ADMIN PAGE, CHANGE USER
app.get("/adminpage", checkAuthenticated, checkAdmin, (req,res)=> {
    res.render("adminpage.ejs")
})

app.post("/adminpage", checkAuthenticated, checkAdmin, async (req,res) =>{
    try{
        const id = req.body.id
        console.log(id);
        const name = req.body.name
        const email= req.body.email
        const gender= req.body.gender
        const height= req.body.height
        const heightint = req.body.heightint
        const age= req.body.age
        const genderint = req.body.interrestedgender
        const intagefrom = req.body.interrestedagefrom
        const intageto = req.body.interrestedageto

        updateToDB(id, name, email, gender, age, height, heightint, genderint, intagefrom, intageto)
        
        res.redirect('/')
    } catch {
        res.redirect('/')
    }
})

//ADMIN DELETE MATCH
app.get("/admindeletematch", checkAuthenticated, checkAdmin, (req,res)=> {
    res.render("admindeletematch.ejs")
})
app.post('/admindeletematch', checkAuthenticated, checkAdmin, (req,res) =>{
    try{
        const id = req.body.id
        deleteMatchFromDB(id);
        res.redirect('/')
    } catch{
        res.redirect('/')
    }
})
//ADMIN DELETE USER
app.get("/admindeleteuser", checkAuthenticated, checkAdmin, (req,res)=> {
    res.render("admindeleteuser.ejs")
})
app.post('/admindeleteuser', checkAuthenticated, checkAdmin, (req,res) =>{
    try{
        const id = req.body.id
        deleteFromDB(id);
        res.redirect('/')
    } catch{
        res.redirect('/')
    }
})
//ADMIN MONITOR
app.get('/adminmonitoring', checkAuthenticated, checkAdmin, async (req,res) =>{
    const nr = await uc.countUsers()
    const mnr = await mc.countMatches()
    res.render("adminmonitoring.ejs", {number: nr, matchnr: mnr})
})

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
//LOCALHOST PORT XXXX
app.listen(3000)
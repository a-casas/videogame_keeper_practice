//DEPENDENCIES
const chalk = require('chalk')
const dotenv = require('dotenv')
const { request, response } = require('express')
const express = require('express')
const hbs = require('hbs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
//CONSTANTS
const app = express()
const Videogame = require('./models/Videogame')

//CONFIGURATION

//configuración de .env
require('dotenv').config()
//config de mongoose
mongoose.connect(`mongodb://localhost/${process.env.DATABASE}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
} )
.then((result) => {
    console.log(chalk.cyan(`Connected to Mongo! Database used: ${result.connections[0].name}`));
})
.catch((error) => {
    console.log(chalk.red(`There has been an error: ${error}`));
});


//config de hbs  
app.set('view engine', 'hbs') 
app.set('views', __dirname + '/views')

// config del body parser
app.use(bodyParser.urlencoded({ extended: true}))

//ROUTES
// creamos uno de los juegos
app.get('/', (req, res, next)=>{

    res.render('home')
})

app.get('/new-videogame', (req, res, next)=>{
    res.render('newVideogame')
})


//recibir información del formulario del front 
app.post('/new-videogame', (req, res, next)=>{
    
    const splitString = (_string)=>{
        const genreString = _string
        const splittedGenreString = genreString.split(', ')
        return splittedGenreString
    }
    
    const arrayPlatform = splitString(req.body.platform)
    const arrayGenre = splitString(req.body.genre)

    
    
    const newVideogame = {...req.body, genre: arrayGenre, platform: arrayPlatform}


   Videogame.create(newVideogame)
   .then((result) =>{
       console.log(result)
       res.render('newVideogame')
   })
   .catch((err) => console.log(err))
    
   //console.log(req.body)
})

//con params
app.get('/videogame/:id', (req, res, next)=>{
    const videogameID = req.params.id

    Videogame.findById(videogameID)
    .then((result) => {
        res.render('singleVideogame', result)
    })
    .catch((err)=> {
        console.log(err)
        res.send(err)
    })

//con query
// app.get('/videogame', (req, res, next)=>{
//     console.log(req.query)
//     res.send('ok')
})


app.get('/all-videogames', (req, res, next)=>{
    Videogame.find({}, {name: 1, _id: 0})
        .then((videogames)=>{
            res.render('allVideogames', {videogames})
        })
    .catch((err)=>{
        console.log(err)
        res.send(err)
    })
    
})

//LISTENER
//activar servidor
app.listen(process.env.PORT, ()=>{
    console.log(chalk.blue.inverse.bold(`Conectado al puerto ${process.env.PORT}`))
})



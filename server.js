require('dotenv').config()

const express = require('express')
const app = express ()
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
//const emp = require('./Models/schema');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

/*app.get('/', function(req, res){
    res.send('Hello World!');
});

app.post('/add', function(req,res){
    const emp = new emp({
        empName: req.body.empName,
        empEmail: req.body.empEmail,
    });
    emp.save().then(val=>{
        res.json({msg:"User added", val:val})
    })
})*/
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const contactsRouter = require('./Routes/routes')
const usersRouter = require('./Routes/user_routes')
app.use('/routes', contactsRouter)
app.use('/user_routes', usersRouter)


app.listen(3000, () => console.log('Server Started'))
const express = require('express');
const router = express.Router()
const bcrypt = require ('bcrypt')
const User = require('../Models/Users')

router.use(express.json())

router.get('/',async (req,res) => {
    try{
        const users = await User.find()
        res.json(users)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})


router.get('/:id', getUser, (req,res) => {
    res.json(res.user)
})

router.post('/register', async (req, res) => {
    let hashedPassword
    if (!req.body.email || !req.body.password || !req.body.firstname || !req.body.lastname || !req.body.role ){
        return res.status(400).send({
          message: "All fields are mandatory"
        })
      }
    try{
        hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = {name: req.body.name, password: hashedPassword}
    }catch{
        res.status(500).send()
    }
    try{
        const addr = await User.findById(req.body.email)
        if(addr!=null)
            return res.status(404).json({message:'User already registered'})
    }finally {
    const valid = await isEmailValid(req.body.email,req.body.role);
   
    if (valid){
        const user = new User ({
            lastname:req.body.lastname,
            firstname: req.body.firstname,
            email: req.body.email,
            password:hashedPassword,
            role:req.body.role
        })
        const newUser = await user.save()
        return res.send({message: "New User Added"});
    }
   
    return res.status(400).send({
      message: "Please provide a valid email address."
    })
    }
    
    
    
  })
  router.post('/login', async (req,res) =>{
      const user = users.find(user => user.name = req.body.name)
      if(user == null){
          return res.status(400).send('Nonexistent user')
      }
      try{
          if(await bcrypt.compare(req.body.password, user.password)){
              res.send('Login Successful')
          }else{
              res.send('Password Incorrect')
          }
      }catch{
          res.status(500).send()
      }
  })
router.patch('/:id',getUser, async (req,res) => {
    if(req.body.lastname!=null){
        res.user.lastname=req.body.lastname
    }
    if(req.body.firstname!=null){
        res.user.firstname=req.body.firstname
    }
    if(req.body.email!=null){
        res.user.email=req.body.email
    }
    if(req.body.password!=null){
        res.user.password=req.body.password
    }
    if(req.body.role!=null){
        res.user.role=req.body.role
    }
    try{
        const updatedUser = await res.user.save()
        res.json(updatedUser)

    }catch(err){
        res.status(400).json({message:err.message})
    }
})

router.delete('/:id',getUser, async (req,res) => {
    try{
        await res.user.remove()
        res.json({message: 'Deleted User'})
   }catch(err){
       res.status(500).json({message: err.message})
    }
})

async function getUser(req,res,next){
    try{
        user= await User.findById(req.params.id)
        if(user==null)
            return res.status(404).json({message:'Cannot find user'})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
    res.user=user
    next()
}
async function isEmailValid(req){
    let i=0
    for(i=0; i<req.params.email.length; i++)
        if(req.params.email[i]=='@')
            break
    let part = req.params.email.slice(i)
    if((part=='@stud.upb.ro'&&req.params.role=='Student')||(part=='@onmicrosoft.upb.ro'&&req.params.role=='Profesor'))
        return 1
    else
        return 0
}

module.exports = router 
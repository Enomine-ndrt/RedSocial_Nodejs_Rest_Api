const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//Register
router.post('/register',async(req,res)=>{
  try{
    //Generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedSalt = await bcrypt.hash(req.body.password,salt);
        //Create new User
        const newUser =  new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedSalt,
    });
    //save user and response
        const user = await newUser.save();
        res.status(200).json(user);
  }catch(err){
    //console.log(err);
    res.status(500).json(err);
  }
});

//LOGIN
router.post('/login', async(req,res)=>{
   try{
    const user = await User.findOne({email: req.body.email});
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!user && !validPassword ){
    res.status(404).json("User not found or password incorrect");
      //!validPassword &&  res.status(404).json("Wrong password");
    }else if(!user || !validPassword){
      res.status(404).json("Wrong password");
    }else{
      res.status(200).json(user);
    }   
  }catch(err){
    //console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;
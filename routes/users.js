const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");

let User = require('../models/user.model');


router.route('/').get((req, res) => { 
   User.find()
   .then(User => res.json(User))
   .catch(err => res.status(400).json('Error: ' +err ));
});

router.route('/add').post((req, res) => {

   const email = req.body.email;
   const username = req.body.username;
   const password = req.body.password;
   

   const newUser = new User({
      email,
      username,
      password
   });

   newUser.save()
      .then(() => res.json('User added'))
      .catch(err => res.status(400).json('Error: ' +err));
});

router.post("/login", async (req, res) => {
   try {
     const user = await User.findOne({ username: req.body.username });
     console.log(user);
     if (user) {
       const cmp = await bcrypt.compare(req.body.password, user.password);
       if (cmp) {
         .then(res.json(user));
       } else {
         res.status(400).json('Login Failed. Check Username or Password');
       }
     } else {
       res.send("Fill the username or password.");
     }
   } catch (error) {
     console.log(error);
     res.status(500).json("Internal Server error Occured");
   }
 });

router.route('/:id').get((req, res) => {
   User.findById(req.params.id)
      .then(User => res.json(User))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/delete/:id').delete((req, res) => {
   User.findByIdAndDelete(req.params.id)
      .then(() => res.json('User deleted'))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
   User.findById(req.params.id)
      .then(User => {
         User.email = req.body.email;
         User.username= req.body.username;
         User.password = req.body.password;

         User.save() 
            .then(() => res.json('User updated'))
            .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;

const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcyrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keys = require('../../config/keys');


//Load User Model
const User = require('../../models/User');

// @route GET api/users/test
// @dsec Tests users route
// @access Public

router.get('/test', (req, res) => res.json({msg: 'Posts Works'})); 

// @route GET api/users/reg
// @dsec  Register Public
// @access Public

router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(user) {
                return res.status(400).json({email: 'Email already exixsts'});
            }
            else {
                const avatar = gravatar.url(
                    req.body.email,{
                        s: '200', //size
                        r: 'pg',
                        d: 'mm' //Default
                    }
                );
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });
                bcyrpt.genSalt(10, (err,salt) => {
                    bcyrpt.hash(newUser.password, salt, (err, hash) =>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                
                  })
                })
            }
        })
});

router.post('/login', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;

User.findOne({ email }).then(user => {
    if(!user)
        return res.status(404).json({ email: 'User not found' });
    
    bcyrpt.compare(password, user.password).then(isMatch => {
        if (isMatch)  //res.json({ msg: 'Success' });
         {
            const payload = { id: user.id, name: user.name, avatar: user.avatar };

            jwt.sign(
                payload, 
                keys.secretOrKey, 
                { expiresIn: 3600 },
                (err, token) => {
                    res.json({ success: true, token: 'jayesh ' + token });
                }
            );
         }
        else
         return res.status(400).json({ password: 'pass incorrect'});
    });
});
});

 
module.exports = router;

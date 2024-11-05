// controllers/user.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../auth'); 

module.exports.registerUser = (req, res) => {
    console.log(req.body);

    if (!req.body || !req.body.email || !req.body.password || !req.body.username) {
        return res.status(400).send({ message: 'Email, password, and username are required' });
    }

    if (!req.body.email.includes("@")) {
        return res.status(400).send({ message: 'Invalid email format' });
    } else if (req.body.password.length < 8) {
        return res.status(400).send({ message: 'Password must be at least 8 characters long' });
    } else {
        let newUser = new User({
            username: req.body.username, 
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        return newUser.save()
            .then((user) => res.status(201).send({ success: true, message: 'User registered successfully', user }))
            .catch(error => auth.errorHandler(error, req, res));
    }
}

module.exports.loginUser = (req, res) => {
    if (req.body.email.includes('@')) {
        return User.findOne({ email: req.body.email }).then(result => {
            if (result == null) {
                return res.status(404).send({ message: 'No email found' });
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    return res.status(200).send({ message: 'User logged in successfully', access: auth.createAccessToken(result) });
                } else {
                    return res.status(401).send({ message: 'Incorrect email or password' });
                }
            }
        })
        .catch(error => auth.errorHandler(error, req, res));
    } else {
        return res.status(400).send({ message: 'Invalid email format' });
    }
}

exports.getUserDetails = async (req, res) => {
    const userId = req.userId;
    console.log("User ID from token:", userId); // Debugging output

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
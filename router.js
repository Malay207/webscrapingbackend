const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const cheerio = require('cheerio');
const jwt = require("jsonwebtoken");
const jwt_secrete = "Malay@345@#$";
const fetchuser = require("./authentication");
const User = require("./modal");
router.post("/createuser", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" })
        }
        else {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ error: "User already exists" })
            }
            else {
                const salt = await bcrypt.genSaltSync(10);
                const secPass = await bcrypt.hashSync(password, salt);
                user = await User.create({
                    name,
                    email,
                    password: secPass
                })
                const data = {
                    user: {
                        id: user.id
                    },
                };
                const authToken = jwt.sign(data, jwt_secrete);
                res.json({ authToken })

            }
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})
router.post("/login", async (req, res) => {
    //console.log('hello');
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }
        else {
            var user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "Please try to login with correct credentials" })
            }
            else {
                const passwordCompare = await bcrypt.compare(password, user.password);
                if (!passwordCompare) {
                    return res.status(400).json({ error: "Please try to login with correct credentials" })
                }
                else {
                    const data = {
                        user: {
                            id: user.id
                        },
                    };
                    const authToken = jwt.sign(data, jwt_secrete);
                    res.json({ authToken })
                }
            }
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})
router.post("/getdata", fetchuser, async (req, res) => {
    try {
        const { url } = req.body;
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        const title = $('.G6XhRU').text();
        const description = $('.B_NuCI').text();
        const price = $('._30jeq3._16Jk6d').text();
        const image = $('img[class=q6DClP]').attr('src');
        const rating = $('._3LWZlK._3uSWvT').text();
        const review = $('._2_R_DZ').text();

        const data = {
            title,
            price,
            rating,
            review,
            description,
            image
        }
        res.json(data);

    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})

module.exports = router;


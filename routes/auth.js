const router = require("express").Router();
const crypto = require("crypto");
const User = require("../models/User");

// ハッシュするための関数
const hash = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// ユーザー登録
router.post("/register", async (req,res) => {
    try{
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hash(req.body.password),
        });
        const user = await newUser.save();
        return res.status(200).json(user);
    } catch(err){
        return res.status(500).json(err);
    }
})

// ログイン
router.post("/login", async (req,res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if(!user) return res.status(404).send("ユーザーが見つかりません");

        const vailedPassword = hash(req.body.password) === user.password;
        if(!vailedPassword) return res.status(400).send("パスワードが違います");

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
})

// router.get("/",(req,res) => {
//     res.send("auth route");
// })

module.exports = router;
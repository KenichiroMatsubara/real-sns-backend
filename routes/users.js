const router = require("express").Router();
const User = require("../models/User");


// CRUD操作
// ユーザー情報の取得R
// ユーザー情報の更新U
router.put("/:id", async (req, res) => {
    console.log("a");
    console.log("a");
    console.log("a");
    console.log("a");
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("ユーザー情報が更新されました");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("あなたは自分のアカウントの時だけ情報を更新できます");
    }
});
// ユーザー情報の削除D
router.delete("./id", async (req,res) => {
    try {
        
    } catch (err) {
        
    }
})

// router.get("/",(req,res) => {
//     res.send("user route");
// })

module.exports = router;
const router = require("express").Router();
const User = require("../models/User");


// CRUD操作

// ユーザー情報の取得R
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...other} = user._doc;
        return res.status(200).json(other);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// ユーザー情報の取得R
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;

    try {
        const user = userId ? await User.findById(userId) : await User.findOne({username: username});
        const { password, updatedAt, ...other} = user._doc;
        return res.status(200).json(other);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// ユーザー情報の更新U
// 教材ではpostではなくputで行われていたがputだとエラーが発生し、こちらではしないのでこのままにすることにした
router.put("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            return res.status(200).json("ユーザー情報が更新されました");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("あなたは自分のアカウントの時だけ情報を更新できます");
    }
});

// ユーザー情報の削除D
router.delete("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            return res.status(200).json("ユーザー情報が削除されました");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("あなたは自分のアカウントの時だけ情報を削除できます");
    }
});

// ユーザーのフォロー
router.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //　フォロワーに自分がいなかったらフォローできる
            // if(!currentUser.followings.includes(req.params.id))と同義
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({
                    $push: {
                        followers: req.body.userId,
                    }
                })
                await currentUser.updateOne({
                    $push: {
                        followings: req.params.id,
                    }
                })
                return res.status(200).json("フォローに成功");
            } else {
                return res.status(403).json("あなたはすでにこのユーザーをフォローしています。");
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json("このアカウントはあなた自分自身のアカウントです");
    }
});

// ユーザーのフォロー解除
router.put("/:id/unfollow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //　フォロワーに自分がいたらフォロー解除ができる
            // if(currentUser.followings.includes(req.params.id))と同義
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({
                    $pull: {
                        followers: req.body.userId,
                    }
                })
                await currentUser.updateOne({
                    $pull: {
                        followings: req.params.id,
                    }
                })
                return res.status(200).json("フォロー解除に成功");
            } else {
                return res.status(403).json("あなたはすでにこのユーザーをフォローしていません。");
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json("このアカウントはあなた自分自身のアカウントです");
    }
});



module.exports = router;
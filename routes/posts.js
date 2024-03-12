const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// 新しいメッセージを投稿する
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = new Post(req.body).save();
        return res.status(200).json(savedPost);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// メッセージを取得する
router.get("/:id" , async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);
    } catch (err) {
        return res.status(403).json(err);
    }
})

// メッセージを編集する
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({
                $set: req.body,
            });
            return res.status(200).json("メッセージの編集に成功しました！");
        } else {
            return res.status(403).json("あなたの投稿したメッセージしか編集できません");
        }
    } catch (err) {
        return res.status(403).json(err);
    }
});

// メッセージを削除する
router.delete("/:id",async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            // await Post.findByIdAndDelete(req.params.id);こっちでも大丈夫であることはPostManで確認済みだが万が一エラーが発生しないため、教材通りにしておく
            await post.deleteOne();
            return res.status(200).json("メッセージの削除に成功しました");
        } else {
            return res.status(403).json("これはあなたの投稿したメッセージではないので削除できません");
        }
    } catch (err) {
        return res.status(403).json(err);
    }
})

// いいねを押す
router.put("/:id/like",async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        // まだいいねを押していないとき
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({
                $push: {
                    likes: req.body.userId,
                }
            });
            return res.status(200).json("いいねを押すことに成功しました");
        }
        // もういいねを押している場合
        else {
            await post.updateOne({
                $pull: {
                    likes: req.body.userId,
                },
            });
            return res.status(403).json("投稿からいいねを削除しました");
        }
    } catch (err) {
        return res.status(403).json(err);
    }
})

// プロフィールのタイムラインの投稿を取得する
router.get("/profile/:username", async (req,res) => {
    try {
        const user = await User.findOne({username: req.params.username});
        const userPosts = await Post.find({ userId: user._id });
        return res.status(200).json(userPosts);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// ホームのタイムラインの投稿を取得する
router.get("/timeline/:userId", async (req,res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        // 自分がフォローしている人の投稿すべて
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        return res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
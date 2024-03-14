const router = require("express").Router();
const Img = require("../models/Img");


// 画像保存
router.post("/", async (req,res) => {
    try {
        const newImg = Img({
            base64Data: req.body.base64Data,
            imgName: req.body.imgName || "",
        });
        const savedImg = await newImg.save();
        return res.status(200).json(savedImg);
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router;
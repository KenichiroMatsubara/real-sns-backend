const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const PORT = 3000;
const mongoose = require("mongoose");
require("dotenv").config();

//　データベース接続
mongoose
    .connect(process.env.MONGOURL)
    .then(() => {
        console.log("接続中");
    })
    .catch((err) => {
        console.log(err);
        console.log("接続失敗");
});

// ミドルウェア
app.use(express.json());
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postsRoute);

app.get("/",(req,res)=> {
    res.send("Hello Express");
});

app.listen(PORT, () => console.log("サーバー完了"));
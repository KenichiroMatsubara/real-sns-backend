const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
const imgsRoute = require("./routes/imgs");
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// //デプロイ用
// app.use(express.static(path.resolve(__dirname,"frontend/build")))

// app.get("*",(request,response) => {
//     response.sendFile(path.resolve(__dirname,"../frontend/build"))
// })

// データベース接続
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
app.use("/images",express.static(path.join(__dirname,"public/images")));
app.use(express.json());
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postsRoute);
app.use("/api/upload",uploadRoute);
app.use("/api/imgs",imgsRoute);

app.get("/",(req,res)=> {
    res.send("Hello Express");
});

app.listen(PORT, () => console.log("サーバー完了"));
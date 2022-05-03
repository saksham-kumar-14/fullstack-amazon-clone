const express = require("express");
const app = express();
const mongoose = require("mongoose")
const cors = require("cors");
const jwt = require("jsonwebtoken");

const userModel = require("./models/user");
const productModel = require("./models/product");

//mongodb+srv://Saksham:saksham@cluster0.zirwn.mongodb.net/test
mongoose.connect("mongodb+srv://Saksham:saksham@cluster0.zirwn.mongodb.net/amazon-clone?retryWrites=true&w=majority");

app.use(cors());
app.use(express.json());

app.get("/getUsers", (req,res)=>{
    userModel.find({}, (err,result)=>{
        if(err){
            return res.json(err);
        }else{
            return res.json(result);
        }
    })
});

app.get("/getProducts",  (req,res)=>{
    productModel.find({}, (err,result)=>{
        if(err){
            return res.json(err);
        }else{
            return res.json(result);
        }
    })
});

app.post("/createUser", async(req,res)=>{
    const newUser = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    await newUser.save();
    res.json(newUser);
});

app.post("/login", async(req,res)=>{
    const user = await userModel.findOne({
        email: req.body.email,
        password: req.body.password
    });

    if(user){
        const token = jwt.sign({
            name: user.name,
            cart: user.cart,
            email: user.email
        },"secret");
        return res.json({ status:"ok", user:token });
    }else{
        return res.json({ status:404, user:false })
    }
})

app.get("/api/login", async (req,res)=>{
    const token = req.headers["user-token"];
    
    try{
        const decoded = jwt.decode(token);
        const user = await userModel.findOne({ email: decoded.email });
        if (user) {
            return res.json({ status:"ok" , userExists:true, user:user });
        }else{
            return res.json({ status:404, userExists: false });
        }
    }catch{
        return res.json({ status:404, userExists: false  })
    }
    
});

app.post("/updateUser", async (req,res)=>{

    try{
        let user = await userModel.findOneAndUpdate(
            { email: req.body.email },
            { cart: req.body.cart }
        );
        if(user){
            return res.json({ status:"ok", updated: true });
        }else{
            return res.json({ status:404, updated:false })
        }
    }catch{
        return res.json({ status:404, updated:false })
    }
});

app.post("/deleteUser", (req,res)=>{
    userModel.deleteOne(
        {email: req.body.email}
    ).then(()=>{
        return res.json({ status:"ok", deleted:true });
    }).catch(()=>{
        return res.json({ status:404, deleted:false });
    })
});

app.get("/getProduct", async (req,res)=>{
    const _id= req.headers["product-id"];
    try{
        const product = await productModel.findOne({ _id: _id });
        if(product){
            return res.json({ status:"ok", product:product })
        }else{
            return res.json({ status:404, product:false });
        }
    }catch{
        return res.json({ status:404, product:false });
    }
})


app.listen(3001, ()=>{
    console.log("Server running at http://localhost:3001")
})
const express=require('express')
const app=express()
const path=require('path')
const router=express.Router()

router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname+'/public/'))
})

app.use("/static", express.static('./static/'))

app.use('/',router)
app.listen(5000)
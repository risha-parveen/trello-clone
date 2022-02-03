const { response } = require('express')
const express=require('express')
const mongoose=require('mongoose')
const { collection } = require('./models/schema')
const app=express()

main().catch(err=>console.log(err))
async function main(){
    await mongoose.connect('mongodb://localhost:27017/TrelloDB',{useNewUrlParser:true})
}

const Database=require('./models/schema')

app.use(express.urlencoded({extended:false}))

app.use(express.static('public'))
app.use(express.json())

app.post('/save',async (req,res)=>{
    let result=await Database.find({})
    console.log(result)
    if(result===[]){
        console.log("not empty")
    }
    else{
        console.log("empty")
        const db=new Database({
            id:req.body.id,
            'To Do':[req.body['To Do']],
            'Doing':[req.body['Doing']],
            'Done':[req.body['Done']]
        })
        console.log(db.Done)
        await db.save()
    }
})

app.listen(5000)
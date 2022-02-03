const { response } = require('express')
const express=require('express')
const mongoose=require('mongoose')
const { collection } = require('./models/schema')
const app=express()

mongoose.connect('mongodb://localhost:27017/TrelloDB',{useNewUrlParser:true})


app.use(express.urlencoded({extended:false}))

app.use(express.static('public'))
app.use(express.json())

const Database=require('./models/schema')
//database.loadDatabase()

let dbid=null
let doc=null

app.post('/save',(req,res)=>{
    Database.find({})
    .then(result=>{
        doc=result
        console.log(doc)
    })
    if(doc){
        console.log("not empty")
    }
    else{
        console.log("empty")
        /*Database.insertOne({
            id:req.body.id,
            'To Do':req.body['To Do'],
            'Doing':req.body['Doing'],
            'Done':req.body['Done']
        }).then(result=>console.log(result))*/
    }
})

app.post('/',(req,res)=>{
    const data=req.body
    res.json(data)
})

app.listen(5000)
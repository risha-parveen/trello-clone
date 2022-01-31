const { response } = require('express')
const express=require('express')
const Datastore=require('nedb')
const app=express()

app.use(express.static('public'))
app.use(express.json())

const database=new Datastore('database.db')
database.loadDatabase()

app.get('/api',(req,res)=>{
    database.find({},(err,data)=>{
        if(err){
            res.end()
            return
        }
        res.json(data.slice(-1))
    })
})

app.post('/',(req,res)=>{
    const data=req.body
    database.insert(data)
    res.json(data)
})

app.listen(5000)
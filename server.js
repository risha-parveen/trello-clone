const express=require('express')
const Datastore=require('nedb')
const app=express()

app.use(express.static('public'))
app.use(express.json())

const database=new Datastore('database.db')
database.loadDatabase()

app.post('/',(req,res)=>{
    const data=req.body
    database.insert(data)
    res.json(data)
})

app.listen(5000)
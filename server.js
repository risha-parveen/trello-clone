const { response } = require('express')
const express=require('express')
const mongoose=require('mongoose')
const app=express()

mongoose.connect('mongodb://localhost:27017/TrelloDB',{useNewUrlParser:true})


app.use(express.urlencoded({extended:false}))

app.use(express.static('public'))
app.use(express.json())

const Database=require('./models/schema')
//database.loadDatabase()

const db=new Database()

let dbid=null

app.post('/api',(req,res)=>{
    
    db['To Do']=req.body['To Do']
    db['Doing']=req.body['Doing']
    db['Done']=req.body['Done']
    

    db.save()
    .then(data=>{
        res.json(data)
    })
    .catch(err=>res.json(err))

    dbid=db._id
    console.log(dbid)
})


app.post('/save',(req,res)=>{
    console.log(req.body)
    database.find({_id:'id'},(err,data)=>{
        if(err){
            res.status(500).send({
                success:false
            })
            return 
        }
        if(data.length!==0){
            console.log(data)
            switch(req.body.column){
                case 'To Dp':
                    data['To Do'].push({
                        id:req.body.id,
                        description:req.body.description
                    })
                    break
                case 'Doing':
                    data['Doing'].push({
                        id:req.body.id,
                        description:req.body.description
                    })
                    break
                case 'Done':
                    data['Done'].push({
                        id:req.body.id,
                        description:req.body.description
                    })
                    break
                default:
                    //nothing
            }
            database.update({_id:'id'},data,(err,newDoc)=>{
                console.log('hioioio')
                if(err){
                    res.status(500).send({
                        success:false
                    })
                    return
                }
                res.status(200).send({
                    action:"updated",
                    success:true
                })
            })
        }
        else{
            let new_data={
                _id:'id',
                'To Do':[],
                'Doing':[],
                'Done':[]
            }
            console.log(JSON.stringify(req.body))
            switch(req.body.column){
                case 'To Do':
                    new_data['To Do'].push({
                        id:req.body.id,
                        description:req.body.description
                    })
                    break
                case 'Doing':
                    new_data['Doing'].push({
                        id:req.body.id,
                        description:req.body.description
                    })
                    break
                case 'Done':
                    new_data['Done'].push({
                        id:req.body.id,
                        description:req.body.description
                    })
                    break
                default:
                    //nothing
            }
            database.insert(new_data,(err,newDoc)=>{
                if(err){
                    res.status(500).send({
                        success:true
                    })
                    return
                }
                
                res.status(200).send({
                    action:"inserted",
                    success:true
                })
            })
        }
    })        
})

app.post('/',(req,res)=>{
    const data=req.body
    res.json(data)
})

app.listen(5000)
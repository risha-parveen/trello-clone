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

let result=null

app.post('/save',async (req,res)=>{
    try{
        result=await Database.find({}) 
    }
    catch(error){
        res.status(500).send({
            action:"failed to update",
            success:false
        })
        return
    }
    if(result.length!==0){
        switch(req.body.title){
            case 'To Do':
                result[0]['To Do'].push({
                    cardId:req.body.cardId,
                    description:req.body.description
                })
                break
            case 'Doing':
                result[0]['Doing'].push({
                    cardId:req.body.cardId,
                    description:req.body.description
                })
                break
            case 'Done':
                result[0]['Done'].push({
                    cardId:req.body.cardId,
                    description:req.body.description
                })
                break
            default:
                //nothing
        }
        try{
            console.log(result)
            await Database.replaceOne({id:'id'},result[0],{upsert:true}).then(result=>console.log(result))
            
            res.status(200).send({
                action:"updated",
                success:true
            })
        }catch(error){
            console.log(error)
            res.status(500).send({
                action:"not updated",
                success:false
            })
            return
        }
    }
    else{
        let new_data={
            id:'id',
            'To Do':[],
            'Doing':[],
            'Done':[]
        }
        switch(req.body.title){
            case 'To Do':
                new_data['To Do'].push({
                    cardId:req.body.cardId,
                    description:req.body.description
                })
                break
            case 'Doing':
                new_data['Doing'].push({
                    cardId:req.body.cardId,
                    description:req.body.description
                })
                break
            case 'Done':
                new_data['Done'].push({
                    cardId:req.body.cardId,
                    description:req.body.description
                })
                break
            default:
                //nothing
        }
        try{
            const db=new Database(new_data)
            await db.save()
            res.status(200).send({
                action:"inserted",
                success:true
            })
        }
        catch(error){
            res.status(500).send({
                success:false
            })
        }
        console.log(result)
    }
})

app.listen(5000)
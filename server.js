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

let result,delresult,delId,delTitle=null

app.post('/delete',async (req,res)=>{
    try{
        delresult=await Database.find({})
    }catch(error){
        res.status(500).send({
            action:"failed to delete",
            success:false
        })
    }
    if(delresult.length!==0){
        delId=req.body.cardId
        delTitle=req.body.title
        delDesc=req.body.description
        let i=null
        let array=delresult[0][delTitle]
        let ind=array.findIndex(i=>{
            return (i.cardId===delId && i.description===delDesc)
        })

        if(ind===-1){
            res.status(500).send({
                action:"nothing to delete",
                success:false
            })
            return
        }
        delresult[0][delTitle].splice(ind,1)
        
        try{
            await Database.replaceOne({id:'id'},delresult[0],{upsert:true})
            
            res.status(200).send({
                action:"deleted",
                success:true
            })
        }catch(error){
            console.log(error)
            res.status(500).send({
                action:"could not delete",
                success:false
            })
            return
        }
    }
})

app.post('/save',async (req,res)=>{
    try{
        result=await Database.find({id:req.body.id}) 
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
            await Database.replaceOne({id:'id'},result[0],{upsert:true})
            
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
            id:req.body.id,
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
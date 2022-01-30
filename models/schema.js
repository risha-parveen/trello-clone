const mongoose=require('mongoose')

const trelloSchema= new mongoose.Schema({
    to_do:{
        type:Array,
        required:true 
    },
    doing:{
        type:Array,
        required:true
    },
    done:{
        type:Array,
        required:true
    }
})

module.exports= mongoose.model('Board',trelloSchema)
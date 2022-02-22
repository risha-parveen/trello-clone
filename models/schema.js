const mongoose = require('mongoose')

const schema=mongoose.Schema({
    "username":{
        type:String,
        required:true
    },
    "To Do":{
        type:Array,
        required:true
    },
    "Doing":{
        type:Array,
        required:true
    },
    "Done":{
        type:Array,
        required:true
    }
})

module.exports=mongoose.model('Database',schema)
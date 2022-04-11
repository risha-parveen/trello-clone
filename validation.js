const Joi=require('joi')

const registerValidation=data=>{
    const schema=Joi.object({
        username:Joi.string()
            .min(8)
            .max(30)
            .required(),
        password:Joi.string()
            .min(8)
            .max(30)
            .required()
    })    
    return schema.validate(data)
}


module.exports=registerValidation
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} is not a valid email'
        }
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    image:{
        type:String,
        required:false,
        default:'user.png'
    }
},{
    timestamps:true
});

const SALT_FACTOR = process.env.BCRYPT_PASSWORD_SALT_FACTOR || 10;


// userSchema.path('password').validate(
//     console.log('calling')
// )


userSchema.pre('save',function(done){
    const user = this;
    if(!user.isModified('password'))
        return done();

    bcrypt.genSalt(SALT_FACTOR,(err,salt)=>{
        if(err)
            return done(err);
    
        bcrypt.hash(user.password,salt,(err,hashedPassword)=>
        {
            if(err)
                return done(err);
            user.password = hashedPassword;
            return done();
        });
    });
});

userSchema.pre('updateOne',function(done){
    const user = this.getUpdate();

    bcrypt.genSalt(SALT_FACTOR,(err,salt)=>
    {
        if(err)
            return done(err);
        bcrypt.hash(user.password,salt,(err,hashedPassword)=>
        {
            if(err) return done(err);
            user.password = hashedPassword;
            return done();
        });
    });
});

module.exports = new mongoose.model('User',userSchema,'users');
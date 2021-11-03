const validator = require('validator');
const bcrypt = require('bcrypt');
const ErrorHandler = require('../utils/error-handler');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');
const otpService = require('../services/otp-service');
const mailService = require('../services/mail-service');

class AuthController {

    createUser = async (req,res,next) =>
    {
        const {name,email,username,password} = req.body;
        if(!name,!email,!username,!password) return next(ErrorHandler.badRequest());
    }

    login = async (req,res,next) =>
    {
        const {email,password} = req.body;
        if(!email||!password) return next(ErrorHandler.badRequest());
        let data;
        if(validator.isEmail(email))
            data = {email}
        else
            data = {username:email};
        const user = await userService.findUser(data);
        if(!user) return next(ErrorHandler.notFound('Invalid Email or Username'));
        const {_id,name,username,email:dbEmail,password:hashPassword} = user;
        const isValid = await bcrypt.compare(password,hashPassword);
        if(!isValid) return next(ErrorHandler.unAuthorized('Invalid Password'));
        const payload = {
            _id,
            email,
            username
        }
        const {accessToken,refreshToken} = tokenService.generateToken(payload);
        await tokenService.storeRefreshToken(_id,refreshToken);
        res.cookie('accessToken',accessToken,{
            maxAge:1000*60*60*24*30
        });
        res.cookie('refreshToken',refreshToken,{
            maxAge:1000*60*60*24*30
        })

        res.json({success:true,message:'Login Successfull',user:new UserDto(user)})
    }

    forgot = async (req,res,next) =>
    {
        const {email:requestEmail} = req.body;
        if(!requestEmail) return next(ErrorHandler.badRequest());
        if(!validator.isEmail(requestEmail)) return next(ErrorHandler.badRequest('Inavlid Email Address'));
        const user = await userService.findUser({email:requestEmail});
        if(!user) return next(ErrorHandler.notFound('Invalid Email Address'));
        const {_id:userId,name,email} = user;
        const otp = otpService.generateOtp();
        const type = process.env.TYPE_FORGOT_PASSWORD || 2;
        await otpService.removeOtp(userId);
        await otpService.storeOtp(userId,otp,type);
        await mailService.sendForgotPasswordMail(name,email,otp);
        res.json({success:true,message:'Email has been sent to your email address'});
    }

    reset = async (req,res,next) =>
    {
        const {email,otp,password} = req.body;
        if(!email || !otp || !password)  return next(ErrorHandler.badRequest());
        const user = await userService.findUser({email});
        if(!user) return next(ErrorHandler.notFound('No Account Found'));
        const {_id:userId} = user;
        const type = process.env.TYPE_FORGOT_PASSWORD || 2;
        const response = await otpService.verifyOtp(userId,otp,type);
        console.log(response);
        if(response==='INVALID') return next(ErrorHandler.badRequest('Invalid OTP'));
        if(response==='EXPIRED') return next(ErrorHandler.badRequest('Otp has been Expired'));
        const {modifiedCount} = await userService.updatePassword(userId,password);
        return modifiedCount===1 ? res.json({success:true,message:'Password has been reset successfully'}) : next(ErrorHandler.serverError('Failed to Reset your password'));
    }

    logout = async (req,res,next) =>
    {
        const {refreshToken,accessToken} = req.cookies;
        console.log(refreshToken);
        console.log(accessToken);

    }

    refresh = async (req,res,next) =>
    {
        const {refreshToken:refreshTokenFromCookie} = req.cookies;
        if(!refreshTokenFromCookie) return next(ErrorHandler.unAuthorized());
        const userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
        const {_id,email,username} = userData;
        const token = await tokenService.findRefreshToken(_id,refreshTokenFromCookie);
        if(!token) return next(ErrorHandler.unAuthorized());
        const payload = {
            _id,
            email,
            username
        }
        const {accessToken,refreshToken} = tokenService.generateToken(payload);
        await tokenService.updateRefreshToken(_id,refreshTokenFromCookie,refreshToken);
        const user = await userService.findUser({email});
        res.cookie('accessToken',accessToken,{
            maxAge:1000*60*60*24*30
        })
        res.cookie('refreshToken',refreshToken,{
            maxAge:1000*60*60*24*30
        })
        res.json({success:true,message:'Login Successfull',user:new UserDto(user)})
    }

    demo = async (req,res,next) =>
    {
        const {refreshToken} = req.cookies;
        const{_id:userId} = tokenService.verifyRefreshToken(refreshToken);
        const token = await tokenService.findRefreshToken(userId,refreshToken);
        res.json(token)
    }

}

module.exports = new AuthController();
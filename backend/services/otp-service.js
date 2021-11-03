const crypto = require('crypto');
const OtpModel = require('../models/otp-model');

class OtpService {

    generateOtp = () =>
    {
        return crypto.randomInt(100000,999999);
    }

    storeOtp = async (userId,otp,type) =>
    {
        return await OtpModel.create({userId,otp,type});
    }

    removeOtp = async (userId) =>
    {
        return await OtpModel.deleteOne({userId});
    }

    verifyOtp = async (userId,otp,type) =>
    {
        const otpData = await OtpModel.findOne({userId,otp,type});
        if(otpData)
        {
            console.log(otpData.expire<Date.now());
            console.log(otpData.expire);
            console.log(Date.now());
            // this.removeOtp(userId);
            return true;
        }
        else
            return false
    }   

}

module.exports = new OtpService();
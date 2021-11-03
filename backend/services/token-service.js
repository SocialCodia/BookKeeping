const jwt = require('jsonwebtoken');
const TokenModel = require('../models/token-model');
const accessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY || '9d50ebd75b8eb1b6d754f95695b04aff86562f9a2dc9992ef574d82eceae20207a94a878c32563c602837c72ba9475867744c524b2cc90f2d2311bda0188cad7'
const refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY || '16ed5545a82006b2ce13b8c5a7f899d9c2eb72ef45872ce356039d9da53ef4988a9a77aaae9729d3094588aa41ab0ab9b34115eaa9531d775b4019fb2005385d'
class TokenService {

    generateToken = (payload) =>
    {
        const accessToken = jwt.sign(payload,accessTokenSecretKey,{
            expiresIn:'10s'
        });
        const refreshToken = jwt.sign(payload,refreshTokenSecretKey,{
            expiresIn:'1y'
        });
        return {accessToken,refreshToken};
    }

    storeRefreshToken = async (userId,token) =>
    {
        
        const tokens = {token}
        const isExist = await TokenModel.exists({userId})
        console.log(isExist);
        console.log(tokens);
        if(!isExist)
            return await TokenModel.create({userId,tokens})
        else
            return await TokenModel.findOneAndUpdate({userId},{$push:{tokens}});
        
    }

    verifyRefreshToken =  (refreshToken) =>
    {
        return jwt.verify(refreshToken,refreshTokenSecretKey);
    }

    findRefreshToken = async (userId,token) =>
    {
        const tokens = {token}
        console.log({tokens});
        return await TokenModel.findOne({userId,'tokens.token':token});
        // console.log(a);
        // return await TokenModel.findOne({userId,tokens});
    }

}

module.exports = new TokenService();
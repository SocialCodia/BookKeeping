// const tokenService = require('../services/token-service');
// const ErrorHandler = require('../utils/error-handler');
// const {TokenExpiredError} = require('jsonwebtoken');
// const auth = async (req,res,next) =>
// {
//     const {accessToken:accessTokenFromCookie,refereshToken:refereshTokenFromCookie}  = req.cookies;
//     try{
//         if(!accessTokenFromCookie)
//             return next(new ErrorHandler('Missing Access Token',401))
//         const userData = await tokenService.verifyAccessToken(accessTokenFromCookie);
//         if(!userData)
//             throw new Error(new ErrorHandler('Unauthorized Access',401));
//         req.user= userData;
//     }
//     catch(e)
//     {
//         if(e instanceof TokenExpiredError)
//         {
//             if(!refereshTokenFromCookie) return next(new ErrorHandler('Access Token Expired, No Referesh Token Provided To Generate The Access Token Again',401))
//             const userData = await tokenService.verifyRefereshToken(refereshTokenFromCookie);
//             const token = await tokenService.findRefereshToken(userData._id,refereshTokenFromCookie);
//             if(!token) return next(new ErrorHandler('Access Token Expired, Referesh Token Is Also Not Valid',401));
//             const payload = {
//                 _id:userData._id,
//                 userType:userData.userType
//             }
//             const {accessToken,refereshToken} = await tokenService.generateToken(payload);
//             await tokenService.updateRefereshToken(userData._id,refereshToken);
//             req.user = userData;
//             res.cookie('accessToken',accessToken,{
//                 maxAge:1000*60*60*24*30
//             })
//             res.cookie('refereshToken',refereshToken,{
//                 maxAge:1000*60*60*24*30
//             })
//             return next();
//         }
//         else
//             return next(new ErrorHandler('Unauthorized Access',401))
//     }
//     next();
// }


// module.exports ={
//     auth
// }
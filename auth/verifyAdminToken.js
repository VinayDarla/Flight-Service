const {verify} = require('jsonwebtoken')

module.exports = {

    checkAdminToken : (req,res, next) => {

        //const token values can't be changed
        let token = req.get("authorization");
        if(token){
            token = token.slice(7);
            verify(token, process.env.JWT_ALGO, (error,decoded) =>{
                if(error){
                    res.json({
                        success:0,
                        message:"Invalid token/expired"
                    })
                }
                if(decoded.role=="User"){
                    res.json({
                        success:0,
                        message:"Users are not authorized to access this routes"
                    })
                    
                }
                else{
                    next();
                }
                
            })
        }
        else{
            res.json({
                success:0,
                message:"Unauthorizated Admin/User detected"
            })
        }
    },

  
    checkUserToken : (req,res, next) => {

        //const token values can't be changed
        let token = req.get("authorization");
        if(token){
            token = token.slice(7);
            verify(token, process.env.JWT_ALGO, (error,decoded) =>{
                if(error){
                    res.json({
                        success:0,
                        message:"Invalid token/expired"
                    })
                }
                if(decoded.role=="Admin"){
                    res.json({
                        success:0,
                        message:"Admin is not authorized to access this routes"
                    })
                    
                }

                else{
                    next();
                }
            })
        }
        else{
            res.json({
                success:0,
                message:"Unauthorizated Admin/User detected"
            })
        }
    }
}

var jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    
      let token = req.headers["authorization"];
      
        if (!token)
            return res.status(401).send({ message: "No token provided!" });
    
        let bearer = token.split(" ");
        
        if (bearer.length !== 2) 
            return res.status(402).send({ message: "Bearer token malformed!" });
        
        if (bearer[0] !== "Bearer") 
            return res.status(404).send({ message: "Bearer token malformed!" });
        
        let bearerToken = bearer[1];
    
        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
          
          if (err) {
            return res.status(401).send({ message: "Unauthorised", error: "Token not verified!", success: false });
          }
            
          req.tenantId = decoded.tenantId;
          req.tenant = decoded.tenant;
          req.username = decoded.username;
          req.superadmin = decoded.superadmin ? true : false;
            
          
        next();
      });
    };

module.exports = { verifyToken };
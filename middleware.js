const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    // let token = req.cookies.authToken ;
  
    // if (token) {
    //   jwt.verify(token, jwtSecret, (err, decodedToken) => {
    //     if (err) {
    //       console.log(err);
    //       return res.status(401).json({ message: "Not authorized" })
    //     } else {  
    //       req.id = decodedToken.id;
    //       return  next();
    //     }
    //   })
    // } else {
    //   return res
    //     .status(401)
    //     .json({ message: "Not authenticated, token not available" })
    // }
  }
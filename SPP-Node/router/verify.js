const jwt = require("jsonwebtoken")

//let secretKey = "SPP"
let secretKey1 = "petugasSPP"
let secretKey2 = "siswaSPP"

auth_verify = (req, res, next) => {
  // get jwt from header
  let header = req.headers.authorization
  let token = null

  if (header != null) {
    // get token from second side
    token = header.split(" ")[1]
  }

  if (token == null) {
    res.json({
      message: "unauthorized"
    })
  } else {
    // jwt
    let jwtHeader = {
      algorithm: "HS256"
    }



    //verify token 
    jwt.verify(token, secretKey1, jwtHeader, err => {
      if (err) {
        jwt.verify(token, secretKey2, jwtHeader, err => {
          if (err) {
            res.json({
              message: "Invalid or expired token",
              Token: token
            })
          } else {
            next()
          }
        })
      } else {
        next()
      }
    })
  }
}
//Role
accessLimit = (roles) => {

  return (req, res, next) => {
    // get jwt from header
    let header = req.headers.authorization
    let token = null

    if (header != null) {
      // get token from second side
      token = header.split(" ")[1]
    }
    try {
      const roleToken = jwt.verify(token, secretKey1, { complete: true })
      let allowed = false

      for (x of roles) {
        if (x == roleToken.payload.level) {
          allowed = true;
        }
      }
      if (allowed) {
        next()
      } else {
        res.json({
          message: "Unauthorized, You are not alllowed to do this method"
        })
      }
    } catch (err) {
      console.log(err)
      res.json({
        message: "You are not an administrator"
      })
    }


  }
}


module.exports = {
  auth_verify,
  accessLimit
}
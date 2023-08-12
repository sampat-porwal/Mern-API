import jwt from 'jsonwebtoken'
import ParentModel from '../models/Parent.js'
var checkUserAuth = async (req, res, next) => {
          let token
          const { authorization } = req.headers
          if (authorization && authorization.startsWith('Bearer')) {
                  try {
                        
                        token = authorization.split(' ')[1]                       
                        const { parentID } = jwt.verify(token, process.env.JWT_SECRET_KEY)
                        req.parent = await ParentModel.findById(parentID).select('-password')
                        next()
                  } catch (error) {
                          console.log(error)
                          res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
                    }
                }
                if (!token) {
                  res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
          }
}

export default checkUserAuth
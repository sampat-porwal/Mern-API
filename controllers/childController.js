import ParentModel from '../models/Parent.js'
import ChildModel from '../models/childModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
class ChildController {
      static CreateChild = async (req, res) => {
                    const { name, age, gender } = req.body  
                    const userId = req.parent._id 
                      if (name && gender &&  age) {        
                          try {           
                            const newChild  = new ChildModel({
                                name: name,
                                gender: gender,
                                age:age,
                                userId: userId
                              })
                            await newChild .save()           
                            res.status(201).send({ "status": "success", "message": "Add Child Success"})
                          } catch (error) {
                            console.log(error)
                            res.send({ "status": "failed", "message": "Unable to Add Child",error:error })
                          }
                      
                    }
          }

          static getChilds = async (req, res) => {    
                  const parentID = req.parent._id
                  console.log("parentID")
                  console.log(parentID)    
                  const ownchild = await ChildModel.find({"userId":parentID,"isDelete":false})
                  if (ownchild != null){
                    res.send({ "status": "success", "message": "All chilod of this parrent",child:ownchild })
                  }
                  else{
                    res.send({ "status": "Faild", "message": "this Parrent not have any child"})
                  }
          }
          
          static getChild = async (req, res) => {
                  const parentID = req.parent._id                 
                  const id = req.params.id;
                  console.log("parentID")
                  console.log(parentID)
                  const ownchild = await ChildModel.findOne({"userId":parentID,"_id":id,"isDelete":false})
                  if (ownchild != null){
                    res.send({ "status": "success", child:ownchild })
                  }
                  else{
                    res.send({ "status": "Faild", "message": "this Parrent not have  child with this id"})
                  }
          }

          static softDeleteChild = async (req, res) => {
                  const id = req.params.id;
                  const parentID = req.parent._id
                  const ownchild = await ChildModel.findOne({"userId":parentID,"_id":id,"isDelete":false})                  
                  if (ownchild != null){
                          try{
                              const child =  await ChildModel.findByIdAndUpdate(id, { $set: { isDelete: true} })                            
                              res.send({ "status": "success", "message": "child deleted succesfully",child:child })
                            }
                          catch {
                            res.send({ "status": "failed", "message": "Something wrong validation" })
                          }
                        }
                        else{
                          res.send({ "status": "failed", "message": "this user is not your so you cant permited" })
                        }
            }

    
            static updateChild = async (req, res) => {
                    const id = req.params.id;
                    const parentID = req.parent._id
                    const { name, age, gender } = req.body
                    const newValue = { name:name, age:age, gender:gender }
                    const ownchild = await ChildModel.findOne({"userId":parentID,"_id":id,"isDelete":false})
                    if (ownchild != null){
                            try{
                                const child =  await ChildModel.findByIdAndUpdate(id, { $set: newValue })             
                                res.send({ "status": "success", "message": "child updated succesfully",child:child })
                              }
                            catch {
                              res.send({ "status": "failed", "message": "Something wrong validation" })
                            }
                          }
                          else{
                            res.send({ "status": "failed", "message": "this user is not your so you cant permited" })
                          }
              }

}

export default ChildController
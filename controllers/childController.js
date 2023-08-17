import ParentModel from '../models/Parent.js'
import ChildModel from '../models/childModel.js'
import multer from  'multer'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Define the destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded image
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage });

class ChildController {
 
  

      static CreateChild = async (req, res) => {
        console.log("req.body");
        console.log(req);
                    const { name, age, gender } = req.body  
                    const userId = req.parent._id 
                    const ownchild = await ChildModel.find({"userId":userId,"isDelete":false})
                    console.log("ownchild");
                    console.log(ownchild);
                    console.log(ownchild.length);
                    if(ownchild.length >=3){   
                      res.send({ "status": "failed", "message": "User can't  Add more then three Childs. " })
                    }
                    else{
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
                          else{
                            res.send({ "status": "failed", "message": "Something is missing. Please enter all fields." })
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


              static imageupload = async (req, res) => {
                console.log(req)
                try {
                  const config = multer.diskStorage({
                    destination: (req, file, callback) => {
                      callback(null, "./uploads/child");
                    },
                    filename: (req, file, callback) => {
                      callback(null, `image-${Date.now()}.${file.originalname}`);
                    },
                  });
            
                  const isimage = (req, file, callback) => {
                    if (file.mimetype.startsWith("image")) {
                      callback(null, true);
                    } else {
                      callback(new Error("only images allowed"));
                    }
                  };
            
                  const upload = multer({
                    storage: config,
                    fileFilter: isimage,
                  }).single("photo");
            
                  upload(req, res, async (err) => {
                    if (err instanceof multer.MulterError) {
                      return res.status(400).json({ message: "Error uploading file" });
                    } else if (err) {
                      return res.status(400).json({ message: err.message });
                    }
            
                    if (!req.file) {
                      return res.status(400).json({ message: "No image file provided" });
                    }
            
                    const imageUrl = req.file.path;

                    const id = req.params.id;
                    const parentID = req.parent._id
                    
                    const newValue = { image:imageUrl }
                    const ownchild = await ChildModel.findOne({"userId":parentID,"_id":id,"isDelete":false})
                    if (ownchild != null){
                            try{
                                const child =  await ChildModel.findByIdAndUpdate(id, { $set: newValue })             
                                res.send({ "status": "success", "message": "child Profile  updated succesfully",child:child })
                              }
                            catch {
                              res.send({ "status": "failed", "message": "Something wrong validation" })
                            }
                          }
                          else{
                            res.send({ "status": "failed", "message": "this user is not your so you cant permited" })
                          }

                    // Save the imageUrl to the database or perform any other actions here
                   // res.status(200).json({ imageUrl });
                  });
                } catch (error) {
                  console.error(error);
                  res.status(500).json({ message: "Server error" });
                }
              };

}

export default ChildController
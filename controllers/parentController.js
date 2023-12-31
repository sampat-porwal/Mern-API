import ParentModel from '../models/Parent.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from  'multer'
class ParentController {
          static ParentRegistration = async (req, res) => {
                  const { name, username, password, password_confirmation, age } = req.body
                  const parent = await ParentModel.findOne({ username: username })
                  if (parent) {
                    res.send({ "status": "failed", "message": "Username already exists" })
                  } else {
                    if (name && username && password && password_confirmation && age) {
                      if (password === password_confirmation) {
                        try {
                          const salt = await bcrypt.genSalt(10)
                          const hashPassword = await bcrypt.hash(password, salt)
                          const doc = new ParentModel({
                            name: name,
                            username: username,
                            age:age,
                            password: hashPassword
                          })
                          await doc.save()
                          const saved_parent = await ParentModel.findOne({ username: username })
                          // Generate JWT Token
                          const token = jwt.sign({ parentID: saved_parent._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                          res.status(201).send({ "status": "success", "message": "Registration Success", "token": token })
                        } catch (error) {
                          console.log(error)
                          res.send({ "status": "failed", "message": "Unable to Register",error:error })
                        }
                      } else {
                        res.send({ "status": "failed", "message": "Password and Confirm Password doesn't match" })
                      }
                    } else {
                      res.send({ "status": "failed", "message": "All fields are required" })
                    }
                  }
            }

            static parentLogin = async (req, res) => {
                  try {
                    const { username, password } = req.body
                    if (username && password) {
                      const parent = await ParentModel.findOne({ username: username })
                      if (parent != null) {
                        const isMatch = await bcrypt.compare(password, parent.password)
                        if ((parent.username === username) && isMatch) {
                          // Generate JWT Token
                          const token = jwt.sign({ parentID: parent._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                          res.send({ "status": "success", "message": "Login Success", "token": token })
                        } else {
                          res.send({ "status": "failed", "message": "Email or Password is not Valid" })
                        }
                      } else {
                        res.send({ "status": "failed", "message": "You are not a Registered User" })
                      }
                    } else {
                      res.send({ "status": "failed", "message": "All Fields are Required" })
                    }
                  } catch (error) {
                    console.log(error)
                    res.send({ "status": "failed", "message": "Unable to Login" })
                  }
            }

      static changeParentPassword = async (req, res) => {
                const { password, password_confirmation } = req.body
                if (password && password_confirmation) {
                  if (password !== password_confirmation) {
                    res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
                  } else {
                    const salt = await bcrypt.genSalt(10)
                    const newHashPassword = await bcrypt.hash(password, salt)
                    await ParentModel.findByIdAndUpdate(req.parent._id, { $set: { password: newHashPassword } })
                    res.send({ "status": "success", "message": "Password changed succesfully" })
                  }
                } else {
                  res.send({ "status": "failed", "message": "All Fields are Required" })
                }
        }


        static changeParentProfile = async (req, res) => {
                const { name, age } = req.body
                try{
                    await ParentModel.findByIdAndUpdate(req.parent._id, { $set: { name: name, age:age} })
                    res.send({ "status": "success", "message": "Profile changed succesfully" })
                  }
                catch {
                  res.send({ "status": "failed", "message": "Something wrong validation" })
                }
          }

          static imageupload = async (req, res) => {
            console.log(req)
            try {
              const config = multer.diskStorage({
                destination: (req, file, callback) => {
                  callback(null, "./uploads/parent");
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

                // const id = req.params.id;
                // const parentID = req.parent._id
                const newValue = { image:imageUrl }
                
                try{
                  await ParentModel.findByIdAndUpdate(req.parent._id, { $set: newValue })
                  res.send({ "status": "success", "message": "Profile changed succesfully" })
                }
              catch {
                res.send({ "status": "failed", "message": "Something wrong validation" })
              }

                // Save the imageUrl to the database or perform any other actions here
                res.status(200).json({ imageUrl });
              });
            } catch (error) {
              console.error(error);
              res.status(500).json({ message: "Server error" });
            }
          };


}

export default ParentController
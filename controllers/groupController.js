import ParentModel from '../models/Parent.js'
import GroupModel from '../models/group.js'
import GroupChatModel from '../models/groupchat.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class groupController {
        static CreateGroup = async (req, res) => {
                const userId = req.parent._id 
                console.log("req.body");
                console.log("memberList");
                const { groupname,memberList} = req.body  
                console.log(memberList);
                let counter = 0
                let member = [userId]
                while(counter < memberList.length) {
                   // if (userId != memberList[counter] ){
                        const parent = await ParentModel.findById(memberList[counter] )
                            if (parent) {
                                if (!member.includes(memberList[counter])) {
                                        member.push(memberList[counter])
                                        console.log(memberList[counter])
                                        }
                            }
                    // }
                    counter++
                }
                // console.log("member");
                // console.log(member);                
                const group = await GroupModel.findOne({ groupname: groupname })
                if (group) {
                    res.send({ "status": "failed", "message": "this gruup name already exists" })
                  } else {
                            if (groupname ) {        
                                try {           
                                  const newGroup  = new GroupModel({
                                    groupname: groupname, 
                                    memberList:member,                                    
                                    createdbyid: userId
                                    })
                                  await newGroup.save()           
                                  res.status(201).send({ "status": "success", "message": "Group created  Success"})
                                } catch (error) {
                                  console.log(error)
                                  res.send({ "status": "failed", "message": "Unable to Group create",error:error })
                                }
                            
                          }
                          else{
                            res.send({ "status": "failed", "message": "Something is missing. Please enter group Name." })
                          }
                        }

          }

          static sendMsgGroup = async (req, res) => {
            const userId = req.parent._id 
            const id = req.params.id;                  
            const group = await GroupModel.findById(id)
            console.log("group");
            const { chatvalue} = req.body  
            const chatval = JSON.stringify(chatvalue);
            console.log(group);
            let counter = 0
            let member = [userId]
            const groupMem = group.memberList
            if (groupMem.includes(userId)) {
                try {           
                    const newGroupChat  = new GroupChatModel({
                            chatvalue: chatval,
                            groupid:id,                                                         
                            msgbyid: userId
                        })
                    await newGroupChat.save()           
                    res.status(201).send({ "status": "success", "message": "Group Chat Success"})
                  } catch (error) {
                    console.log(error)
                    res.send({ "status": "failed", "message": "Unable to Group Chat",error:error })
                  }           
            }  
            else{
                res.status(201).send({ "status": "Failed", "message": "Message can not send in this group"})
            }         
             
           

      }

      static getMsgGroup = async (req, res) => {
        const userId = req.parent._id 
        const id = req.params.id;                  
        const group = await GroupModel.findById(id)
        console.log("group");        
        console.log(group);
       
        let member = [userId]
        const groupMem = group.memberList
        if (groupMem.includes(userId)) {
            try {   
                const GroupChat = await GroupChatModel.find({"groupid":id})
                if (GroupChat != null){
                  res.send({ "status": "success", GroupChat:GroupChat })
                }
                else{
                  res.send({ "status": "Faild", "message": "no chat available"})
                }         
                        
            
              } catch (error) {
                console.log(error)
                res.send({ "status": "failed", "message": "Unable to get Group Chat",error:error })
              }           
        }  
        else{
            res.status(201).send({ "status": "Failed", "message": "Message can not read from this group"})
        }         
         
       

  }

          static getChilds = async (req, res) => {    
       

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


}

export default groupController
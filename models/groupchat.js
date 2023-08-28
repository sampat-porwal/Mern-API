import mongoose from "mongoose";

const groupchatSchema = new mongoose.Schema({
  chatvalue: {
    type: String,
    required: true   
  },
  chatat: {
    // type: Date,
    type: Number,
    default: Date.now
  },  
  msgbyid: {
    type: mongoose.Schema.Types.ObjectId,   
    ref: 'ParentModel',  
    required: true,
  },
  groupid: {
    type: mongoose.Schema.Types.ObjectId,   
    ref: 'GroupModel',  
    required: true,
  },
});

const GroupChatModel = mongoose.model('GroupChat', groupchatSchema);

export default GroupChatModel; 

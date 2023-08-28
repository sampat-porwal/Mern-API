import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  groupname: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9,' ']+$/,
  },
  createdat: {
    // type: Date,
    type: Number,
    default: Date.now
  },
  memberList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParentModel' 
  }],
  createdbyid: {
    type: mongoose.Schema.Types.ObjectId,   
    ref: 'ParentModel',  
    required: true,
  },
});

const GroupModel = mongoose.model('Group', groupSchema);

export default GroupModel; 

import mongoose from "mongoose";

const childSchema = new mongoose.Schema({
          name: {
            type: String,
            required: true,
          },
          image: {
            type: String            
          },
          
          age: {
            type: Number,
            required: true,
            min: 0,
          },
          gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            required: true,
          },

          userId: {
            type: mongoose.Schema.Types.ObjectId,   
            ref: 'ParentModel',  
            required: true,
          },  
              isDelete: {
                    type: Boolean,
                    required: true,
                    default: false,
                    validate: {
                      validator: function (v) {
                        return v === true || v === false;
                      },
                      message: 'isDelete must be either true or false',
                    },
              },
});

const ChildModel = mongoose.model('Child', childSchema);

export default ChildModel; 

import mongoose  from 'mongoose'

const eventSchema=new mongoose.Schema({
      content:{type:String, required:true },
      orgId: { type: mongoose.Schema.Types.ObjectId, required: true },
      senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
      createdAt: { type: Date, default: Date.now },
      setreminder:{type:Date,default:Date.now}

})

export default mongoose.model('event', eventSchema)
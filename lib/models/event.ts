import mongoose, { Schema, Document } from 'mongoose'

export interface IEvent extends Document {
  userId: string
  title: string
  description?: string
  start: Date
  end?: Date
  category: 'meeting' | 'deadline' | 'milestone' | 'review' | 'sprint' | 'personal'
  reminderTime: number 
  backgroundColor: string
  borderColor: string
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<IEvent>(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    start: {
      type: Date,
      required: true,
      index: true
    },
    end: {
      type: Date
    },
    category: {
      type: String,
      enum: ['meeting', 'deadline', 'milestone', 'review', 'sprint', 'personal'],
      default: 'meeting'
    },
    reminderTime: {
      type: Number,
      default: 30,
      min: 0
    },
    backgroundColor: {
      type: String,
      default: '#3b82f6'
    },
    borderColor: {
      type: String,
      default: '#2563eb'
    }
  },
  {
    timestamps: true
  }
)

// Index for efficient querying
EventSchema.index({ userId: 1, start: 1 })

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema)
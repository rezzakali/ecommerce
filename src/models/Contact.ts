import mongoose, { Document, model, Schema } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    message: { type: String, unique: true, maxlength: 300 },
  },
  { timestamps: true }
);

export default mongoose.models.Contact ||
  model<IContact>('Contact', ContactSchema);

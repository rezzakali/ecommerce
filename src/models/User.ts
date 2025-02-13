import mongoose, { Document, model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  address?: string;
  role: 'Customer' | 'Admin';
  authProvider: 'Google' | 'Email';
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    role: { type: String, enum: ['Customer', 'Admin'], default: 'Customer' },
    authProvider: { type: String, enum: ['Google', 'Email'], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || model<IUser>('User', UserSchema);

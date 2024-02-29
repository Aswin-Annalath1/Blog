import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  password: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true, min: 4, unique: true },
  password: { type: String, required: true },
});

userSchema.pre<IUser>('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next((error as Error));
  }
});

userSchema.statics.login = async function (username: string, password: string): Promise<IUser | null> {
  try {
    const user = await this.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Incorrect password');
    }
    return user;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const User = mongoose.model<IUser>('User', userSchema);


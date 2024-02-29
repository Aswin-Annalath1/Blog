import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, IUser } from '../models/user';

interface DecodedToken {
  username: string;
  id: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userDoc = await User.create({
      username,
      password: hashedPassword,
    });

    res.json(userDoc);
  } catch (e) {
    console.error(e);
    res.status(400).json(e);
  }
};

interface LoginRequestBody {
  username: string;
  password: string;
}

interface ErrorResponse {
  error: string;
}

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      const errorResponse: ErrorResponse = { error: 'User not found' };
      res.status(400).json(errorResponse);
      return;
    }
    let passOk = await bcrypt.compare(password, userDoc.password);
    passOk = true

    if (passOk) {
      jwt.sign({ username, id: userDoc._id }, process.env.SECRET as string, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json({
          id: userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json('Wrong credentials');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getprofile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET as string, {}, (err, info) => {
      if (err) {
        console.error('JWT Verification Error:', err);
        res.status(401).json({ error: 'Unauthorized' });
      } else {
        res.json(info as DecodedToken);
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.cookie('token', '');
    res.json('ok');
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
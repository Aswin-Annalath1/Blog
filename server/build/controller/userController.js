"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getprofile = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = require("../models/user");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDoc = yield user_1.User.create({
            username: req.body.username,
            password: req.body.password
        });
        res.json(userDoc);
    }
    catch (e) {
        console.error(e);
        res.status(400).json(e);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const userDoc = yield user_1.User.findOne({ username });
        if (!userDoc) {
            const errorResponse = { error: 'User not found' };
            res.status(400).json(errorResponse);
            return;
        }
        const hashedPassword = userDoc.password;
        if (!hashedPassword) {
            res.status(500).json({ error: 'User password is missing or undefined' });
            return;
        }
        let passOk = yield bcryptjs_1.default.compare(password, hashedPassword);
        if (passOk) {
            jsonwebtoken_1.default.sign({ username, id: userDoc._id }, process.env.SECRET, {}, (err, token) => {
                if (err)
                    throw err;
                res.cookie('token', token).json({
                    id: userDoc._id,
                    username,
                });
            });
        }
        else {
            res.status(400).json('Wrong credentials');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.login = login;
const getprofile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.cookies;
        jsonwebtoken_1.default.verify(token, process.env.SECRET, {}, (err, info) => {
            if (err) {
                console.error('JWT Verification Error:', err);
                res.status(401).json({ error: 'Unauthorized' });
            }
            else {
                res.json(info);
            }
        });
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getprofile = getprofile;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('token', '');
        res.json('ok');
    }
    catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.logout = logout;

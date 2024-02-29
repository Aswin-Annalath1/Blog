"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userroute_1 = __importDefault(require("./userroute"));
const postroute_1 = __importDefault(require("./postroute"));
const router = (0, express_1.Router)();
router.use("/users", userroute_1.default);
router.use("/blog", postroute_1.default);
exports.default = router;

import * as AC from "./auth.controller.js"
import { Router } from "express";

const userRoutes = Router()

userRoutes.post('/auth',AC.register)


export default userRoutes
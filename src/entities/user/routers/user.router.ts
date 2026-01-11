import {Router} from "express";
import {getUserListHandler} from "../handlers/get-user-list.handler";


export const userRouter = Router({})


userRouter
    .get('',getUserListHandler)
    .post('',)


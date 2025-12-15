import express, {Express,Request,Response} from "express";


export  const setupApp = (app:Express) => {
    app.use(express.json());

    app.get('/' , (_req:Request, res:Response) =>{
        res.sendStatus(200);
    })

}
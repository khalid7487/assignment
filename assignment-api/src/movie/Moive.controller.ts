import {Request, Response, Router} from "express";
import auth from "../middleware/auth";
import { AddMovie } from "./Movie.service";



const router = Router()

//add movie by admin
router.post('/uploads', auth, async (req:any , res: Response) => {
   
    await AddMovie(req, res)
})

export default router;

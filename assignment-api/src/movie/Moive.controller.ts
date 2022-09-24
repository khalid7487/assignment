import { Request, Response, Router } from "express";
import auth from "../middleware/auth";
import { AddMovie, DeleteMovieById, GetAllMovies, GetMovieById, UpdateMovies } from "./Movie.service";



const router = Router()

//add movie by admin
router.post('/uploads', auth, async (req: any, res: Response) => {

    await AddMovie(req, res)
})

// get-all movie list 
router.get('/get-all', auth, async (req: Request, res: Response) => {
    await GetAllMovies(req, res);
})


//get one by id
router.get('/get/:movieId', auth, async (req: Request, res: Response) => {
    await GetMovieById(req, res)
})

//delete by id
router.delete('/delete/:movieId', auth, async (req: Request, res: Response) => {
    await DeleteMovieById(req, res);
})


//update movie
router.put('/update-movie/:movieId', auth, async (req: any, res: Response) => {
    await UpdateMovies(req, res);
})


export default router;

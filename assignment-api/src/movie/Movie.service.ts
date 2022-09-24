import { validate } from "class-validator"
import path from "path";
import { ILike } from "typeorm";
import { RemoveSpecialCharacterFromString } from "../commons/Utils";
import { Movie } from "./Movie.entity";
import fs from 'fs'


export const AddMovie = async (req, res) => {

    // Validate date
    let errors: any = {}

    let { name, category, title, description } = req.body;

    if (!res.locals.roles.includes('ADMIN')) {
        res.status(400).json({ message: 'You are not allow to post movie.' });
    }

    const titleForFolderName = RemoveSpecialCharacterFromString(name)


    let video_link_fileName = "";

    if (req.files) {
        let { video_link } = req.files;

        if (video_link) {
            video_link_fileName = `${res.locals.user.phone}/movies/${titleForFolderName}${path.extname(video_link.name)}`;
            video_link.mv(`./uploads/${video_link_fileName}`);
        }
    }

    try {
        const movie = new Movie({
            name,
            category,
            title,
            description,
            video_link: video_link_fileName
        });

        //validation
        errors = await validate(movie)
        if (errors.length > 0) return res.status(400).json({ errors })

        await movie.save()

        return res.status(201).json(movie);

    } catch (err) {
        return res.status(500).json(err)
    }

}

export const GetAllMovies = async (req, res) => {

    try {
        const { name } = req.body;

        let filter = [];

        if (name) filter = [...filter,
        {
            name: ILike(`%${name}%`)
        }]

        const limit = req.body.limit || 10
        const page = req.body.page || 1;
        const offset = (page - 1) * limit;

        let [result, total] = await Movie.findAndCount({
            where: filter,
            order: {
                id: "DESC"
            },
            skip: offset,
            take: limit
        });

        const data = {
            data: result,
            count: total,
            totalPage: Math.ceil(total / limit),
            limit: limit,
            page: page
        }

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export const UpdateMovies = async (req, res) => {

    try {
        let { movieId } = req.params;

        let errors: any = {}

        const {
            name,
            category,
            title,
            description
        } = req.body

        if (!res.locals.roles.includes('ADMIN')) {
            res.status(400).json({ message: 'You are not allow to post movie.' });
        }

        const movieInfo = await Movie.findOne({ id: movieId });

        if (!movieInfo) errors.course = 'Movie does not exists';


        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors })
        }

        const titleForFolderName = RemoveSpecialCharacterFromString(movieInfo?.name)

        let video_link_fileName = "";

        if (req.files) {

            let {
                video_link
            } = req.files

            if (video_link) {
                video_link_fileName = `${res.locals.user.phone}/movies/${titleForFolderName}${path.extname(video_link.name)}`;
                if (movieInfo.video_link) {
                    fs.unlinkSync(`./uploads/${movieInfo.video_link}`);
                }
                video_link.mv(`./uploads/${video_link_fileName}`)
            }

        }


        movieInfo.name = name || movieInfo.name
        movieInfo.category = category || movieInfo.category
        movieInfo.title = title || movieInfo.title
        movieInfo.description = description || movieInfo.description

        //update photos
        movieInfo.video_link = video_link_fileName || movieInfo.video_link

        await movieInfo.save()

        return res.status(200).json(movieInfo)


    } catch (err) {

        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export const GetMovieById = async (req, res) => {

    try {
        let { movieId } = req.params;

        const movieInfo = await Movie.findOne({ id: movieId });

        return res.status(200).json(movieInfo)

    } catch (err) {
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export const DeleteMovieById = async (req, res) => {
    const id = req.params.movieId;
    try {

        const movie = await Movie.findOneOrFail({ id: id });

        if (movie.video_link) {
            fs.unlinkSync(`./uploads/${movie.video_link}`);
        }

        await movie.remove();

        return res.status(200).json({ message: 'Moive deleted successfully' })

    } catch (err) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
}
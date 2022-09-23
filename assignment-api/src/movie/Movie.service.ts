import { validate } from "class-validator"
import path from "path";
import { ILike } from "typeorm";
import { RemoveSpecialCharacterFromString } from "../commons/Utils";
import { Movie } from "./Movie.entity";



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


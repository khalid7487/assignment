import { validate } from "class-validator"



export const AddMovie = async (req, res) => {
    // Validate date
    let errors: any = {}
    console.log("test" ,  res.locals.roles, "response id ");

    let { name, category, title, description,video_link  } = req.body;
    
    if(!res.locals.roles.includes('ADMIN')){
        res.status(400).json({ message: 'You are not allow to post movie.' });
    }



    const movie ={}
     //validation
     errors = await validate(movie)
     if (errors.length > 0) return res.status(400).json({ errors })

    // let vehicle = req.body

    // const {
    //     project_name,
    //     project_title,
    //     project_description,
    //     userId
    // } = vehicle

    // const userInfo = await User.findOne({ id: userId })

    // if (!userInfo) {
    //     return res.status(404).json({ message: 'Supervisor does not exists' })
    // }

    // try {

    //     //create projects
    //     const projects = new Project({
    //         project_name,
    //         project_title,
    //         project_description,
    //         user: userId,
    //     })

    //     await projects.save()

    //     return res.status(201).json(projects);

    // } catch (err) {
    //     console.log(err)
    //     return res.status(500).json(err)
    // }

}
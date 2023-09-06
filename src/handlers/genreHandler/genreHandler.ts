import {Request, Response} from 'express'
//import { genreAttributes } from '../../interface/genreAttributes'
import { genreInstance } from '../../model/genreModel'
import { v4 as uuid } from 'uuid'
import { MusicInstance } from '../../model/musicModel';
import { genreAttributes } from '../../interface/genreAttributes';

export const addGenre = async(req:Request, res:Response)=>{
    try{
        const name = req.body.name
        const check = await genreInstance.findOne({where:{name}})
       
        if(!check){
                const genres = new genreInstance({
                    id:uuid(),
                    name: req.body.name,
                    genreImage:req.file!.path,

            })
            const saved = await genres.save()
            if(saved){
                return res.status(200).json({
                    message: "Genre created successfully",
                    saved
                })
            }else {
                return res.status(400).json({
                    message: "Failed, Error saving Genre"
                })
            }
        }else{
            return res.status(400).json({
                message:"Genre already exist"
            })
        }
      
    }catch(err){
            res.status(500).json({
            err: "internal server error",
            route:"/api/genre/addgenre"
        })

    }
}

export const getAllGenres = async(req:Request, res:Response) => {
    try{
        const allGenre = await genreInstance.findAll({
            order: [["createdAt", "DESC"]]
        })
        if (allGenre){
            res.status(200).json({
                message: "All genre gotten successfully",
                allGenre
            })
        }else{
            res.status(400).json({
                message:"Failed to retrieve genres"
            })
        }
    }catch(err){
        res.status(500).json({
            err: "Internal Sever Error",
            route:"/api/genre/genres"
        })
    }
}

export const getAllGenresLimit = async(req:Request, res:Response) => {
    try{
        const allGenre = await genreInstance.findAll({
            limit: 6,
            order: [["createdAt", "DESC"]]
        })
        if (allGenre){
            res.status(200).json({
                message: "All genre gotten successfully",
                allGenre
            })
        }else{
            res.status(400).json({
                message:"Failed to retrieve genres"
            })
        }
    }catch(err){
        res.status(500).json({
            err: "Internal Sever Error",
            route:"/api/genre/genres"
        })
    }
}

export const getGenreById = async(req:Request, res:Response) => {
    try{
        const id = req.params.id
        const genre = await genreInstance.findByPk(id, {include:
            [{
                model: MusicInstance,
                as: "music",
                attributes:[
                    "id",
                    "title",
                    "artistId",
                    "genreId",
                    "imageUrl",
                    "songUrl"
                ]
            }]
            })
        return res.status(200).json({
            genre
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            err: "Internal server error",
            route:"/api/genre/genre",
            error

        })
    }
}

export const editGenre = async(req:Request, res:Response) => {
    try{
        const { name } = req.body;
        const id = req.params.id
     
        const updatedGenre = (await genreInstance.update(
            {
                name,
                genreImage: req.file ? req.file.path : undefined,
            },
            { where: { id: id } }
          )) as unknown as genreAttributes;

        if(updatedGenre){
            const Genre = await genreInstance.findByPk(id)
            return res.status(200).json({
                message: "Genre edited successfully",
                Genre 
            })
        }else{
            return res.status(400).json({
                message: "failed to save edit"
            })
        }
    }catch(error){
        error;
        }
}

export const deleteGenre = async(req:Request, res:Response) => {
    try{
        const id = req.params.id
        const genreDelete = await genreInstance.destroy({where: {id}})
        if(genreDelete){
            return res.status(200).json({
                message: "Genre deleted successfully",
                genreDelete
            })
        }else{
            return res.status(400).json({
                message: "Your Genre failed to saved"
            })
        }

    }catch(error){
        error;
    }
}
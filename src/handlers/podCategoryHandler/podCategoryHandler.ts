import { Request, Response } from "express";
import { PodcategoryInstance } from "../../model/podcategoryModel";
import { v4 as uuid } from "uuid";
import { PodcastInstance } from "../../model/podcastModel";
// import {PodcastInstance } from "../../model/podcastModel";
// import { podCategoryAttributes } from "../../interface/podCategoryAttribute";

//==================================Get A Category ===========================//
export const getACategory = async (req: Request, res: Response) => {
  try {
    const category = req.params.category;
    console.log(category);

    const Podcast = await PodcategoryInstance.findAll({
      where: { name: category },

      include: [
        {
          model: PodcastInstance,
          as: "podcast",
        },
      ],
    });

    return res.status(200).json({
      categories: Podcast,
    });
  } catch (error) {
    res.status(500).json({
      Error: "Internal server error",
      route: "/api/podcast/podcast",
    });
  }
};

//==================================Get Categories ===========================//
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const allPodcastCategories = await PodcategoryInstance.findAll();

    return res.status(200).json({
      Message: "All Poadcast Category Gotten",
      allPodcastCategories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      Error: "Internal server error",
      route: "/api/podcast/AllPodcastCategories",
    });
  }
};

//====================Create Podcast Category ===========================
export const creatPodcastCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const id = uuid();

    const check = await PodcategoryInstance.findOne({ where: { name: name } });

    console.log(req.file);

    if (!check) {
      const done = await PodcategoryInstance.create({
        id,
        name,
        categoryImage: req.file?.path as string,
      });
      return res.status(201).json({
        Message: "Category successfully created",
        content: done,
      });
    }

    return res.status(400).json({
      Message: "Category Already Exist",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Error: "Internal server error",
      route: "/api/podcast/creatPodcastCategory",
    });
  }
};

// export const addCategory = async(req: Request, res: Response)=>{
//     try{
//         const name = req.body.name;
//         const check = await PodcategoryInstance.findOne({where: {name}})

//         if(!check){
//              const categories = new PodcategoryInstance({
//                 id:uuid(),
//                 name:req.body.name,
//                 categoryImage:req.file!.path,
//              });
//              const saved = await categories.save();
//              if(saved){
//                 return res.status(200).json({
//                     message: "Podcast Category created succesfully",
//                     saved,
//                 });
//              }else{
//                 return res.status(400).json({
//                     message:"Failed, Error saving Podcast category",
//                 });
//              }
//         }else{
//             return res.status(400).json({
//                 message:"Category already exist"
//             });
//         }
//     }catch(error){
//         res.status(500).json({
//             er:"Internal server error",
//             route:"/api/category/addCategory",
//         });
//     }
// };

// export const getAllCategories = async (req:Request, res:Response)=>{
//     try{
//     const allCategory = await PodcategoryInstance.findAll({});
//     if(allCategory){
//         res.status(200).json({
//             message: "All podcast categories gotten successfully.",
//             allCategory,
//         });
//     }else{
//         res.status(400).json({
//             message:"Failed to retrive podcast categories. "
//         })
//     }
// }catch(error){
//     res.status(500).json({
//         er:"Internal server error",
//         route:"/api/category/categories",
//     });
// };
// };

// export const getCategoryById = async (
//     req:Request, res:Response) =>{
//         try{
//             const id = req.params.id;
//             const category = await PodcastInstance.findByPk(
//                 id,{
//                     include:[{
//                         model: PodcastInstance,
//                         as:"podcast",
//                         attributes:[
//                         "id",
//                         "imageUrl",
//                         "episodeUrl",
//                         "title",
//                         "name",
//                         "category",
//                         "song_duration",
//                         ],
//                     },
//                 ],
//                 });
//                 return res.status(200).json({
//                     category,
//                 })
//         }catch(error){
//             res.status(500).json({
//                 er:"Internal server error",
//                 route:"/api/category/category",
//             });
//         }
//     };

//     export const editCategory = async (req: Request, res:Response)=>{
//         try{
//             const {name} =req.body;
//             const id = req.params.id;

//             const updatedPodcast =(await PodcategoryInstance.update(
//                 {
//                     name,
//                     categoryImage: req.file ? req.file.path : undefined,
//                 },
//                 {where :{id:id}}
//             ))as unknown as podCategoryAttributes;

//             if(updatedPodcast){
//                 const Category = await PodcategoryInstance.findByPk(id);
//                 return res.status(200).json({
//                     message: "Podcast category edited successfully",
//                     Category
//                 });
//             }else {
//                 return res.status(400).json({
//                     message: "failed to save edit",
//                 });
//             }
//         }catch(error){
//             error;
//         }
//     };

//     export const deleteCategory =async (req:Request, res:Response)=>{
//         try{
//             const id = req.params.id;
//             const categoryDelete = await PodcategoryInstance.destroy({
//                 where:{id} });
//                 if (categoryDelete){
//                     return res.status(200).json({
//                         message: "category deleted succesfully",
//                         categoryDelete,
//                     });
//                    }
//                 }catch(error) {
//                     error;
//                 }
//             };

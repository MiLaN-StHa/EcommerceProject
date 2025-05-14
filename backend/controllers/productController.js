import {v2 as cloudinary} from 'cloudinary'
import productMOdel from '../models/productModel.js'
// function for add product
const addProduct = async (req,res) => {
    try {
        
        const { name, description, price, category, subCategory, stockQuantity, bestseller}=req.body
        const image1=req.files.image1 && req.files.image1[0]
        const image2=req.files.image2 && req.files.image2[0]
        const image3=req.files.image3 && req.files.image3[0]
        const image4=req.files.image4 && req.files.image4[0]
        
        const images=[image1,image2,image3,image4].filter((item)=>item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'})
                return result.secure_url
            })
        )

        // Check if product exists
        const existingProduct = await productMOdel.findOne({
            name,
            category,
            subCategory
        });

        if (existingProduct) {
            // Update stockQuantity only
            existingProduct.stockQuantity += Number(stockQuantity);
            await existingProduct.save();
            return res.json({ success: true, message: "Product stock updated" });
        }

        const productData={
            name,
            description,
            price:Number(price),
            image:imagesUrl,
            category,
            subCategory,
            stockQuantity:Number(stockQuantity),
            bestseller:bestseller === "true"? true : false,
            date: Date.now()
        } 
        console.log(productData);
        const product = new productMOdel(productData);
        await product.save()

        res.json({success:true, message:"Product Added"});

        
    } catch (error) {
        console.log(error);
        
        res.json({success:false, message:error.message})
    }
}

//function for list proudct
const listProducts = async (req,res) => {
    try {
        const products = await productMOdel.find({});
        res.json({success:true,products})
    } catch (error) {
        console.log(error);
        
        res.json({success:false, message:error.message})
    }
}


//fuction for removeing product
const removeProduct = async (req,res) => {
    try {
        await productMOdel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removeed"})
    } catch (error) {
        console.log(error);
        
        res.json({success:false, message:error.message})
    }
}


//function for single proudct info
const singleProduct = async (req,res) => {
    try {
        
        const { productId} =req.body
        const product = await productMOdel.findById(productId)
        res.json({success:true, product})

    } catch (error) {
        console.log(error);
        
        res.json({success:false, message:error.message})
    }
}

export {listProducts,addProduct,removeProduct,singleProduct}
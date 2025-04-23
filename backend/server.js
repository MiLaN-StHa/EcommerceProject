import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/oderRoute.js';
import supplierRouter from './routes/supplierRoutes.js';
import customizeRouter from './routes/customizeRoute.js';

// App config
const app = express();
const port = process.env.PORT || 4000;

// MongoDB connection
connectDB()
connectCloudinary()

// Middlewares
app.use(express.json());
app.use(cors());

// API endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/supplier', supplierRouter);
app.use('/api/customizations', customizeRouter);

app.get('/', (req, res) => {
  res.send('API Working');
});

// Start the server
app.listen(port, () => console.log('Server started on PORT: ' + port));

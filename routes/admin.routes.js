import express from 'express';
 import { addDoctor } from '../controllers/admin.controllers.js';
 import {upload} from '../middlewares/multer.middlewares.js';

 const adminRouter = express.Router();


 adminRouter.post('/add-doctor',upload.single('image'),addDoctor)

 export default adminRouter;
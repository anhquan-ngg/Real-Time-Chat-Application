import {Router} from 'express';
import {verifyToken} from "../middlewares/AuthMiddleware.js";
import {searchContacts} from "../controllers/ContactsController.js";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContacts);

export default contactRoutes;
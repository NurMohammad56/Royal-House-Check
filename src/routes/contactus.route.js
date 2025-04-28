import express from 'express';
const router = express.Router();
import {createContact, getContacts} from "../controller/contactus.controller.js"


router.post('/create', createContact);
router.get('/get', getContacts);

export default router;
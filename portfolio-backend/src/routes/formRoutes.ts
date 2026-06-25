import express from 'express';
import contactFormController from '../controllers/contactFormController';

const formRoutes = express.Router();

formRoutes.post('/contact', contactFormController);

export default formRoutes;

import express from 'express';
import controller from '../controllers/posts';
const router = express.Router();

router.get('/query/address/msg', controller.queryContract);


export = router;
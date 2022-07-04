import express from 'express';
import controller from '../controllers/wasm';
const router = express.Router();

router.get('/query/:address/:msg', controller.queryContract);
router.get('/simulate/:address/:execute_msg', controller.simulateFee);


export = router;
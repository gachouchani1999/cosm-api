/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import {CosmWasmClient} from '@cosmjs/cosmwasm-stargate';
import config from '../config.json'
interface Post {
    userId: Number;
    id: Number;
    title: String;
    body: String;
}

// Takes as input a JSON message and returns a query response
const queryContract = async (req: Request, res: Response, next: NextFunction) => {
    // Initiate a Cosmwasm Client
    let client: CosmWasmClient = await CosmWasmClient.connect(config.RPC_ENDPOINT);
    // extract address from request
    let address = req.params.address;
    // extract json message from request
    let msg: any = req.params.msg;
    // query smart contract using reading client
    let resp = client.queryContractSmart(address,msg);
    return res.status(200).json({
        message: resp
    });
};



export default { queryContract};
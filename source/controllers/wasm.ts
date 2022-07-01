/** source/controllers/posts.ts */
import { Request, Response, NextFunction, json } from 'express';
import axios, { AxiosResponse } from 'axios';
import {CosmWasmClient} from '@cosmjs/cosmwasm-stargate';
import config from '../config.json'

// Takes as input a JSON message and returns a query response
const queryContract = async (req: Request, res: Response, next: NextFunction) => {
    // Initiate a Cosmwasm Client
    let client: CosmWasmClient = await CosmWasmClient.connect(config.RPC_ENDPOINT);
    // extract address from request
    let address = req.params.address;
    // extract json message from request
    let msg = req.params.msg;
    // Parse message into json
    let json_msg = JSON.parse(msg);
    console.log(json_msg)
    // query smart contract using reading client
    let resp = await client.queryContractSmart(address,json_msg);
    return res.status(200).json({
        message: resp
    });
};



export default { queryContract};
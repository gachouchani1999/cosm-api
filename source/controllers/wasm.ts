/** source/controllers/posts.ts */
import { Request, Response, NextFunction, json } from 'express';
import axios, { AxiosResponse } from 'axios';
import {CosmWasmClient, isMsgExecuteEncodeObject, SigningCosmWasmClient} from '@cosmjs/cosmwasm-stargate';
import {DirectSecp256k1HdWallet, EncodeObject} from "@cosmjs/proto-signing";
import {MsgExecuteContract} from "cosmjs-types/cosmwasm/wasm/v1/tx";


import config from '../config.json'
export interface MsgExecuteContractEncodeObject extends EncodeObject {
    readonly typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract";
    readonly value: Partial<MsgExecuteContract>;
}

/** Takes as input a JSON message and returns a query response */
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

/** Takes as input a certain transaction and calculates the required fee */
const simulateFee = async (req: Request, res: Response, next: NextFunction) => {
    // Random Wallet
    let wallet = await DirectSecp256k1HdWallet.generate(15, {prefix: config.PREFIX});
    // Initiate a Cosmwasm Client
    let client: SigningCosmWasmClient = await SigningCosmWasmClient.connectWithSigner(config.RPC_ENDPOINT, wallet);
    let address = req.params.address;
    // extract json message from request
    // query smart contract using read only client
    let signer_address = await wallet.getAccounts();
    // Parse message into json
    let messages = req.params.messages;
    let json_msg = JSON.parse(messages);
    let encoded_msg : MsgExecuteContractEncodeObject = {
         typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
         value: {
            sender: signer_address[0].address,
            contract: address,
            msg: json_msg,
         }
    };
    let resp = await client.simulate(signer_address[0].address,json_msg, "");
    return res.status(200).json({
        message: resp
    });
};



export default { queryContract};
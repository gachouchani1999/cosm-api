/** source/controllers/posts.ts */
import { Request, Response, NextFunction, json } from 'express';
import {CosmWasmClient, SigningCosmWasmClient} from '@cosmjs/cosmwasm-stargate';
import {DirectSecp256k1HdWallet, EncodeObject, coin} from "@cosmjs/proto-signing";
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
        resp
    });
};

var JsonToArray = function (json: Record<string, any>) {
    var str = JSON.stringify(json, null, 0);
    var ret = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
      ret[i] = str.charCodeAt(i);
    }
    return ret;
  };

/** Takes as input a certain transaction and calculates the required fee */
const simulateFee = async (req: Request, res: Response, next: NextFunction) => {
    // Random Wallet
    let wallet = await DirectSecp256k1HdWallet.fromMnemonic("aunt forest doll into woman apology bottom lift prosper sport absent copper civil vast large limit tired cupboard waste artwork surge rack observe guide", {prefix: "juno"});
    // Initiate a Cosmwasm Client
    let client: SigningCosmWasmClient = await SigningCosmWasmClient.connectWithSigner(config.RPC_ENDPOINT, wallet);
    let address = req.params.address;
    // extract json message from request
    // query smart contract using read only client
    let signer_address = await wallet.getAccounts();
    // Parse message into json
    let messages = req.params.execute_msg;
    let json_msg = JSON.parse(messages);
    let encoded_msg : MsgExecuteContractEncodeObject = {
         typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
         value: {
            sender: signer_address[0].address,
            contract: address,
            msg: JsonToArray(json_msg),
            funds: [coin("10000",config.DENOM)]
         }
    };

    let resp = await client.simulate(signer_address[0].address,[encoded_msg], "");
    return res.status(200).json({
        resp
    });
};



export default { queryContract, simulateFee };
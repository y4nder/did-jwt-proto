import { Wallet } from "ethers";
import { dbConnection } from "./db/sqlitedb";
import { Identifier } from "./db/entities/identifier";
import "dotenv/config";
import { v4 as uuid } from "uuid";
import { EthrDID } from "ethr-did";
import { encrypt } from "./utils/encryption";

async function main() {
    const alias = `user:${uuid()}`
    // const alias = `org:${uuid()}`
    
    // generating the ethrDID
    const res = generateEthrDID();
    const did = res.identifer.did;
    const provider = res.provider;
    const privateKey = res.privateKey;

    // persistence
    await dbConnection.initialize();

    // create the identifier
    const identifer = new Identifier();
    identifer.did = did;
    identifer.provider = provider;
    identifer.alias = alias;
    identifer.privateKey = encrypt(privateKey); // encrypt the private key
    
    // persist
    const repo = dbConnection.getRepository(Identifier);
    await repo.save(identifer);

    console.log("\n\n✅ Created alias: ", identifer.alias);
}

function generateEthrDID() : {identifer: EthrDID, provider: string, privateKey: string} {
    const userWallet = Wallet.createRandom();
    const privateKey = userWallet.privateKey.slice(2);
    const provider = 'sepolia';

    const userDid = new EthrDID({
        identifier: userWallet.address,
        privateKey,
        rpcUrl : 'https://sepolia.infura.io/v3/' + process.env.INFURA_ID!,
        chainNameOrId: provider
    });

    return {
        identifer: userDid,
        provider,
        privateKey
    };
}

main().catch(console.error);

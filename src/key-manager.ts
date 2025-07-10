import { randomBytes } from 'crypto';
import { ec as EC } from 'elliptic';

export const generateAddress = () : string => {
    const ec = new EC(process.env.KMS_SECRET_KEY!);
    const privHex = randomBytes(32).toString("hex");
    const key = ec.keyFromPrivate(privHex, 'hex')
    const pub = key.getPublic(true, 'hex')
    const address = '0x' + pub.slice(-40)
    return address;
}

export const generatePrivKeyHex = () : string => {
    const ec = new EC(process.env.KMS_SECRET_KEY!);
    const privHex = randomBytes(32).toString("hex");
    return privHex;
}
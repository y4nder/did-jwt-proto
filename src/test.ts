// Import libraries
import { EthrDID } from 'ethr-did'
import { createVerifiableCredentialJwt, verifyCredential, type Issuer, type JwtCredentialPayload } from 'did-jwt-vc'
import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

import { Wallet } from 'ethers';
import { generatePrivKeyHex } from './key-manager';
import { v4 as uuidv4 } from "uuid";
import type { TraningCredential } from './types/credentials';

// sa issuer
const wallet = Wallet.createRandom();
const address = wallet.address;

console.log('Private key:', wallet.privateKey)
console.log('Address:', wallet.address)
console.log('DID:', `did:ethr:${wallet.address}`)

const rpcUrl = 'https://sepolia.infura.io/v3/' + process.env.INFURA_ID!;


// Configure Issuer DID (Workshop Organizer)
const issuer = new EthrDID({
  identifier: address,
  privateKey: wallet.privateKey.slice(2),
  rpcUrl,
  chainNameOrId: 'sepolia'
}) as Issuer; 

// const userId = `user:${uuidv4()}`;
// const subjectWallet = Wallet.fromPhrase(userId);
const subjectWallet = Wallet.createRandom();
const subjectDid = `did:ethr:${subjectWallet.address}`;

// persisted the subjectid

// tables

// identifiers [subjectDid]
// credentials [ subjectDid, cid, types[], issuerDid, timeStamp ]

// /////


const credSub : TraningCredential = {
    id: `urn:uuid:${uuidv4()}`,
    name: 'Maria',
    training: 'Digital Bootcamp',
    date: '2025-07-08'
}

// export type JwtCredentialSubject = Record<string, any>


// Sample VC payload
const payload : JwtCredentialPayload  = {
  sub: subjectDid,
  nbf: Math.floor(Date.now() / 1000),
  vc: {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential', 'TrainingCredential'],
    credentialSubject: {
        ...credSub
    }
  }
}

// Issue VC
const vcJwt = await createVerifiableCredentialJwt(payload, issuer)
console.log('\n\n✅ Issued VC JWT:', vcJwt)

// persistence ...


// Start of verifying
const providerConfig = {
  infuraProjectId: process.env.INFURA_ID
}
// Setup DID resolver (for issuer DID)
const resolver = new Resolver(getResolver(providerConfig))

// Verify VC
const verified = await verifyCredential(vcJwt, resolver)
console.log('✅ Verification result:', {
  isValid: verified.verified,
  issuer: verified.issuer,
  subject: verified.verifiableCredential.credentialSubject.id
})

const traningCredential = verified.verifiableCredential.credentialSubject as TraningCredential;

console.log("credentials:", traningCredential.training);

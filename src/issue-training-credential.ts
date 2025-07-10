import { dbConnection } from "./db/sqlitedb";
import { Identifier } from "./db/entities/identifier";
import { EthrDID } from "ethr-did";
import { decrypt } from "./utils/encryption";
import { createVerifiableCredentialJwt, type Issuer, type JwtCredentialPayload } from "did-jwt-vc";
import type { TraningCredential } from "./types/credentials";
import { v4 as uuidv4 } from "uuid";
import { Credential } from "./db/entities/credential";
import web3StorageClient from "./db/web3_storage";

async function main() {
    // alias coming from request
    const orgAlias = "org:b2fcdf17-726c-4b92-b550-ffca971c4d68";
    const subjectAlias = "user:83fa0ef0-fe21-4d0c-bb8a-91279f19c480";
    
    // simulate service here kuhaon both identifiers sa db
    await dbConnection.initialize();
    const repo = dbConnection.getRepository(Identifier);
    const organization = await repo.findOneBy({alias: orgAlias });
    const subject = await repo.findOneBy({alias: subjectAlias});
    
    // Configure Issuer DID (Workshop Organizer)
    const issuer = new EthrDID({
        identifier: organization?.did!,
        privateKey: decrypt(organization?.privateKey!),
        rpcUrl: 'https://sepolia.infura.io/v3/' + process.env.INFURA_ID!, 
        chainNameOrId: 'sepolia'
    }) as Issuer;

    const now = new Date();

    // creating the credential
    const trainingCredential : TraningCredential = {
        id: `urn:uuid:${uuidv4()}`,
        name: 'Maria',
        training: 'Another Digital BootCamp',
        date: now.toISOString(),
    }

    const type = ['VerifiableCredential', 'TrainingCredential'];

    // generating the payload
    const payload : JwtCredentialPayload  = {
      sub: subject?.did,
      nbf: Math.floor(now.getTime() / 1000),
      vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type,
        credentialSubject: { ...trainingCredential }
      }
    }

    // signing the credential
    const vcJwt = await createVerifiableCredentialJwt(payload, issuer);
    console.log('\n\n✅ Issued VC JWT:', vcJwt);
    
    // persisting the credential, simulating with service nasad diri
    const credRepo = dbConnection.getRepository(Credential);

    const credential = new Credential();
    credential.vcid = trainingCredential.id;
    credential.issuer = organization!;
    credential.subject = subject!;
    credential.timestamp = now;
    credential.type = type;
    

    // upload to web3 storage
    const file = new File([vcJwt], `${trainingCredential.id}.jwt`, { type: 'application/jwt' });
    const uploadedFile = await web3StorageClient.uploadFile(file);
    const cid = uploadedFile.toString();
    credential.cid = cid;

    await credRepo.save(credential);
    console.log("\n\n Created Credential: ", credential);

}

main().catch(console.error);
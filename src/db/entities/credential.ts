import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { Identifier } from "./identifier";

@Entity("credentials")
export class Credential {
	@PrimaryColumn()
	vcid!: string; // could be the VC JWT ID or UUID

	@ManyToOne(() => Identifier, (identifier) => identifier.subjectCredentials, { eager: true })
	subject!: Identifier;

	@Column()
	cid!: string; // Web3.Storage CID

	@Column("simple-array")
    type!: string[];

	@ManyToOne(() => Identifier, (identifier) => identifier.issuedCredentials, { eager: true })
	issuer?: Identifier;

	@Column("datetime")
	timestamp!: Date;
}

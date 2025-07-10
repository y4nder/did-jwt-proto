import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Credential } from "./credential";

@Entity("identifiers")
export class Identifier {
	@PrimaryColumn()
	did!: string;

	@Column()
	provider!: string;

  @Column()
  alias!: string;

  @Column()
  privateKey!: string;

	@OneToMany(() => Credential, (credential) => credential.subject)
	subjectCredentials?: Credential[];

	@OneToMany(() => Credential, (credential) => credential.issuer)
	issuedCredentials?: Credential[];
}

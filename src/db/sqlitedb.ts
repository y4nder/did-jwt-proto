import { DataSource } from "typeorm";
import { Credential } from "./entities/credential";
import { Identifier } from "./entities/identifier";
import path from 'path';

const DATABASE_FILE = path.join(__dirname, '..', '..', 'database.sqlite')

export const dbConnection = new DataSource({
	type: "sqlite",
	database: DATABASE_FILE,
	synchronize: true,
	logging: ["error", "info", "warn"],
	entities: [Identifier, Credential],
});


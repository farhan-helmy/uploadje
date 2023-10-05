import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from "postgres"
import * as users from "./schema/users"
import * as apps from "./schema/apps"
import * as images from "./schema/images"
import dotenv from 'dotenv';

dotenv.config();

const queryClient = postgres(process.env.DB_URL);
const db = drizzle(queryClient, {
    schema: {
        ...users,
        ...apps,
        ...images
    }
});

export default db


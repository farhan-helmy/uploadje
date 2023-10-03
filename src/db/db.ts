import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from "postgres"
import * as users from "./schema/users"
import * as apps from "./schema/apps"
import * as images from "./schema/images"


const queryClient = postgres("postgres://postgres:mysecretpassword@localhost:5432/uploadjedev");
const db = drizzle(queryClient, {
    schema: {
        ...users,
        ...apps,
        ...images
    }
});

export default db


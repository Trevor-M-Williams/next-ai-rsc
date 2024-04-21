import { eq } from "drizzle-orm";
import { db } from ".";
import { organizations } from "./schema";

main();

async function main() {
  await db.insert(organizations).values({
    name: "org_2fQ4PIJkILAX1FbNXfvXyaL3HY2",
    symbol: "ABC",
  });
}

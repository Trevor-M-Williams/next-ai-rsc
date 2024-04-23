"use server";

import { auth } from "@clerk/nextjs";

import { eq } from "drizzle-orm";
import { db } from "@/db";

import { organizations } from "@/db/schema";

export async function getOrganization() {
  const { orgId } = auth();
  if (!orgId) return null;

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.name, orgId),
  });

  return org || null;
}

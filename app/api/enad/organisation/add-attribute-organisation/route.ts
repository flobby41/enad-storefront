import { handleAddAttributeRelationshipOrganisation } from "@enadhq/commerce/backend";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return handleAddAttributeRelationshipOrganisation(request);
}

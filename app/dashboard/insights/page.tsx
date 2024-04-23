import GenInsights from "@/components/insights/gen-insights";
import ABCInsights from "@/components/insights/abc-insights";
import { getOrganization } from "@/actions";

export default async function InsightsPage() {
  const organization = await getOrganization();
  if (!organization) return;

  if (organization.symbol === "ABC") {
    return <ABCInsights />;
  }

  return <GenInsights />;
}

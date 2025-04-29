
import React from "react";

interface LeadCardBadgeProps {
  campaignSource: string;
}

export function LeadCardBadge({ campaignSource }: LeadCardBadgeProps) {
  // This would come from actual lead data in a real app
  const getCampaignBadgeClass = () => {
    const sources = ['google', 'facebook', 'instagram', 'direct', 'email'];
    const sourceIndex = Math.abs(campaignSource.charCodeAt(0)) % sources.length;
    return `campaign-badge campaign-${sources[sourceIndex]}`;
  };

  return (
    <span className={getCampaignBadgeClass()}>
      {campaignSource}
    </span>
  );
}

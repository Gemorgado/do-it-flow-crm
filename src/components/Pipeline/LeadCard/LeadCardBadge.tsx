import React from "react";

interface LeadCardBadgeProps {
  type?: string;
  children?: React.ReactNode;
  campaignSource?: string;
}

export function LeadCardBadge({ type, children, campaignSource }: LeadCardBadgeProps) {
  // If we have a campaignSource, use legacy behavior
  if (campaignSource) {
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

  // Otherwise, use the new type-based behavior
  let badgeClass = "text-xs px-2 py-0.5 rounded-full ";
  
  switch(type) {
    case "source":
      badgeClass += "bg-blue-100 text-blue-800";
      break;
    case "status":
      badgeClass += "bg-green-100 text-green-800";
      break;
    case "meeting":
      badgeClass += "bg-purple-100 text-purple-800";
      break;
    default:
      badgeClass += "bg-gray-100 text-gray-800";
  }
  
  return (
    <span className={badgeClass}>
      {children}
    </span>
  );
}


import React from "react";
import { FiscalAddressTab } from "@/components/FiscalAddress/FiscalAddressTab";

export default function FiscalAddresses() {
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-3xl font-bold">Endereços Fiscais</h1>
      <FiscalAddressTab />
    </div>
  );
}

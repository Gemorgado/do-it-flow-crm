
import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ContactForm } from "./ContactForm";

interface NewContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: "lead" | "client";
}

export function NewContactDrawer({ isOpen, onClose, type }: NewContactDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle>
            {type === "lead" ? "Novo Lead" : "Novo Cliente"}
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto">
          <ContactForm 
            type={type} 
            onSuccess={onClose} 
            onCancel={onClose}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

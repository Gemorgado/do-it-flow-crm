
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ContactModalValues, contactModalSchema } from "@/schemas/contactFormSchemas";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { CompanyFields } from "./fields/CompanyFields";
import { DateAndServiceFields } from "./fields/DateAndServiceFields";
import { SourceFields } from "./fields/SourceFields";

interface ContactFormProps {
  onSubmit: (data: ContactModalValues) => Promise<void>;
  isSubmitting: boolean;
}

export function ContactForm({ onSubmit, isSubmitting }: ContactFormProps) {
  const form = useForm<ContactModalValues>({
    resolver: zodResolver(contactModalSchema),
    defaultValues: {
      contactName: "",
      email: "",
      phone: "",
      companyOrPerson: "",
      idNumber: "",
      entryDate: format(new Date(), "yyyy-MM-dd"),
      interestService: "",
      sourceCategory: "outro",
      sourceDetail: "",
    },
  });

  const handleFormSubmit = form.handleSubmit(onSubmit);
  
  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <BasicInfoFields form={form} />
        <CompanyFields form={form} />
        <DateAndServiceFields form={form} />
        <SourceFields form={form} />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
            disabled={isSubmitting}
            style={{ backgroundColor: "white", color: "#333", opacity: 1 }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            style={{ backgroundColor: "hsl(var(--primary))", color: "white", opacity: 1 }}
          >
            {isSubmitting ? (
              <>
                <span className="opacity-0">Save</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              </>
            ) : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

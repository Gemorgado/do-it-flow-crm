
import { Lead, PipelineStage } from "@/types";

export const mockedPipelineStages: PipelineStage[] = [
  {
    id: "1",
    name: "Novo",
    order: 1,
    color: "#3b82f6"
  },
  {
    id: "2",
    name: "Qualificado",
    order: 2,
    color: "#8b5cf6"
  },
  {
    id: "3",
    name: "Proposta",
    order: 3,
    color: "#10b981"
  }
];

export const mockedLeads: Lead[] = [
  {
    id: "1",
    name: "Test Lead 1",
    company: "Test Company",
    email: "test1@example.com",
    phone: "123456789",
    status: "novo",
    source: "site_organico",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    stage: mockedPipelineStages[0],
    notes: "Test notes",
    sourceDetail: "Website contact form"
  },
  {
    id: "2",
    name: "Test Lead 2",
    company: "Another Company",
    email: "test2@example.com",
    phone: "987654321",
    status: "qualificado",
    source: "indicacao",
    createdAt: "2023-01-02T00:00:00.000Z",
    updatedAt: "2023-01-02T00:00:00.000Z",
    stage: mockedPipelineStages[1],
    notes: "Another test notes",
    sourceDetail: "Referred by Partner"
  }
];

export { mockedLeads as default };

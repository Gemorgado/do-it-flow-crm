
# Developer Documentation

This document provides instructions for setting up the development environment, running tests, and understanding the business rules implemented in the application.

## Setup

### Prerequisites
- Node.js 16+ 
- npm 8+

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser at http://localhost:5173

## Testing

### Running Tests
To run all tests:
```bash
npx vitest
```

To run tests with coverage:
```bash
npx vitest run --coverage
```

To run a specific test file:
```bash
npx vitest src/components/CRM/LeadForm/tests/LeadForm.test.tsx
```

## Business Rules

The following business rules are implemented and tested in the application:

### 1. Lead → Pipeline
- Every created lead is automatically added to the "Novos Leads" column in the pipeline.
- Implementation: `src/components/CRM/LeadForm/LeadForm.tsx`
- Tests: `src/components/CRM/LeadForm/tests/LeadForm.test.tsx`

### 2. Pipeline → Proposal
- Leads can be dragged between pipeline columns.
- When a proposal is created, it appears in `/proposals` linked to the lead.
- While there's an open proposal, the lead stays in the "Proposta" column.
- Implementation: `src/hooks/usePipelineData.tsx`, `src/components/Pipeline/PipelineBoard.tsx`
- Tests: Pipeline drag and drop tests

### 3. Lead Conversion to Client
- When a lead is linked to a service (meeting room, auditorium, private room, flex station, fixed station, or fiscal address), it's removed from the Leads list and added to the Clients list.
- Implementation: `src/hooks/useContactsData.ts`
- Tests: Lead conversion tests

### 4. Space Allocation
- If the service is a private room or station (flex/fixed), the client must be fixed on the space map (room number/ID field or station).
- Implementation: `src/hooks/useSpaceBindingManager.ts`
- Tests: Space allocation tests

### 5. Complete Cycle
- Lead → Proposal → Closing → Client → Space/Service Allocation.
- All states are persisted and reflected in real-time after refresh.
- Implementation: Multiple components and local storage persistence
- Tests: End-to-end tests verifying the complete flow

## CI/CD

The CI/CD pipeline includes:
- Linting
- Type checking
- Unit tests
- Integration tests

All tests must pass before merging into main.

## Code Structure

- `/src/components`: UI components
- `/src/hooks`: Custom React hooks
- `/src/types`: TypeScript types and interfaces
- `/src/utils`: Utility functions
- `/src/integrations`: Integration with backend services
- `/src/api`: API clients
- `/src/test`: Test utilities and setup

## Debugging

- Check console logs for errors
- Review the application state in localStorage
- Use browser DevTools to investigate network requests

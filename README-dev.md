
# Developer Documentation

This document provides instructions for setting up the development environment, running tests, and understanding the business rules implemented in the application.

## Setup

### Prerequisites
- Node.js 16+ 
- npm 8+
- Supabase CLI (for local development)

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/Gemorgado/do-it-flow-crm.git
   cd do-it-flow-crm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and update with your Supabase credentials:
   ```
   SUPABASE_URL=https://yjrjuwgdamxufhcsjexb.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. For local development with Supabase:
   ```bash
   supabase start
   supabase db reset
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

## Supabase Integration

This application uses Supabase for backend functionality:

1. **Authentication** - Not fully implemented in the current version, but the infrastructure is set up.
2. **Database** - PostgreSQL with tables for leads, clients, proposals, spaces, and allocations.
3. **Realtime** - Subscription to changes in the database to update UI in real-time.

### Supabase Database Structure

The database includes the following tables:
- `pipeline_stages` - Stages for the sales pipeline
- `leads` - Leads in the sales process
- `proposals` - Proposals linked to leads
- `proposal_items` - Line items for proposals
- `clients` - Converted leads/customers
- `client_services` - Services provided to clients
- `spaces` - Physical spaces for allocation
- `space_allocations` - Allocations of spaces to clients

## Business Rules

The following business rules are implemented and tested in the application:

### 1. Lead → Pipeline
- Every created lead is automatically added to the "New Leads" column in the pipeline.
- Implementation: 
  - `src/hooks/usePipelineData.tsx` for loading and maintaining pipeline data.
  - Supabase realtime subscriptions ensure UI updates when data changes.
- Tests: Pipeline rendering and interaction tests.

### 2. Pipeline → Proposal
- Leads can be dragged between pipeline columns, updating the lead's stage in the database.
- When a proposal is created, it is linked to a lead and stored in the `proposals` table.
- While there's an open proposal, the lead stays in the "Proposal" column.
- Implementation: 
  - `src/hooks/usePipelineData.tsx` for drag and drop functionality.
  - `src/integrations/persistence/proposalPersistence.ts` for proposal creation.
- Tests: Pipeline drag and drop tests and lead-to-proposal conversion.

### 3. Lead Conversion to Client
- When a lead is linked to a service, it's removed from the Leads list and added to the Clients list.
- The lead is marked as `status: 'converted'` and `stage_id: null`.
- A new client record is created with the lead's information.
- Implementation: `src/hooks/useLeadToClientConversion.ts`
- Tests: Lead conversion tests.

### 4. Space Allocation
- When a service involves a physical space, an allocation is created in the `space_allocations` table.
- The allocation links a space to a client and contract.
- Implementation: `src/hooks/useSpaceBindingManager.ts`
- Tests: Space allocation tests.

### 5. Complete Cycle
- Lead → Proposal → Closing → Client → Space/Service Allocation.
- All states are persisted in Supabase and reflected in real-time after refresh.
- Implementation: Integration of all above components with Supabase Realtime.
- Tests: End-to-end tests verifying the complete flow.

## CI/CD

The CI/CD pipeline includes:
- Linting
- Type checking
- Unit tests
- Integration tests

To run in CI environment:
```bash
npm run lint
npx tsc --noEmit
npm test
```

## Code Structure

- `/src/components`: UI components
- `/src/hooks`: Custom React hooks
- `/src/types`: TypeScript types and interfaces
- `/src/utils`: Utility functions
- `/src/integrations`: Integration with backend services
  - `/src/integrations/supabase`: Supabase client and types
  - `/src/integrations/persistence`: Data persistence layer
- `/src/api`: API clients
- `/src/test`: Test utilities and setup

## Debugging

- Check console logs for errors
- Review the Supabase dashboard for database state
- Use the Supabase dashboard to query tables directly:
  https://supabase.com/dashboard/project/yjrjuwgdamxufhcsjexb/editor

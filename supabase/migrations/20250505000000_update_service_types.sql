
-- Update Enums to use English snake_case
ALTER TYPE service_type RENAME TO service_type_old;
CREATE TYPE service_type AS ENUM (
  'fiscal_address',
  'flex_desk',
  'fixed_desk',
  'private_office',
  'meeting_room',
  'auditorium'
);

-- Update service_type column values
ALTER TABLE spaces
  ALTER COLUMN type TYPE text;

ALTER TABLE client_services
  ALTER COLUMN type TYPE text;

ALTER TABLE clients
  ALTER COLUMN plan TYPE text;

-- Create a function to convert old values to new
CREATE OR REPLACE FUNCTION convert_service_type() RETURNS void AS $$
BEGIN
  -- Update spaces table
  UPDATE spaces
  SET type = CASE type
    WHEN 'endereco_fiscal'::text THEN 'fiscal_address'
    WHEN 'estacao_flex'::text THEN 'flex_desk'
    WHEN 'estacao_fixa'::text THEN 'fixed_desk'
    WHEN 'sala_privativa'::text THEN 'private_office'
    WHEN 'sala_reuniao'::text THEN 'meeting_room'
    WHEN 'auditorio'::text THEN 'auditorium'
    ELSE type
  END;

  -- Update client_services table
  UPDATE client_services
  SET type = CASE type
    WHEN 'endereco_fiscal'::text THEN 'fiscal_address'
    WHEN 'estacao_flex'::text THEN 'flex_desk'
    WHEN 'estacao_fixa'::text THEN 'fixed_desk'
    WHEN 'sala_privativa'::text THEN 'private_office'
    WHEN 'sala_reuniao'::text THEN 'meeting_room'
    WHEN 'auditorio'::text THEN 'auditorium'
    ELSE type
  END;

  -- Update clients table
  UPDATE clients
  SET plan = CASE plan
    WHEN 'endereco_fiscal'::text THEN 'fiscal_address'
    WHEN 'estacao_flex'::text THEN 'flex_desk'
    WHEN 'estacao_fixa'::text THEN 'fixed_desk'
    WHEN 'sala_privativa'::text THEN 'private_office'
    WHEN 'sala_reuniao'::text THEN 'meeting_room'
    WHEN 'auditorio'::text THEN 'auditorium'
    ELSE plan
  END;
END;
$$ LANGUAGE plpgsql;

-- Run the conversion function
SELECT convert_service_type();

-- Now convert columns back to enum type
ALTER TABLE spaces
  ALTER COLUMN type TYPE service_type USING type::service_type;

ALTER TABLE client_services
  ALTER COLUMN type TYPE service_type USING type::service_type;

ALTER TABLE clients
  ALTER COLUMN plan TYPE service_type USING plan::service_type;

-- Drop the old type and conversion function
DROP TYPE service_type_old;
DROP FUNCTION convert_service_type();

-- Update proposal status enum to use English snake_case
ALTER TYPE proposal_status RENAME TO proposal_status_old;
CREATE TYPE proposal_status AS ENUM (
  'draft',
  'sent',
  'viewed',
  'accepted',
  'rejected',
  'expired',
  'negotiating'
);

-- Update proposals table
ALTER TABLE proposals
  ALTER COLUMN status TYPE text;

-- Create a function to convert old values to new
CREATE OR REPLACE FUNCTION convert_proposal_status() RETURNS void AS $$
BEGIN
  UPDATE proposals
  SET status = CASE status
    WHEN 'enviada'::text THEN 'sent'
    WHEN 'visualizada'::text THEN 'viewed'
    WHEN 'aceita'::text THEN 'accepted'
    WHEN 'rejeitada'::text THEN 'rejected'
    WHEN 'expirada'::text THEN 'expired'
    WHEN 'em_negociacao'::text THEN 'negotiating'
    ELSE 'draft'
  END;
END;
$$ LANGUAGE plpgsql;

-- Run the conversion function
SELECT convert_proposal_status();

-- Now convert columns back to enum type
ALTER TABLE proposals
  ALTER COLUMN status TYPE proposal_status USING status::proposal_status;

-- Drop the old type and conversion function
DROP TYPE proposal_status_old;
DROP FUNCTION convert_proposal_status();

-- Ensure all required columns exist in proposals table
DO $$ 
BEGIN
  -- Check if the title column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'title') THEN
    ALTER TABLE proposals ADD COLUMN title TEXT NOT NULL DEFAULT 'New Proposal';
  END IF;
  
  -- Check if the value column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'value') THEN
    ALTER TABLE proposals ADD COLUMN value INTEGER NOT NULL DEFAULT 0;
  END IF;
  
  -- Check if the expires_at column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'expires_at') THEN
    ALTER TABLE proposals ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 days');
  END IF;

  -- Check if the created_by column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'created_by') THEN
    ALTER TABLE proposals ADD COLUMN created_by UUID NULL;
  END IF;
END $$;

-- Update client_services to ensure billing_cycle uses consistent values
ALTER TABLE client_services
  ALTER COLUMN billing_cycle TYPE text;

-- Create a function to convert billing cycle values
CREATE OR REPLACE FUNCTION convert_billing_cycle() RETURNS void AS $$
BEGIN
  UPDATE client_services
  SET billing_cycle = CASE billing_cycle
    WHEN 'mensal'::text THEN 'monthly'
    WHEN 'anual'::text THEN 'yearly'
    ELSE billing_cycle
  END;
END;
$$ LANGUAGE plpgsql;

-- Run the conversion function
SELECT convert_billing_cycle();

-- Drop the conversion function
DROP FUNCTION convert_billing_cycle();

-- Add a check constraint to ensure billing_cycle is valid
ALTER TABLE client_services
  DROP CONSTRAINT IF EXISTS billing_cycle_check;

ALTER TABLE client_services
  ADD CONSTRAINT billing_cycle_check CHECK (billing_cycle IN ('monthly', 'yearly'));

-- Update client_services to ensure status uses consistent values
ALTER TABLE client_services
  ALTER COLUMN status TYPE text;

-- Create a function to convert service status values
CREATE OR REPLACE FUNCTION convert_service_status() RETURNS void AS $$
BEGIN
  UPDATE client_services
  SET status = CASE status
    WHEN 'ativo'::text THEN 'active'
    WHEN 'em_renovacao'::text THEN 'renewal'
    WHEN 'cancelado'::text THEN 'canceled'
    ELSE status
  END;
END;
$$ LANGUAGE plpgsql;

-- Run the conversion function
SELECT convert_service_status();

-- Drop the conversion function
DROP FUNCTION convert_service_status();

-- Add a check constraint to ensure service status is valid
ALTER TABLE client_services
  DROP CONSTRAINT IF EXISTS service_status_check;

ALTER TABLE client_services
  ADD CONSTRAINT service_status_check CHECK (status IN ('active', 'renewal', 'canceled'));


import { describe, it, expect } from 'vitest';
import { 
  PT_BR_TO_SERVICE_TYPE,
  SERVICE_TYPE_TO_PT_BR,
  ServiceType
} from '@/types/service';
import {
  PT_BR_TO_CLIENT_STATUS,
  CLIENT_STATUS_TO_PT_BR,
  PT_BR_TO_BILLING_CYCLE,
  BILLING_CYCLE_TO_PT_BR,
  PT_BR_TO_SERVICE_STATUS,
  SERVICE_STATUS_TO_PT_BR
} from '@/types/client';
import {
  PT_BR_TO_PROPOSAL_STATUS,
  PROPOSAL_STATUS_TO_PT_BR
} from '@/types/proposal';

describe('Service Type Mappings', () => {
  it('should correctly map all Portuguese keys to English service types', () => {
    expect(PT_BR_TO_SERVICE_TYPE['endereco_fiscal']).toEqual('fiscal_address');
    expect(PT_BR_TO_SERVICE_TYPE['estacao_flex']).toEqual('flex_desk');
    expect(PT_BR_TO_SERVICE_TYPE['estacao_fixa']).toEqual('fixed_desk');
    expect(PT_BR_TO_SERVICE_TYPE['sala_privativa']).toEqual('private_office');
    expect(PT_BR_TO_SERVICE_TYPE['sala_reuniao']).toEqual('meeting_room');
    expect(PT_BR_TO_SERVICE_TYPE['auditorio']).toEqual('auditorium');
  });

  it('should correctly map all English service types to Portuguese keys', () => {
    expect(SERVICE_TYPE_TO_PT_BR['fiscal_address']).toEqual('endereco_fiscal');
    expect(SERVICE_TYPE_TO_PT_BR['flex_desk']).toEqual('estacao_flex');
    expect(SERVICE_TYPE_TO_PT_BR['fixed_desk']).toEqual('estacao_fixa');
    expect(SERVICE_TYPE_TO_PT_BR['private_office']).toEqual('sala_privativa');
    expect(SERVICE_TYPE_TO_PT_BR['meeting_room']).toEqual('sala_reuniao');
    expect(SERVICE_TYPE_TO_PT_BR['auditorium']).toEqual('auditorio');
  });
});

describe('Client Status Mappings', () => {
  it('should correctly map all Portuguese client statuses to English', () => {
    expect(PT_BR_TO_CLIENT_STATUS['ativo']).toEqual('active');
    expect(PT_BR_TO_CLIENT_STATUS['inativo']).toEqual('inactive');
    expect(PT_BR_TO_CLIENT_STATUS['inadimplente']).toEqual('delinquent');
    expect(PT_BR_TO_CLIENT_STATUS['cancelado']).toEqual('canceled');
  });
});

describe('Billing Cycle Mappings', () => {
  it('should correctly map all Portuguese billing cycles to English', () => {
    expect(PT_BR_TO_BILLING_CYCLE['mensal']).toEqual('monthly');
    expect(PT_BR_TO_BILLING_CYCLE['anual']).toEqual('yearly');
  });
});

describe('Proposal Status Mappings', () => {
  it('should correctly map all Portuguese proposal statuses to English', () => {
    expect(PT_BR_TO_PROPOSAL_STATUS['enviada']).toEqual('sent');
    expect(PT_BR_TO_PROPOSAL_STATUS['visualizada']).toEqual('viewed');
    expect(PT_BR_TO_PROPOSAL_STATUS['aceita']).toEqual('accepted');
    expect(PT_BR_TO_PROPOSAL_STATUS['rejeitada']).toEqual('rejected');
    expect(PT_BR_TO_PROPOSAL_STATUS['expirada']).toEqual('expired');
    expect(PT_BR_TO_PROPOSAL_STATUS['em_negociacao']).toEqual('negotiating');
  });
});

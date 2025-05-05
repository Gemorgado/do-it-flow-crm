
import { describe, it, expect } from 'vitest';
import { 
  toServiceType, 
  toProposalStatus, 
  toClientStatus,
  toBillingCycle,
  toServiceStatus,
  toLeadSource,
  toLeadStatus
} from '../enumMappers';

describe('enumMappers', () => {
  describe('toServiceType', () => {
    it('should return correct value for valid English input', () => {
      expect(toServiceType('fiscal_address')).toBe('fiscal_address');
      expect(toServiceType('flex_desk')).toBe('flex_desk');
      expect(toServiceType('fixed_desk')).toBe('fixed_desk');
      expect(toServiceType('private_office')).toBe('private_office');
    });

    it('should convert legacy Portuguese values to English', () => {
      expect(toServiceType('endereco_fiscal')).toBe('fiscal_address');
      expect(toServiceType('estacao_flex')).toBe('flex_desk');
      expect(toServiceType('estacao_fixa')).toBe('fixed_desk');
      expect(toServiceType('sala_privativa')).toBe('private_office');
      expect(toServiceType('sala_reuniao')).toBe('meeting_room');
      expect(toServiceType('auditorio')).toBe('auditorium');
    });

    it('should handle null and undefined inputs', () => {
      expect(toServiceType(null)).toBe('private_office');
      expect(toServiceType(undefined)).toBe('private_office');
    });

    it('should handle unknown values and return default', () => {
      expect(toServiceType('unknown_type')).toBe('private_office');
    });
  });

  describe('toProposalStatus', () => {
    it('should return correct value for valid English input', () => {
      expect(toProposalStatus('draft')).toBe('draft');
      expect(toProposalStatus('sent')).toBe('sent');
      expect(toProposalStatus('viewed')).toBe('viewed');
      expect(toProposalStatus('accepted')).toBe('accepted');
    });

    it('should convert legacy Portuguese values to English', () => {
      expect(toProposalStatus('enviada')).toBe('sent');
      expect(toProposalStatus('visualizada')).toBe('viewed');
      expect(toProposalStatus('aceita')).toBe('accepted');
      expect(toProposalStatus('rejeitada')).toBe('rejected');
      expect(toProposalStatus('expirada')).toBe('expired');
      expect(toProposalStatus('em_negociacao')).toBe('negotiating');
    });

    it('should handle null and undefined inputs', () => {
      expect(toProposalStatus(null)).toBe('draft');
      expect(toProposalStatus(undefined)).toBe('draft');
    });
  });

  describe('toClientStatus', () => {
    it('should return correct value for valid English input', () => {
      expect(toClientStatus('active')).toBe('active');
      expect(toClientStatus('inactive')).toBe('inactive');
      expect(toClientStatus('delinquent')).toBe('delinquent');
      expect(toClientStatus('canceled')).toBe('canceled');
    });

    it('should convert legacy Portuguese values to English', () => {
      expect(toClientStatus('ativo')).toBe('active');
      expect(toClientStatus('inativo')).toBe('inactive');
      expect(toClientStatus('inadimplente')).toBe('delinquent');
      expect(toClientStatus('cancelado')).toBe('canceled');
    });

    it('should handle null and undefined inputs', () => {
      expect(toClientStatus(null)).toBe('active');
      expect(toClientStatus(undefined)).toBe('active');
    });
  });

  describe('toBillingCycle', () => {
    it('should return correct value for valid English input', () => {
      expect(toBillingCycle('monthly')).toBe('monthly');
      expect(toBillingCycle('yearly')).toBe('yearly');
    });

    it('should convert legacy Portuguese values to English', () => {
      expect(toBillingCycle('mensal')).toBe('monthly');
      expect(toBillingCycle('anual')).toBe('yearly');
    });

    it('should handle null and undefined inputs', () => {
      expect(toBillingCycle(null)).toBe('monthly');
      expect(toBillingCycle(undefined)).toBe('monthly');
    });
  });

  describe('toServiceStatus', () => {
    it('should return correct value for valid English input', () => {
      expect(toServiceStatus('active')).toBe('active');
      expect(toServiceStatus('renewal')).toBe('renewal');
      expect(toServiceStatus('canceled')).toBe('canceled');
    });

    it('should convert legacy Portuguese values to English', () => {
      expect(toServiceStatus('ativo')).toBe('active');
      expect(toServiceStatus('em_renovacao')).toBe('renewal');
      expect(toServiceStatus('cancelado')).toBe('canceled');
    });

    it('should handle null and undefined inputs', () => {
      expect(toServiceStatus(null)).toBe('active');
      expect(toServiceStatus(undefined)).toBe('active');
    });
  });

  describe('toLeadSource and toLeadStatus', () => {
    it('should handle values for lead source', () => {
      expect(toLeadSource('site_organico')).toBe('site_organico');
      expect(toLeadSource(null)).toBe('outros');
    });

    it('should handle values for lead status', () => {
      expect(toLeadStatus('novo')).toBe('novo');
      expect(toLeadStatus(null)).toBe('novo');
    });
  });
});

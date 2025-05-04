
import { vi } from 'vitest';
import { Lead, PipelineStage } from '@/types';
import React from 'react';

/**
 * Creates a mock localStorage for testing
 */
export function createMockLocalStorage() {
  return {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn()
  };
}

/**
 * Creates mock pipeline data for testing
 */
export function createMockPipelineData() {
  return {
    leadsByStage: {
      '1': [{ id: '1', name: 'Test Lead 1', stage: { id: '1' } } as Lead],
      '2': [{ id: '2', name: 'Test Lead 2', stage: { id: '2' } } as Lead]
    },
    leadsNeedingAttention: [{ id: '1', name: 'Test Lead 1' } as Lead],
    filteredLeads: [
      { id: '1', name: 'Test Lead 1', stage: { id: '1' } } as Lead,
      { id: '2', name: 'Test Lead 2', stage: { id: '2' } } as Lead
    ],
    handleDragStart: vi.fn(),
    handleDragOver: vi.fn(),
    handleDrop: vi.fn(),
    handleSearchLeads: vi.fn(),
    handleFilterByUser: vi.fn(),
    updateLeadStage: vi.fn(),
    addLeadToPipeline: vi.fn()
  };
}

/**
 * Mock the PipelineBoard component
 */
export function mockPipelineBoard() {
  vi.mock('@/components/Pipeline/PipelineBoard', () => {
    return {
      PipelineBoard: ({ 
        pipelineStages, 
        leadsByStage,
        onDragStart,
        onDragOver,
        onDrop,
        onStageUpdate 
      }: {
        pipelineStages: PipelineStage[],
        leadsByStage: Record<string, Lead[]>,
        onDragStart: (e: React.DragEvent<HTMLDivElement>, lead: Lead) => void,
        onDragOver: (e: React.DragEvent<HTMLDivElement>) => void,
        onDrop: (e: React.DragEvent<HTMLDivElement>, stageId: string) => void,
        onStageUpdate: (leadId: string, newStageId: string) => void
      }) => {
        const MockComponent = () => null; // Simple mock component that renders nothing
        MockComponent.displayName = 'MockPipelineBoard';
        return MockComponent;
      }
    };
  });
}

/**
 * Mock the PipelineSearch component
 */
export function mockPipelineSearch() {
  vi.mock('@/components/Pipeline/PipelineSearch', () => {
    return {
      PipelineSearch: ({ 
        onSearch, 
        onFilterByUser 
      }: { 
        onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void,
        onFilterByUser: (userId: string) => void
      }) => {
        const MockComponent = () => null;
        MockComponent.displayName = 'MockPipelineSearch';
        return MockComponent;
      }
    };
  });
}

/**
 * Mock the PipelineHeader component
 */
export function mockPipelineHeader() {
  vi.mock('@/components/Pipeline/PipelineHeader', () => {
    return {
      PipelineHeader: ({ 
        leadsNeedingAttention 
      }: { 
        leadsNeedingAttention: Lead[] 
      }) => {
        const MockComponent = () => null;
        MockComponent.displayName = 'MockPipelineHeader';
        return MockComponent;
      }
    };
  });
}

/**
 * Register all pipeline component mocks
 */
export function mockPipelineComponents() {
  mockPipelineBoard();
  mockPipelineSearch();
  mockPipelineHeader();
}

/**
 * Registers all pipeline mocks at once
 */
export function registerPipelineMocks() {
  mockPipelineComponents();
}

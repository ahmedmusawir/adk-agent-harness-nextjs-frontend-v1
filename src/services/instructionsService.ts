/**
 * instructionsService — Phase 3 (mock-wired).
 *
 * Mock data swap point. Phase 2 of overall lifecycle replaces these mock
 * imports + bodies with real GCS reads/writes. Method signatures stay identical.
 *
 * @see _project/DATA_CONTRACT.md §2.4
 */

import { mockInstructionsStore } from '@/mocks/data/instructions';
import type { AgentName, InstructionBlob } from '@/types';

const MOCK_DELAY_MS = 200;

export const instructionsService = {
  /**
   * Fetch the instruction blob for an agent.
   * Mock: returns the seeded per-agent instructions.
   */
  fetchInstructions: async (
    agentName: AgentName,
  ): Promise<InstructionBlob> => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    return mockInstructionsStore[agentName];
  },

  /**
   * Persist the instruction blob for an agent.
   * Mock: mutates the in-memory store. Reloads wipe state.
   */
  updateInstructions: async (
    agentName: AgentName,
    content: InstructionBlob,
  ): Promise<void> => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    mockInstructionsStore[agentName] = content;
  },
};

/**
 * BACKEND_SWAP_NOTES
 *
 * Method               | Operation                                                                                  | Notes
 * ---------------------|--------------------------------------------------------------------------------------------|------------------------------------------
 * fetchInstructions    | GCS `blob.download_as_text()` from `gs://{BUCKET}/{BASE_FOLDER}/{agentName}/{agentName}_instructions.txt` | UTF-8 plain text
 * updateInstructions   | GCS `blob.upload_from_string(content, content_type='text/plain')`                          | Overwrites in place, no versioning
 *
 * Open Phase-2 architectural question (per extraction `10-RAW-FINDINGS-AND-QUESTIONS.md` F7):
 *   Direct GCS from Next.js (via API route + service account) OR new wrapper endpoint?
 *   This is Tony's call when Phase 2 of overall lifecycle begins.
 *
 * Phase-1 fidelity quirk (per DATA_CONTRACT §1.11):
 *   On read failure, the original returns literal string `"Error: Could not load instructions for {agent_name}."`
 *   Mock skips error simulation; Phase 6 component tests will mock the service to throw for error UI verification.
 */

/**
 * chatService — Phase 3 (mock-wired).
 *
 * Mock data swap point. Phase 2 of overall lifecycle replaces these mock
 * imports + bodies with real FastAPI wrapper calls. Method signatures stay identical.
 *
 * @see _project/DATA_CONTRACT.md §2.2
 */

import { mockMessagesBySession } from '@/mocks/data/messages';
import { generateMockResponse } from '@/mocks/responses';
import type {
  GetHistoryRequest,
  Message,
  RunAgentRequest,
  RunAgentResponse,
} from '@/types';

const SEND_DELAY_MS = 1000; // visibility for "Agent is thinking..." in Phase 5
const HISTORY_DELAY_MS = 200;

export const chatService = {
  /**
   * Send a chat message to the configured agent.
   * Mock: deterministic agent-voiced response via generateMockResponse.
   */
  sendMessage: async (input: RunAgentRequest): Promise<RunAgentResponse> => {
    await new Promise((r) => setTimeout(r, SEND_DELAY_MS));
    return generateMockResponse(
      input.agent_name,
      input.message,
      input.session_id,
    );
  },

  /**
   * Fetch conversation history for a given agent + session.
   * Mock: returns the seeded conversation for known session_ids; [] otherwise.
   */
  getHistory: async (input: GetHistoryRequest): Promise<Message[]> => {
    await new Promise((r) => setTimeout(r, HISTORY_DELAY_MS));
    return mockMessagesBySession[input.session_id] ?? [];
  },
};

/**
 * BACKEND_SWAP_NOTES
 *
 * Method       | Endpoint                              | Timeout | Notes
 * -------------|---------------------------------------|---------|---------------------------------
 * sendMessage  | POST {WRAPPER_URL}/run_agent          | 90s     | Bare catch → sentinel response with error string in `response` field
 * getHistory   | POST {WRAPPER_URL}/get_history        | 30s     | Client-side guard: if session_id falsy, no HTTP call, return []
 *
 * Error handling per DATA_CONTRACT §1.5:
 *   On client-side HTTP error, return:
 *     { response: "Error: Could not reach Agent Wrapper. Details: <e>", session_id: undefined }
 *   `response` defaults to "Error: No response content." if missing from response body.
 *
 * Wire format: snake_case fields preserved (matches FastAPI/Pydantic convention).
 */

/**
 * Type contract for the Cyberize Agentic Automation frontend.
 *
 * All shapes here mirror `_project/DATA_CONTRACT.md` §1 exactly. Both the
 * mocked service layer (Phase 1) and the real backend (Phase 2 of the broader
 * lifecycle) must satisfy these types.
 *
 * Naming convention:
 *   - Wire shapes (request/response to/from the FastAPI wrapper): snake_case fields
 *   - UI-internal types: camelCase
 */

// =============================================================================
// Aliases and unions
// =============================================================================

/** @see DATA_CONTRACT.md §1.1 — finite union of the 5 configured agents */
export type AgentName =
  | 'greeting_agent'
  | 'jarvis_agent'
  | 'calc_agent'
  | 'product_agent'
  | 'ghl_mcp_agent';

/** @see DATA_CONTRACT.md §1.3 — only `'user'` and `'assistant'` appear in this codebase */
export type MessageRole = 'user' | 'assistant';

/** @see DATA_CONTRACT.md §1.11 — plain UTF-8 instruction text, one blob per agent */
export type InstructionBlob = string;

/** @see DATA_CONTRACT.md §1.8 — agent → session_id map, jsonb in Supabase */
export type AgentSessionMap = Record<AgentName | string, string>;

// =============================================================================
// Entities
// =============================================================================

/** @see DATA_CONTRACT.md §1.1 — frontend-only model; name is both ID and label */
export interface Agent {
  name: AgentName;
}

/** @see DATA_CONTRACT.md §1.2 — frontend reads only these two fields from Supabase */
export interface User {
  id: string;
  email: string;
}

/** @see DATA_CONTRACT.md §1.3 — single chat message; no id, no timestamp in wire format */
export interface Message {
  role: MessageRole;
  content: string;
}

/** @see DATA_CONTRACT.md §1.8 — user's row in `adk_n8n_hybrid_profiles` */
export interface ProfileRow {
  id: string;
  agent_sessions: AgentSessionMap;
}

// =============================================================================
// Wrapper API — wire shapes (snake_case preserved)
// =============================================================================

/** @see DATA_CONTRACT.md §1.4 — outgoing payload for /run_agent */
export interface RunAgentRequest {
  agent_name: AgentName;
  message: string;
  user_id: string;
  session_id: string | null;
}

/** @see DATA_CONTRACT.md §1.5 — incoming response from /run_agent */
export interface RunAgentResponse {
  response: string;
  session_id: string;
}

/** @see DATA_CONTRACT.md §1.6 — outgoing payload for /get_history */
export interface GetHistoryRequest {
  agent_name: AgentName;
  user_id: string;
  session_id: string;
}

/** @see DATA_CONTRACT.md §1.7 — incoming response from /get_history */
export interface GetHistoryResponse {
  history: Message[];
}

// =============================================================================
// Auth — Supabase shapes
// =============================================================================

/** @see DATA_CONTRACT.md §1.9 — outgoing payload for Supabase auth */
export interface LoginRequest {
  email: string;
  password: string;
}

/** @see DATA_CONTRACT.md §1.10 — subset of Supabase auth response the frontend reads */
export interface LoginResponse {
  session: {
    user: {
      id: string;
      email: string;
    };
  };
}

// =============================================================================
// Runtime configuration
// =============================================================================

/** @see DATA_CONTRACT.md §1.12 — runtime configuration loaded at boot */
export interface AppConfig {
  appEnv: 'local' | 'cloud';
  wrapperUrl: string;
  agentOptions: AgentName[];
}

/**
 * chatStore — Zustand state for the cyberize chat experience.
 *
 * Phase 5.5 refactor: messages are now per-agent (`messagesByAgent`) for
 * cross-agent retention. Switching to a previously-visited agent shows that
 * agent's preserved thread.
 *
 * In-memory only; reloads wipe. Cross-reload persistence deferred to overall-
 * lifecycle Phase 2 (real Supabase or IndexedDB) — see operator decision in
 * agent_docs/SESSIONS/session_2026-05-28.md.
 *
 * @see _project/DATA_CONTRACT.md §1 for the underlying types
 */

import { create } from "zustand";

import type { AgentName, AgentSessionMap, Message } from "@/types";

const DEFAULT_AGENT: AgentName = "greeting_agent";

interface ChatState {
  selectedAgent: AgentName;
  lastSelectedAgent: AgentName | null;
  /** Per-agent message history. Undefined = not yet loaded. Empty array = loaded, no messages. */
  messagesByAgent: Record<string, Message[]>;
  agentSessions: AgentSessionMap;
  isLoading: boolean;
  error: string | null;

  setSelectedAgent: (name: AgentName) => void;
  /** Replace messages for a specific agent (typically after a history fetch) */
  setMessagesForAgent: (agent: AgentName, messages: Message[]) => void;
  /** Append a single message to a specific agent's thread */
  appendMessageForAgent: (agent: AgentName, message: Message) => void;
  /** Truncate an agent's messages, keeping only items at index `0..keepThroughIndex` (inclusive). Use -1 to clear. */
  truncateAfterIndex: (agent: AgentName, keepThroughIndex: number) => void;
  setAgentSessions: (sessions: AgentSessionMap) => void;
  setSession: (agent: AgentName, sessionId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  selectedAgent: DEFAULT_AGENT,
  lastSelectedAgent: null,
  messagesByAgent: {} as Record<string, Message[]>,
  agentSessions: {} as AgentSessionMap,
  isLoading: false,
  error: null,
};

export const useChatStore = create<ChatState>((set) => ({
  ...INITIAL_STATE,
  setSelectedAgent: (name) =>
    set((state) => ({
      selectedAgent: name,
      lastSelectedAgent: state.selectedAgent,
    })),
  setMessagesForAgent: (agent, messages) =>
    set((state) => ({
      messagesByAgent: { ...state.messagesByAgent, [agent]: messages },
    })),
  appendMessageForAgent: (agent, message) =>
    set((state) => ({
      messagesByAgent: {
        ...state.messagesByAgent,
        [agent]: [...(state.messagesByAgent[agent] ?? []), message],
      },
    })),
  truncateAfterIndex: (agent, keepThroughIndex) =>
    set((state) => {
      const current = state.messagesByAgent[agent] ?? [];
      const next =
        keepThroughIndex < 0 ? [] : current.slice(0, keepThroughIndex + 1);
      return {
        messagesByAgent: { ...state.messagesByAgent, [agent]: next },
      };
    }),
  setAgentSessions: (sessions) => set({ agentSessions: sessions }),
  setSession: (agent, sessionId) =>
    set((state) => ({
      agentSessions: { ...state.agentSessions, [agent]: sessionId },
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set(INITIAL_STATE),
}));

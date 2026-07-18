"use client";

import { useEffect, useRef, useState } from "react";

import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/chatStore";
import { chatService } from "@/services/chatService";
import { profileService } from "@/services/profileService";

import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";

export const ChatPageContent = () => {
  const user = useAuthStore((s) => s.user);
  const selectedAgent = useChatStore((s) => s.selectedAgent);
  const setMessagesForAgent = useChatStore((s) => s.setMessagesForAgent);
  const appendMessageForAgent = useChatStore((s) => s.appendMessageForAgent);
  const truncateAfterIndex = useChatStore((s) => s.truncateAfterIndex);
  const setAgentSessions = useChatStore((s) => s.setAgentSessions);
  const setSession = useChatStore((s) => s.setSession);
  const setLoading = useChatStore((s) => s.setLoading);
  const setError = useChatStore((s) => s.setError);

  const userId =
    user && typeof user === "object" && "id" in user
      ? String((user as { id: unknown }).id ?? "")
      : "";

  // Tracks initial profile-fetch completion to prevent the agent-switch effect
  // from racing the mount effect on first render.
  const hasMountedRef = useRef(false);

  // Edit-message state. When non-null, the chat input is prefilled with
  // editingValue and submitting will truncate + replace from that point.
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");

  // Mount effect: fetch profile + load initial history for the default agent.
  // FIX-001 (amended): merge the fetched profile with the persisted map
  // (hydrated from localStorage before effects run) — PERSISTED wins per-key,
  // fetched fills gaps. While profileService is mocked it returns SEEDED fake
  // session ids; letting those win would overwrite the genuine persisted
  // pointer and getHistory would query a nonexistent session. This precedence
  // MUST be revisited when profileService goes real (server becomes truth).
  useEffect(() => {
    if (!userId) return;
    void profileService.fetchProfile(userId).then(async (fetched) => {
      const sessions = {
        ...fetched,
        ...useChatStore.getState().agentSessions,
      };
      setAgentSessions(sessions);
      const sessionId = sessions[selectedAgent];
      if (sessionId) {
        const history = await chatService.getHistory({
          agent_name: selectedAgent,
          user_id: userId,
          session_id: sessionId,
        });
        setMessagesForAgent(selectedAgent, history);
      } else {
        setMessagesForAgent(selectedAgent, []);
      }
      hasMountedRef.current = true;
    });
    // selectedAgent intentionally not in deps — mount-only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, setAgentSessions, setMessagesForAgent]);

  // Agent-switch effect: lazy-load each agent's history on first visit.
  // Per-agent retention: if already loaded, just display; don't refetch.
  useEffect(() => {
    if (!hasMountedRef.current) return;
    const state = useChatStore.getState();
    const existing = state.messagesByAgent[selectedAgent];
    if (existing !== undefined) {
      // already loaded — display in place
      return;
    }
    const sessionId = state.agentSessions[selectedAgent];
    if (!sessionId) {
      setMessagesForAgent(selectedAgent, []);
      return;
    }
    void chatService
      .getHistory({
        agent_name: selectedAgent,
        user_id: userId,
        session_id: sessionId,
      })
      .then((history) => setMessagesForAgent(selectedAgent, history));
  }, [selectedAgent, userId, setMessagesForAgent]);

  const runSendMessage = async (content: string) => {
    if (!userId) return;
    setError(null);
    appendMessageForAgent(selectedAgent, { role: "user", content });
    setLoading(true);

    const existing =
      useChatStore.getState().agentSessions[selectedAgent] ?? null;
    const response = await chatService
      .sendMessage({
        agent_name: selectedAgent,
        message: content,
        user_id: userId,
        session_id: existing,
      })
      .catch((err: Error) => {
        setError(err.message || "Failed to reach the agent. Please try again.");
        setLoading(false);
        return null;
      });

    if (!response) return;

    appendMessageForAgent(selectedAgent, {
      role: "assistant",
      content: response.response,
    });
    setLoading(false);

    // Save profile if this was the first message in a new session
    if (!existing && response.session_id) {
      setSession(selectedAgent, response.session_id);
      const currentSessions = useChatStore.getState().agentSessions;
      void profileService
        .saveProfile(userId, currentSessions)
        .catch((err: Error) => {
          setError(`Profile save warning: ${err.message}`);
        });
    }
  };

  const handleSubmit = async (content: string) => {
    if (editingIndex !== null) {
      // Edit flow: truncate to drop original user message + everything after,
      // then append the edited user message via the normal send flow.
      truncateAfterIndex(selectedAgent, editingIndex - 1);
      setEditingIndex(null);
      setEditingValue("");
    }
    await runSendMessage(content);
  };

  const handleEditUserMessage = (index: number) => {
    const messages =
      useChatStore.getState().messagesByAgent[selectedAgent] ?? [];
    const target = messages[index];
    if (!target || target.role !== "user") return;
    setEditingIndex(index);
    setEditingValue(target.content);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const doRegenerate = async () => {
    if (!userId) return;
    const messages =
      useChatStore.getState().messagesByAgent[selectedAgent] ?? [];
    if (messages.length < 2) return;
    let lastUserIdx = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        lastUserIdx = i;
        break;
      }
    }
    if (lastUserIdx === -1) return;
    const lastUser = messages[lastUserIdx];

    // Truncate to keep up through the user message
    truncateAfterIndex(selectedAgent, lastUserIdx);
    setError(null);
    setLoading(true);

    const existing =
      useChatStore.getState().agentSessions[selectedAgent] ?? null;
    const response = await chatService
      .sendMessage({
        agent_name: selectedAgent,
        message: lastUser.content,
        user_id: userId,
        session_id: existing,
      })
      .catch((err: Error) => {
        setError(
          err.message || "Failed to regenerate. Please try again.",
        );
        setLoading(false);
        return null;
      });

    if (!response) return;

    appendMessageForAgent(selectedAgent, {
      role: "assistant",
      content: response.response,
    });
    setLoading(false);
  };

  const handleFeedback = (direction: "up" | "down", index: number) => {
    // eslint-disable-next-line no-console
    console.info(
      `[ChatPageContent] feedback ${direction} for agent=${selectedAgent} msgIndex=${index}`,
    );
    // Future: POST to feedback endpoint.
  };

  return (
    <div className="flex flex-col h-full">
      <MessageList
        onEditUserMessage={handleEditUserMessage}
        onRegenerate={doRegenerate}
        onFeedback={handleFeedback}
      />
      <ChatInput
        key={editingIndex ?? "fresh"}
        onSubmit={handleSubmit}
        initialValue={editingIndex !== null ? editingValue : undefined}
        isEditing={editingIndex !== null}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  );
};

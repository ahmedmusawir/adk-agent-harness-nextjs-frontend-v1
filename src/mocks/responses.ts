/**
 * Mock response generator for `chatService.sendMessage`.
 *
 * Deterministic: same (agentName, userMessage) → same response text.
 * The session_id is fresh on first call (input.session_id === null) using
 * Date.now() — session IDs are conventionally fresh per session, so
 * non-determinism there is expected. Reused on subsequent calls.
 *
 * @see _project/DATA_CONTRACT.md §3.4
 */

import type { AgentName, RunAgentResponse } from '@/types';

export function generateMockResponse(
  agentName: AgentName,
  userMessage: string,
  sessionId: string | null,
): RunAgentResponse {
  const session_id = sessionId ?? `mock-session-${Date.now()}`;
  const response = composeAgentVoiceResponse(agentName, userMessage);
  return { response, session_id };
}

function composeAgentVoiceResponse(
  agentName: AgentName,
  userMessage: string,
): string {
  const trimmed = userMessage.trim();
  const echo = trimmed.length > 0 ? `"${trimmed}"` : '(empty message)';

  switch (agentName) {
    case 'greeting_agent':
      return `Hey, got it — you said ${echo}. Anything else you'd like to chat about?`;

    case 'jarvis_agent':
      return `Of course, sir. Regarding ${echo} — I'll attend to that right away, Mr. Stark.\n\n*Compiling a brief summary...*`;

    case 'calc_agent':
      return `Rico here. Let me work on ${echo}:\n\n\`\`\`python\n# Computing based on your input\nresult = 42  # placeholder for mock\nprint(f"Result: {result}")\n\`\`\`\n\n**Result: 42**\n\nNeed me to refine that or run another scenario?`;

    case 'product_agent':
      return `Good question on ${echo}. The short answer depends on which plan tier you're comparing against — could you tell me whether you're on Starter, Pro, or Enterprise? Once I know that, I can give you the exact answer.`;

    case 'ghl_mcp_agent':
      return `Tool I'm using: \`contacts_get_contacts\`   Reason: To address ${echo} via the CRM.\n\n| Name | Email | Phone |\n|------|-------|-------|\n| Sample Contact | sample@example.com | +1-555-0000 |\n\nLet me know if you want me to filter further.`;
  }
}

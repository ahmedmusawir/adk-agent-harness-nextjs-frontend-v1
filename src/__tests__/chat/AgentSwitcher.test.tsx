/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockSetSelectedAgent = jest.fn();

interface MockSlice {
  selectedAgent: string;
  setSelectedAgent: typeof mockSetSelectedAgent;
}

let mockState: MockSlice = {
  selectedAgent: "greeting_agent",
  setSelectedAgent: mockSetSelectedAgent,
};

jest.mock("@/store/chatStore", () => ({
  useChatStore: (selector: (state: MockSlice) => unknown) => selector(mockState),
}));

import { AgentSwitcher } from "@/components/chat/AgentSwitcher";

describe("AgentSwitcher", () => {
  beforeEach(() => {
    mockSetSelectedAgent.mockReset();
    mockState = {
      selectedAgent: "greeting_agent",
      setSelectedAgent: mockSetSelectedAgent,
    };
  });

  it("renders all 5 agents from the configured registry", () => {
    render(<AgentSwitcher />);
    expect(
      screen.getByRole("button", { name: /greeting_agent/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /jarvis_agent/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /calc_agent/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /product_agent/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ghl_mcp_agent/i }),
    ).toBeInTheDocument();
  });

  it("calls setSelectedAgent with the chosen agent when clicked", async () => {
    const user = userEvent.setup();
    render(<AgentSwitcher />);
    await user.click(screen.getByRole("button", { name: /jarvis_agent/i }));
    expect(mockSetSelectedAgent).toHaveBeenCalledWith("jarvis_agent");
  });
});

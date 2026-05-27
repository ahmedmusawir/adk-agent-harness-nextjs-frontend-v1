/**
 * @jest-environment jsdom
 */

/**
 * LoginForm unit tests.
 *
 * Intent (Rule K9): verify the cyberize login form's specific behaviors —
 * eye-toggle, post-login redirect to /chat (NOT the kit's role-based default),
 * error Alert on failure. These behaviors are what distinguish the cyberize
 * form from the kit's original.
 */

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

const mockLogin = jest.fn();
jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: (selector: (state: { login: typeof mockLogin }) => unknown) =>
    selector({ login: mockLogin }),
}));

jest.mock("@/components/common/Spinner", () => ({
  __esModule: true,
  default: () => <span data-testid="spinner">Loading</span>,
}));

import LoginForm from "@/components/auth/LoginForm";

describe("LoginForm (cyberize)", () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockPush.mockReset();
    mockRefresh.mockReset();
  });

  it("renders the Mission Control title, email + password inputs, and Authenticate button", () => {
    render(<LoginForm />);
    expect(
      screen.getByRole("heading", { name: /mission control login/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /authenticate/i }),
    ).toBeInTheDocument();
  });

  it("starts with the Authenticate button enabled", () => {
    render(<LoginForm />);
    expect(
      screen.getByRole("button", { name: /authenticate/i }),
    ).not.toBeDisabled();
  });

  it("eye toggle switches the password input between password and text type", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = screen.getByRole("button", { name: /show password/i });
    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");

    const hideToggle = screen.getByRole("button", { name: /hide password/i });
    await user.click(hideToggle);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("submits credentials, discards the kit's role-based redirect, and pushes /chat on success", async () => {
    mockLogin.mockResolvedValueOnce("/admin-portal");
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "secret");
    await user.click(screen.getByRole("button", { name: /authenticate/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "secret");
      expect(mockPush).toHaveBeenCalledWith("/chat");
    });
    expect(mockPush).not.toHaveBeenCalledWith("/admin-portal");
  });

  it("shows a destructive Alert on auth failure and does not redirect", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "wrong@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "bad");
    await user.click(screen.getByRole("button", { name: /authenticate/i }));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent(/invalid credentials/i);
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});

import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "@/app/page";

const mocks = vi.hoisted(() => ({
  searchParamsValue: "",
  routerPush: vi.fn(),
  toast: vi.fn(),
  getCurrentUser: vi.fn(),
  getAllSites: vi.fn(),
  getSiteAnalytics: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.routerPush }),
  useSearchParams: () => ({
    get: (key: string) => (key === "for" ? mocks.searchParamsValue : null),
  }),
}));

vi.mock("@/lib/api", () => ({
  authApi: {
    getCurrentUser: mocks.getCurrentUser,
  },
  sitesApi: {
    getAllSites: mocks.getAllSites,
    getSiteAnalytics: mocks.getSiteAnalytics,
  },
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mocks.toast }),
}));

vi.mock("@/components/dashboard/dashboard-shell", () => ({
  DashboardShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-shell">{children}</div>
  ),
}));

vi.mock("@/components/dashboard/dashboard-header", () => ({
  DashboardHeader: ({ heading, text }: { heading: string; text: string }) => (
    <header>
      <h1>{heading}</h1>
      <p>{text}</p>
    </header>
  ),
}));

vi.mock("@/components/dashboard/overview", () => ({
  Overview: ({ data }: { data: Array<{ day: string; unique_visitors: number }> }) => (
    <section data-testid="overview">{data.map((point) => point.day).join(",")}</section>
  ),
}));

vi.mock("@/components/dashboard/top-sources", () => ({
  TopSources: ({ data }: { data: Array<{ referrer: string; count: number }> }) => (
    <section data-testid="top-sources">{data.length}</section>
  ),
}));

vi.mock("@/components/dashboard/top-pages", () => ({
  TopPages: ({ data }: { data: Array<{ page: string; count: number }> }) => (
    <section data-testid="top-pages">{data.length}</section>
  ),
}));

vi.mock("@/components/dashboard/recent-sales", () => ({
  RecentSales: ({ data }: { data: Array<{ device_type: string; count: number }> }) => (
    <section data-testid="recent-sales">{data.length}</section>
  ),
}));

vi.mock("@/components/dashboard/site-stats", () => ({
  SiteStats: ({ title, value }: { title: string; value: string }) => (
    <section data-testid="site-stats">
      <strong>{title}</strong>
      <span>{value}</span>
    </section>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.searchParamsValue = "";
});

describe("DashboardPage", () => {
  it("redirects unauthenticated users to the login page", async () => {
    mocks.getCurrentUser.mockRejectedValue(new Error("not signed in"));

    render(<DashboardPage />);

    await waitFor(() => {
      expect(mocks.routerPush).toHaveBeenCalledWith("/login");
    });
  });

  it("redirects users without email verification to the verification page", async () => {
    mocks.getCurrentUser.mockResolvedValue({ email_verified: false });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(mocks.routerPush).toHaveBeenCalledWith("/verify");
    });
  });

  it("shows the empty state when no sites are available", async () => {
    mocks.getCurrentUser.mockResolvedValue({ email_verified: true });
    mocks.getAllSites.mockResolvedValue([]);

    render(<DashboardPage />);

    expect(await screen.findByText("No sites found")).toBeInTheDocument();
    expect(screen.getByText("Add Your First Site")).toBeInTheDocument();
  });

  it("loads the selected site and renders dashboard metrics", async () => {
    mocks.searchParamsValue = "site-2";
    mocks.getCurrentUser.mockResolvedValue({ email_verified: true });
    mocks.getAllSites.mockResolvedValue([
      { id: "site-1", site_url: "https://one.example", created_at: "", updated_at: "", user_id: "u1" },
      { id: "site-2", site_url: "https://two.example", created_at: "", updated_at: "", user_id: "u1" },
    ]);
    mocks.getSiteAnalytics.mockResolvedValue({
      unique_visitors: 128,
      page_views: 240,
      top_pages: [{ page: "/", count: 140 }],
      top_referrers: [{ referrer: "https://example.com", count: 12 }],
      device_stats: [{ device_type: "Desktop", count: 84 }],
      visitor_graph: [{ day: "2026-04-01", unique_visitors: 12 }],
    });

    render(<DashboardPage />);

    expect(await screen.findByText("Analytics: https://two.example")).toBeInTheDocument();
    expect(await screen.findByText("Unique Visitors")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
    expect(screen.getByText("240")).toBeInTheDocument();
    expect(screen.getByTestId("overview")).toHaveTextContent("2026-04-01");

    expect(mocks.getSiteAnalytics).toHaveBeenCalledWith(
      "site-2",
      expect.any(Date),
      expect.any(Date)
    );
  });
});
import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchApi, sitesApi } from "@/lib/api";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchApi", () => {
  it("sends JSON requests with credentials and parses responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: vi.fn().mockResolvedValue('{"message":"ok"}'),
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchApi<{ message: string }>("/health", {
      method: "POST",
      body: JSON.stringify({ ping: true }),
    });

    expect(result).toEqual({ message: "ok" });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:6788/health",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("throws the server error body when a request fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      text: vi.fn().mockResolvedValue("service unavailable"),
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchApi("/health")).rejects.toMatchObject({
      message: "service unavailable",
      status: 503,
    });
  });
});

describe("sitesApi", () => {
  it("builds the analytics date range query correctly", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: vi.fn().mockResolvedValue('{"page_views":12}'),
    });

    vi.stubGlobal("fetch", fetchMock);

    await sitesApi.getSiteAnalytics(
      "site-123",
      new Date("2026-04-06T00:00:00.000Z"),
      new Date("2026-04-07T00:00:00.000Z")
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:6788/sites/site-123/analytics?from=2026-04-06&to=2026-04-07",
      expect.objectContaining({
        credentials: "include",
      })
    );
  });
});
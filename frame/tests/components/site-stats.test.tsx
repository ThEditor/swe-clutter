import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteStats } from "@/components/dashboard/site-stats";

describe("SiteStats", () => {
  it("renders the metric label and value", () => {
    render(<SiteStats title="Unique Visitors" value="128" diff={12} />);

    expect(screen.getByText("Unique Visitors")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
    expect(screen.getByText("Compared to previous period")).toBeInTheDocument();
  });
});
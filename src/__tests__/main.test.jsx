import ReactDOM from "react-dom/client";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("main.jsx", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.resetModules();
  });

  it("renders without crashing", async () => {

    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);

    const createRootSpy = vi.spyOn(ReactDOM, "createRoot").mockImplementation(() => ({
      render: vi.fn(),
    }));

    await import("../main");

    expect(createRootSpy).toHaveBeenCalled();
  });
});

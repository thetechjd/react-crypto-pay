import { render, screen } from "@testing-library/react";
import WaveLoading from "../components/WaveLoading";
import { describe,it,expect} from "vitest";

describe("WaveLoading", () => {
  it("renders 5 animated boxes", () => {
    render(<WaveLoading />);
    const containers = screen.getAllByTestId("wave-container");
    expect(containers[0].children.length).toBe(5);
  });

  it("renders with custom props", () => {
    render(<WaveLoading color="red" speed={2} size="large" />);
    const containers = screen.getAllByTestId("wave-container");
    const lastContainer = containers[containers.length - 1];
    expect(lastContainer).not.toBeNull();
    const computedStyle = window.getComputedStyle(lastContainer);
    expect(computedStyle.height).toBe("36px");
  });
});

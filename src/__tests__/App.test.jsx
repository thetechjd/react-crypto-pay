import { render, screen, cleanup } from '@testing-library/react'
import {beforeEach, afterEach,describe, expect, it, test,vi } from "vitest";
import App from '../App'

describe('App Component', () => {
  let addEventListenerSpy;
  let removeEventListenerSpy;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

//   it('attaches and removes message event listener on mount/unmount', () => {
//     const { unmount } = render(<App />);

//     expect(addEventListenerSpy).toHaveBeenCalledWith(
//       'message',
//       expect.any(Function)
//     );

//     unmount();
//     expect(removeEventListenerSpy).toHaveBeenCalledWith(
//       'message',
//       expect.any(Function)
//     );
//   });

  it('renders CryptoPayButton with label', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Pay with Crypto/i })).to.exist;
  });

  it('logs message on success callback', async() => {
    const logSpy = vi.spyOn(console, 'log');

    const mockWindow = { location: {}, close: vi.fn() };
    vi.stubGlobal("open", vi.fn(() => mockWindow));

    global.fetch = vi.fn(() =>
            Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}), // optional
            })
        );

    localStorage.setItem("pk_xl0v4jIHnZbIowGwwTPy1JylV8ApPN2y-cart", JSON.stringify([{ displayName: "test", productId: "test123" }]));

    render(<App />);
    const successButton = screen.getByText(/pay with crypto/i);    
    successButton.click();

    // Wait for async behavior
    await new Promise((r) => setTimeout(r, 0)); 
    const messageEvent = new MessageEvent("message", {
         data: "Receipt added successfully",
    });
    window.dispatchEvent(messageEvent);

    expect(logSpy.mock.calls[0][0]).toContain("making sure it logs");
    expect(logSpy.mock.calls[2][0]).toContain("You are not using a mobile device.");
    expect(logSpy.mock.calls[3][0]).toContain("Navigating to:");
    expect(logSpy.mock.calls[4][0]).toContain("event success");
    expect(logSpy.mock.calls[5][1]).toContain("Receipt added successfully");
    expect(logSpy.mock.calls[6][0]).toContain("we did it!")
    expect(logSpy.mock.calls[7][0]).toContain("did something");
    expect(open).toHaveBeenCalled();

    logSpy.mockRestore();
  });
});

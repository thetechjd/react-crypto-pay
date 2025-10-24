import {beforeEach, afterEach,describe, expect, it, test,vi } from "vitest";
import { render, screen, fireEvent,getAllByText,cleanup,waitFor,getByTestId } from "@testing-library/react";
import CryptoPayButton from "../components/CryptoPayButton";
describe("CryptoPayButton", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.resetAllMocks();

        Object.defineProperty(window, "location", {
            writable: true,
            value: {
                search: "?referrer=rakeshummadi28",
            }
        })
    });

    afterEach(() => {
        cleanup();
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it("should store cart item on localstorage",()=>{
        vi.stubGlobal("navigator", { userAgent: "Windows" });

        Object.defineProperty(window, "openPortal", {
            writable: true,
            value: {search:'?referrer=rakeshummadi28'}
        })

        const logSpy = vi.spyOn(console, "log");

        render(
            <CryptoPayButton
                apiKey={'123'}
                productId={'test123'}
                displayName={'test'}
                email='required'
                shippingAddress={null}
                label='Pay with Crypto'
                style={null}
                cartStyle={null}
                lang='en'
                eth='true'
                sol="true"
            />
        )
        
        fireEvent.click(document.querySelector("button"));

        // verify cart item was stored
        const stored = JSON.parse(localStorage.getItem("123-cart"));
        expect(stored).toMatchObject([{
        displayName: "test",
        productId: "test123",
        }]);
        expect(logSpy.mock.calls[1][0]).toContain("You are not using a mobile device.") 
    })
    

    it("should call setShowModal on mobile",()=>{
        vi.stubGlobal("navigator", { userAgent: "iphone" });

        const logspy =vi.spyOn(console, "log");
        
        const {getAllByText} =  render(
            <CryptoPayButton
                apiKey={'123'}
                productId={'test123'}
                displayName={'test'}
                email='required'
                shippingAddress={null}
                label='Pay with Crypto'
                style={null}
                cartStyle={null}
                lang='en'
                eth='true'
                sol="true"
            />
        )

        const buttons = getAllByText("Pay with Crypto");
        fireEvent.click(buttons[0]);
        expect(logspy).toHaveBeenCalledWith("You are using a mobile device.");
    })

    it("should show the mobile payment options on mobile",()=>{
        vi.stubGlobal(
            navigator,
            { userAgent: "iphone" }
        )

        const { getAllByText } = render(
            <CryptoPayButton
                apiKey={'123'}
                productId={'test123'}
                displayName={'test'}
                email='required'
                shippingAddress={null}
                label='Pay with Crypto'
                style={null}
                cartStyle={null}
                lang='en'
                eth='true'
                sol="true"
            />
        );

        const buttons = getAllByText("Pay with Crypto");
        fireEvent.click(buttons[0]);
       expect(screen.getByRole('button', { name: /Open Metamask/i })).to.exist;
       expect(screen.getByRole('button', { name: /Open Phantom/i })).to.exist;
       expect(screen.getByRole('button', { name: /Open Coinbase/i })).to.exist;

        
    })

    it("Should be able to redirect to the metamask on button click with productId when cart is null",()=>{
        vi.stubGlobal("navigator",{userAgent:"iphone"})
        
        const origialLocation =window.location;
        delete window.location;
        window.location = {href:""};

        render(
            <CryptoPayButton
                apiKey={'123'}
                productId={'test123'}
                displayName={'test'}
                email='required'
                shippingAddress={null}
                label='Pay with Crypto'
                style={null}
                cartStyle={null}
                lang='en'
                eth='true'
                sol="true"
            />
        )

        const payButton = screen.getAllByText("Pay with Crypto")[0];
        fireEvent.click(payButton);
        
        localStorage.removeItem("123-cart");
        
        const metamaskButton = screen.getByRole('button',{name:"Open Metamask"});
        fireEvent.click(metamaskButton);

        expect(window.location.href).toContain("https://metamask.app.link/dapp/portal.cryptocadet.app");
        expect(window.location.href).toContain("pubKey=123");
        expect(window.location.href).toContain("prod=");
        expect(window.location.href).toContain("email=required");
        expect(window.location.href).toContain("walletApp=true");

        window.location = origialLocation
    })

    it("Should redirect to the metamask on button click",()=>{
        vi.stubGlobal("navigator",{userAgent:"iphone"})
        
        const origialLocation =window.location;
        delete window.location;
        window.location = {href:""};

        render(
            <CryptoPayButton
                apiKey={'123'}
                productId={'test123'}
                displayName={'test'}
                email='required'
                shippingAddress={null}
                label='Pay with Crypto'
                style={null}
                cartStyle={null}
                lang='en'
                eth='true'
                sol="true"
            />
        )

        const payButton = screen.getAllByText("Pay with Crypto")[0];
        fireEvent.click(payButton);


        const metamaskButton = screen.getByRole('button',{name:"Open Metamask"});
        fireEvent.click(metamaskButton);

        expect(window.location.href).toContain("https://metamask.app.link/dapp/portal.cryptocadet.app");
        expect(window.location.href).toContain("pubKey=123");
        expect(window.location.href).toContain("prod=");
        expect(window.location.href).toContain("email=required");
        expect(window.location.href).toContain("walletApp=true");

        window.location = origialLocation
    })

    it("Should redirect to the Coinbase on button click",()=>{
        vi.stubGlobal("navigator",{userAgent:"iphone"})
        
        const origialLocation =window.location;
        delete window.location;
        window.location = {href:""};

        render(
            <CryptoPayButton
                apiKey={'123'}
                productId={'test123'}
                displayName={'test'}
                email='required'
                shippingAddress={null}
                label='Pay with Crypto'
                style={null}
                cartStyle={null}
                lang='en'
                eth='true'
                sol="true"
            />
        )

        const payButton = screen.getAllByText("Pay with Crypto")[0];
        fireEvent.click(payButton);


        const metamaskButton = screen.getByRole('button',{name:"Open CoinBase"});
        fireEvent.click(metamaskButton);

        expect(window.location.href).toContain("https://go.cb-w.com/dapp?cb_url=https%3A%2F%2Fportal.cryptocadet.app");
        expect(window.location.href).toContain("pubKey%3D123");
        const decoded = decodeURIComponent(window.location.href);
        expect(decoded).toContain("prod=[{\"displayName\":\"test\",\"productId\":\"test123\"}]");

        window.location = origialLocation
    })


    it("Should able to redirect to the Coinbase on button click with productId when cart is null",()=>{
        vi.stubGlobal("navigator",{userAgent:"iphone"})
        
        const origialLocation =window.location;
        delete window.location;
        window.location = {href:""};

        render(
            <CryptoPayButton
                apiKey={'123'}
                productId={'test123'}
                displayName={'test'}
                email='required'
                shippingAddress={null}
                label='Pay with Crypto'
                style={null}
                cartStyle={null}
                lang='en'
                eth='true'
                sol="true"
            />
        )

        const payButton = screen.getAllByText("Pay with Crypto")[0];
        fireEvent.click(payButton);

        localStorage.removeItem("123-cart");

        const metamaskButton = screen.getByRole('button',{name:"Open CoinBase"});
        fireEvent.click(metamaskButton);

        expect(window.location.href).toContain("https://go.cb-w.com/dapp?cb_url=https%3A%2F%2Fportal.cryptocadet.app");
        expect(window.location.href).toContain("pubKey%3D123");
        expect(window.location.href).toContain("prod%3Dtest123");
        window.location = origialLocation
    })

    it("Should redirect to the Phantom on button click when shoppingCart true",()=>{
        vi.stubGlobal("navigator",{userAgent:"iphone"})
        
        const origialLocation =window.location;
        delete window.location;
        window.location = {href:""};

        render(
            <CryptoPayButton
                apiKey={'123'}
                productId={'test123'}
                displayName={'test'}
                email='required'
                shippingAddress={null}
                label='Pay with Crypto'
                style={null}
                cartStyle={null}
                lang='en'
                eth='true'
                sol="true"
                noQuantity="1"
                priceOnly="true"
            />
        )

        const payButton = screen.getAllByText("Pay with Crypto")[0];
        fireEvent.click(payButton);


        const metamaskButton = screen.getByRole('button',{name:"Open Phantom"});
        fireEvent.click(metamaskButton);

        expect(window.location.href).toContain("https://phantom.app/ul/browse/");

        const queryParams = new URLSearchParams({
            pubKey: "123",
            prod: "test123",
            email: "required",
            shippingAddress: null,
            lang: "en",
            shoppingCart: localStorage.getItem("123-cart") ? true : false ,
            noQuantity:1,
            walletApp: true,
            priceOnly: true,
            ref: "https://cryptocadet.io"
            });

        const encodedUrl = encodeURIComponent(`https://portal.cryptocadet.app?${queryParams.toString()}`);
        expect(window.location.href).toContain(`https://phantom.app/ul/browse/${encodedUrl}`);

        window.location = origialLocation
    })

    it("Should redirect to the Phantom on button click when shoppingCart false",()=>{
        vi.stubGlobal("navigator",{userAgent:"iphone"})
        
        const origialLocation =window.location;
        delete window.location;
        window.location = {href:""};

        render(
            <CryptoPayButton
                apiKey={'123'}
                productId={'test123'}
                displayName={'test'}
                email='required'
                shippingAddress={null}
                label='Pay with Crypto'
                style={null}
                cartStyle={null}
                lang='en'
                eth='true'
                sol="true"
                noQuantity="1"
                priceOnly="true"
            />
        )

        const payButton = screen.getAllByText("Pay with Crypto")[0];
        fireEvent.click(payButton);

        localStorage.removeItem("123-cart");


        const metamaskButton = screen.getByRole('button',{name:"Open Phantom"});
        fireEvent.click(metamaskButton);

        expect(window.location.href).toContain("https://phantom.app/ul/browse/");

        const queryParams = new URLSearchParams({
            pubKey: "123",
            prod: "test123",
            email: "required",
            shippingAddress: null,
            lang: "en",
            shoppingCart: localStorage.getItem("123-cart") ? true : false ,
            noQuantity:1,
            walletApp: true,
            priceOnly: true,
            ref: "https://cryptocadet.io"
            });

        const encodedUrl = encodeURIComponent(`https://portal.cryptocadet.app?${queryParams.toString()}`);
        expect(window.location.href).toContain(`https://phantom.app/ul/browse/${encodedUrl}`);

        window.location = origialLocation
    })

    it("should able to click cart icon in desktop",()=>{
        vi.stubGlobal("navigator", { userAgent: "windows" });
        
        render(
            <CryptoPayButton
                apiKey={'123'}
                productId={'test123'}
                displayName={'test'}
                email='required'
                shippingAddress={null}
                label='Pay with Crypto'
                style={null}
                cartStyle={null}
                shoppingCart={true}
                lang='en'
                eth='true'
                sol="true"
            />
        )

        const cartButton =  screen.getByRole("button",{name:"🛒"})

        fireEvent.click(cartButton);
         // verify cart item was stored
        const stored = JSON.parse(localStorage.getItem("123-cart"));
        expect(stored).toMatchObject([{
        displayName: "test",
        productId: "test123",
        }]);


    })

    it("should call openPortal on desktop and log message", async () => {
        vi.stubGlobal("navigator", { userAgent: "windows" });

        const logSpy = vi.spyOn(console, "log");

        const mockWindow = { location: {}, close: vi.fn() };
        vi.stubGlobal("open", vi.fn(() => mockWindow));

        global.fetch = vi.fn(() =>
            Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}), // optional
            })
        );

        localStorage.setItem("pk_xl0v4jIHnZbIowGwwTPy1JylV8ApPN2y-cart", JSON.stringify([{ displayName: "test", productId: "test123" }]));

        render(
            <CryptoPayButton
            apiKey={"pk_xl0v4jIHnZbIowGwwTPy1JylV8ApPN2y"}
            productId={"test123"}
            displayName={"test"}
            email="required"
            shippingAddress={null}
            label="Pay with Crypto"
            style={null}
            cartStyle={null}
            lang="en"
            eth="true"
            sol="true"
            onSuccess ={()=>console.log("Event listener success")}
            />
        );

        const payButton = screen.getByText("Pay with Crypto");
        fireEvent.click(payButton);

        // Wait for async behavior
        await new Promise((r) => setTimeout(r, 0)); 

        const messageEvent = new MessageEvent("message", {
            data: "Receipt added successfully",
        });

        window.dispatchEvent(messageEvent);


        expect(logSpy.mock.calls[0][0]).toContain("You are not using a mobile device.");
        expect(logSpy.mock.calls[1][0]).toContain("Navigating to:");
        expect(logSpy.mock.calls[2][0]).toContain("Received message:");
        expect(logSpy.mock.calls[2][1]).toContain("Receipt added successfully");
        expect(logSpy.mock.calls[3][0]).toContain("we did it!")
        expect(logSpy.mock.calls[4][0]).toContain("Event listener success");
        expect(open).toHaveBeenCalled();
    });

    it("should able to revert if onSuccess is faild", async () => {
        vi.stubGlobal("navigator", { userAgent: "windows" });

        const logSpy = vi.spyOn(console, "log");

        const mockWindow = { location: {}, close: vi.fn() };
        vi.stubGlobal("open", vi.fn(() => mockWindow));

        global.fetch = vi.fn(() =>
            Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}), // optional
            })
        );

        localStorage.setItem("pk_xl0v4jIHnZbIowGwwTPy1JylV8ApPN2y-cart", JSON.stringify([{ displayName: "test", productId: "test123" }]));

        render(
            <CryptoPayButton
            apiKey={"pk_xl0v4jIHnZbIowGwwTPy1JylV8ApPN2y"}
            productId={"test123"}
            displayName={"test"}
            email="required"
            shippingAddress={null}
            label="Pay with Crypto"
            style={null}
            cartStyle={null}
            lang="en"
            eth="true"
            sol="true"
            onSuccess={() => {
                throw new Error("Simulated onSuccess failure");
            }}
            />
        );

        const payButton = screen.getByText("Pay with Crypto");
        fireEvent.click(payButton);

        // Wait for async behavior
        await new Promise((r) => setTimeout(r, 0)); 

        const messageEvent = new MessageEvent("message", {
            data: "Receipt added successfully",
        });

        window.dispatchEvent(messageEvent);
        expect(logSpy.mock.calls[7][0]).toContain("Could not complete success function")
        expect(open).toHaveBeenCalled();
    });

    it("should openPortal fail if incorrect api key", async () => {
        vi.stubGlobal("navigator", { userAgent: "windows" });

        const logSpy = vi.spyOn(console, "log");

        const mockWindow = { location: {}, close: vi.fn() };
        vi.stubGlobal("open", vi.fn(() => mockWindow));

        global.fetch = vi.fn(() =>
            Promise.resolve({
            ok: false,
            json: () => Promise.resolve({}), 
            })
        );

        localStorage.setItem("123-cart", JSON.stringify([{ displayName: "test", productId: "test123" }]));

        render(
            <CryptoPayButton
            apiKey={"123"}
            productId={"test123"}
            displayName={"test"}
            email="required"
            shippingAddress={null}
            label="Pay with Crypto"
            style={null}
            cartStyle={null}
            lang="en"
            eth="true"
            sol="true"
            onSuccess={() => {
               console.log("Simulated Success");
            }}
            />
        );

        await new Promise((r) => setTimeout(r, 0)); 
        
        const payButton = screen.getByText("Pay with Crypto");
        fireEvent.click(payButton);

        await waitFor(() => {
            expect(logSpy).toHaveBeenCalledWith("Closing window due to unsuccessful response");
            expect(mockWindow.close).toHaveBeenCalled();
        });
 
    });


    it("should openPortal and catch failures", async () => {
        vi.stubGlobal("navigator", { userAgent: "windows" });

        const logSpy = vi.spyOn(console, "log");
          const errorSpy = vi.spyOn(console, "error");

        const mockWindow = { location: {}, close: vi.fn() };
        
        vi.stubGlobal("open", vi.fn(() => mockWindow));

        // Simulate fetch failure (e.g., API key issue or network)
        global.fetch = vi.fn(() => Promise.reject(new Error("Network Error")));

        localStorage.setItem(
            "123-cart",
            JSON.stringify([{ displayName: "test", productId: "test123" }])
        );

        render(
            <CryptoPayButton
            apiKey={"123"}
            productId={"test123"}
            displayName={"test"}
            email="required"
            shippingAddress={null}
            label="Pay with Crypto"
            style={null}
            cartStyle={null}
            lang="en"
            eth="true"
            sol="true"
            onSuccess={() => {
                console.log("Simulated Success");
            }}
            />
        );

        await new Promise((r) => setTimeout(r, 0));
        const payButton = screen.getByText("Pay with Crypto");
        fireEvent.click(payButton);

        await waitFor(() => {
            expect(logSpy).toHaveBeenCalledWith("Closing window due to error");
            expect(mockWindow.close).toHaveBeenCalled();
        });
    });

    it("should close modal when clicking outside", () => {

        Object.defineProperty(window.navigator, "userAgent", {
            value: "iphone",
                configurable: true,
        });

         const logSpy = vi.spyOn(console, "log");

        render(
            <CryptoPayButton
                apiKey={'pk_xl0v4jIHnZbIowGwwTPy1JylV8ApPN2y'}
                productId={'test123'}
                displayName={'test'}
                email='required'
                shippingAddress={null}
                label='Pay with Crypto'
                style={null}
                cartStyle={null}
                lang='en'
                eth='true'
                sol="true"
            />
        );
        fireEvent.click(screen.getByText("Pay with Crypto"));


        // Simulate outside click
        const outside = document.createElement("div");
        document.body.appendChild(outside);
        fireEvent.mouseDown(outside);
        

        // Assert modal is closed

        expect(logSpy.mock.calls[2][0]).toContain("Modal closed")
    });

    it("should call setCheckout(false) after 3s on mouse leave", () => {
       Object.defineProperty(window.navigator, "userAgent", {
            value: "windows",
        });

        vi.useFakeTimers(); 
        
        const logSpy = vi.spyOn(console,"log")

        const { getByTestId } =    render(
            <CryptoPayButton
                apiKey={'pk_xl0v4jIHnZbIowGwwTPy1JylV8ApPN2y'}
                productId={'test123'}
                displayName={'test'}
                email='required'
                shippingAddress={null}
                label='Pay with Crypto'
                style={null}
                shoppingCart={true}
                cartStyle={null}
                lang='en'
                eth='true'
                sol="true"
            />
        );

        const button = getByTestId("cart-button");

        fireEvent.mouseEnter(button);
        fireEvent.mouseLeave(button);

        // Fast-forward 3000ms
        vi.advanceTimersByTime(3000);
        
        expect(logSpy.mock.calls[0][0]).toContain("Timeout executed.")
        
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it("should call openPortal on desktop and should not logs handleMessage", async () => {
        vi.stubGlobal("navigator", { userAgent: "windows" });

        const logSpy = vi.spyOn(console, "log");

        const mockWindow = { location: {}, close: vi.fn() };
        vi.stubGlobal("open", vi.fn(() => mockWindow));

        global.fetch = vi.fn(() =>
            Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}), // optional
            })
        );

        localStorage.setItem("pk_xl0v4jIHnZbIowGwwTPy1JylV8ApPN2y-cart", JSON.stringify([{ displayName: "test", productId: "test123" }]));

        render(
            <CryptoPayButton
            apiKey={"pk_xl0v4jIHnZbIowGwwTPy1JylV8ApPN2y"}
            productId={"test123"}
            displayName={"test"}
            email="required"
            shippingAddress={null}
            label="Pay with Crypto"
            style={null}
            cartStyle={null}
            lang="en"
            eth="true"
            sol="true"
            onSuccess ={()=>console.log("Event listener success")}
            />
        );

        const payButton = screen.getByText("Pay with Crypto");
        fireEvent.click(payButton);

        // Wait for async behavior
        await new Promise((r) => setTimeout(r, 0)); 

        const messageEvent = new MessageEvent("message", {
            data: "Receipt added",
        });

        window.dispatchEvent(messageEvent);


        expect(logSpy.mock.calls[0][0]).toContain("You are not using a mobile device.");
        expect(logSpy.mock.calls[1][0]).toContain("Navigating to:");

        expect(open).toHaveBeenCalled();
    });

    it("should not have cart button if shoppingCart is false",()=>{
        vi.stubGlobal("navigator", { userAgent: "windows" });

        const logspy =vi.spyOn(console, "log");
        
        const {getAllByText} =  render(
            <CryptoPayButton
                apiKey={'123'}
                productId={'test123'}
                displayName={'test'}
                email='required'
                shippingAddress={null}
                label='Pay with Crypto'
                shoppingCart={false}
                style={null}
                cartStyle={null}
                lang='en'
                eth='true'
                sol="true"
            />
        )

        const buttons = getAllByText("Pay with Crypto");
        fireEvent.click(buttons[0]);
        const cartButton = screen.queryByText("🛒");
        expect(cartButton).toBeNull();

    })

    it("should fallback to navigator.vendor", () => {
        vi.stubGlobal("navigator", {
            userAgent: undefined,
            vendor: "TestVendor",
        });

         const {getAllByText} =  render(
            <CryptoPayButton
                apiKey={'123'}
                productId={'test123'}
                displayName={'test'}
                email='required'
                shippingAddress={null}
                label='Pay with Crypto'
                style={null}
                cartStyle={null}
                lang='en'
                eth='true'
                sol="true"
            />
        )

        const buttons = getAllByText("Pay with Crypto");
        fireEvent.click(buttons[0]);
    });

    it("should fallback to window.opera", () => {

        Object.defineProperty(window, "opera", {
            value: "TestOpera",
            configurable: true,
        });

        vi.stubGlobal("navigator", {
            userAgent: undefined,
            vendor: undefined,
        });


        const { getAllByText } = render(
            <CryptoPayButton
            apiKey={"123"}
            productId={"test123"}
            displayName={"test"}
            email="required"
            shippingAddress={null}
            label="Pay with Crypto"
            style={null}
            cartStyle={null}
            lang="en"
            eth="true"
            sol="true"
            />
        );

        const buttons = getAllByText("Pay with Crypto");
        fireEvent.click(buttons[0]);

        delete window.opera;
        vi.restoreAllMocks();
    });   
    
    it("should call openPortal on desktop and log message without cartItem", async () => {
        vi.stubGlobal("navigator", { userAgent: "windows" });

        const logSpy = vi.spyOn(console, "log");

        const mockWindow = { location: {}, close: vi.fn() };
        vi.stubGlobal("open", vi.fn(() => mockWindow));

        global.fetch = vi.fn(() =>
            Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}), // optional
            })
        );

        render(
            <CryptoPayButton
            apiKey={"123"}
            productId={"test123"}
            displayName={"test"}
            email="required"
            shippingAddress={null}
            label="Pay with Crypto"
            style={null}
            cartStyle={null}
            lang="en"
            eth="true"
            sol="true"
            onSuccess ={()=>console.log("Event listener success")}
            />
        );


        const payButton = screen.getByText("Pay with Crypto");
        fireEvent.click(payButton);

        localStorage.removeItem("123-cart");

        // Wait for async behavior
        await new Promise((r) => setTimeout(r, 0)); 

        const messageEvent = new MessageEvent("message", {
            data: "Receipt added successfully",
        });

        window.dispatchEvent(messageEvent);


        // expect(logSpy.mock.calls[1][0]).toContain("You are not using a mobile device.");
        // expect(logSpy.mock.calls[2][0]).toContain("Navigating to:");
        // expect(logSpy.mock.calls[3][0]).toContain("Received message:");
        expect(open).toHaveBeenCalled();
    });
    

})
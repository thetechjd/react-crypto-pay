import { describe, expect,it } from "vitest"
import * as exports from  "../index"

describe("Index test",()=>{
    it("Should exports CryptoPayButton",async()=>{
        expect(exports).toHaveProperty("CryptoPayButton")
    })
})
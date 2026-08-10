import {describe, expect, test} from "vitest";

import {Channel, SimpleChannel} from "./channel";

describe("Channel close", () => {

    test("closing twice keeps the reason awaiters were handed", async () => {
        const channel = new Channel<number>();

        channel.close("first");
        channel.close("second");

        await expect(channel.onClose).resolves.toBe("first");
    });

    test("a pending read rejects on close", async () => {
        const channel = new Channel<number>();
        const read = channel.next();

        channel.close("done");

        await expect(read).rejects.toThrow("Channel closed");
        expect(channel.isOpen).toBe(false);
    });

    test("a write hands its value to a pending read", async () => {
        const channel = new Channel<number>();
        const read = channel.next();

        await channel.write(3);

        await expect(read).resolves.toBe(3);
    });
});

describe("SimpleChannel close", () => {

    test("closing twice keeps the reason awaiters were handed", async () => {
        const channel = new SimpleChannel<number>();

        channel.close("first");
        channel.close("second");

        await expect(channel.onClose).resolves.toBe("first");
    });

    test("a buffered write is released on close", async () => {
        const channel = new SimpleChannel<number>();
        const write = channel.write(5);

        channel.close();

        await expect(write).resolves.toBeUndefined();
    });
});

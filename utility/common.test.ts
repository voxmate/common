import {describe, expect, test} from "vitest";

import {ControllablePromise} from "./common";

function swallow(promise: Promise<any>) {
    promise.catch(() => undefined);
    return promise;
}

describe("ControllablePromise settlement", () => {

    test("a pending promise is not settled", () => {
        const p = new ControllablePromise<number>();

        expect(p.settled).toBe(false);
        expect(p.resolved).toBe(false);
        expect(p.rejected).toBe(false);
    });

    test("a resolved promise is settled", async () => {
        const p = new ControllablePromise<number>();
        p.resolve(7);

        expect(p.settled).toBe(true);
        expect(p.resolved).toBe(true);
        expect(p.rejected).toBe(false);
        expect(p.resolvedValue).toBe(7);
        await expect(p).resolves.toBe(7);
    });

    test("a rejected promise is settled, not live", async () => {
        const p = new ControllablePromise<number>();
        const reason = new Error("boom");
        swallow(p);
        p.reject(reason);

        expect(p.settled).toBe(true);
        expect(p.rejected).toBe(true);
        expect(p.resolved).toBe(false);
        await expect(p).rejects.toBe(reason);
    });

    test("resolving after a rejection does not claim the outcome", async () => {
        const p = new ControllablePromise<number>();
        const reason = new Error("boom");
        swallow(p);
        p.reject(reason);
        p.resolve(7);

        expect(p.rejected).toBe(true);
        expect(p.resolved).toBe(false);
        expect(p.resolvedValue).toBeUndefined();
        await expect(p).rejects.toBe(reason);
    });

    test("rejecting after a resolution does not claim the outcome", async () => {
        const p = new ControllablePromise<number>();
        p.resolve(7);
        swallow(p);
        p.reject(new Error("boom"));

        expect(p.resolved).toBe(true);
        expect(p.rejected).toBe(false);
        expect(p.resolvedValue).toBe(7);
        await expect(p).resolves.toBe(7);
    });

    test("a second resolution does not overwrite the recorded value", async () => {
        const p = new ControllablePromise<string>();
        p.resolve("first");
        p.resolve("second");

        expect(p.resolvedValue).toBe("first");
        await expect(p).resolves.toBe("first");
    });
});

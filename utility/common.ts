export function regexGetFirstGroup(regex: RegExp, str: string): string | null {
    let m: RegExpExecArray | null;

    // noinspection LoopStatementThatDoesntLoopJS
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        return m[1] || null;
    }

    return null;
}

export function toArray<T>(item: T | T[] | undefined | null): T[] {

    if (!item)
        return [];

    let result: T[];
    if (!Array.isArray(item))
        result = [item];
    else result = item;
    return result;
}


type Settlement<T> =
    { status: "resolved", value: T | undefined } |
    { status: "rejected", reason: any };


export class ControllablePromise<T = any> implements Promise<T> {

    readonly resolve: (value?: T) => void;
    readonly reject: (reason?: any) => void;

    private readonly promise: Promise<T>;

    private _settlement: Settlement<T> | null = null;


    constructor() {

        let resolveFunction: ((value?: T | PromiseLike<T>) => void) | null = null;
        let rejectFunction: ((reason?: any) => void) | null = null;

        this.promise = new Promise<T>((resolve, reject) => {
            resolveFunction = resolve as any;
            rejectFunction = reject;
        });

        this.resolve = (value?: T) => {
            if (this._settlement)
                return;

            this._settlement = {status: "resolved", value};

            if (resolveFunction)
                resolveFunction(value);
        };

        this.reject = (reason?: any) => {
            if (this._settlement)
                return;

            this._settlement = {status: "rejected", reason};

            if (rejectFunction)
                rejectFunction(reason);
        };
    }

    readonly [Symbol.toStringTag]: string = "toString";

    catch<TResult = never>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | undefined | null): Promise<T | TResult> {
        return this.promise.catch(onrejected);
    }

    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => (PromiseLike<TResult1> | TResult1)) | undefined | null,
                                         onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null): Promise<TResult1 | TResult2> {
        return this.promise.then(onfulfilled, onrejected);
    }

    finally(any: any): any {
        if (this.promise.hasOwnProperty("finally"))
            return (this.promise as any)["finally"](any);
        return undefined;
    }

    get settled(): boolean {
        return this._settlement !== null;
    }

    get resolved(): boolean {
        return this._settlement !== null && this._settlement.status === "resolved";
    }

    get rejected(): boolean {
        return this._settlement !== null && this._settlement.status === "rejected";
    }

    get resolvedValue(): T | undefined {
        return this._settlement !== null && this._settlement.status === "resolved"
            ? this._settlement.value
            : undefined;
    }
}

export function currentTimeMillis() {
    return new Date().getTime();
}
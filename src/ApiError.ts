import express, { Request, Response } from "express";

export class ApiError extends Error {
    private static mkTypes(types: ApiErrorType[]) {
        const map = new Map<number, ApiErrorType>();
        types.forEach(t => map.set(t.id, t));

        return map;
    }
    public static Types = ApiError.mkTypes([
        // shortener
        { id: 10001, name: "Destination invalid" },
        { id: 10002, name: "Code in use", code: 409 },
        { id: 11001, name: "No code provided" },

        // ytdl
        { id: 20001, name: "No url provided" },
        { id: 20002, name: "Not a youtube url" },
        { id: 20003, name: "Not a real youtube video" },
    ]);

    public static Handler(
        err: ApiError | Error,
        req: Request,
        res: Response,
        next: express.NextFunction
    ) {
        if (res.headersSent) return next(err);

        // console.error(err);

        const d: any = { error: true, message: err.message };

        if (err instanceof ApiError) {
            res.status(err.code);
            d.code = err.code;
        }

        res.json(d);
    }

    message: string;
    id: number;
    code: number;
    // error = true;

    constructor(id: number) {
        super();

        const type = ApiError.Types.get(id);
        if (!type) throw new Error(`${id} is not a valid API error code`);

        this.message = type.name;
        this.id = id;
        this.code = type.code || 400;
    }
}
export default ApiError;

export interface ApiErrorType {
    name: string;
    id: number;
    code?: number;
}

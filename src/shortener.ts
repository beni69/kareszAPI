import config from "config";
import express from "express";
import { Document } from "mongoose";
import { customAlphabet, nanoid } from "nanoid";
import { isWebUri } from "valid-url";
import { ApiError } from ".";
import { Url } from "./Mongoose";

const codeGen = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    config.get("codeLength")
);

const base = config.get("url.krszme");

export const init = (app: express.Application) => {
    //* GET /shortener
    app.get("/shortener", async (req, res, next) => {
        const code: string = req.body.code || req.query.code;

        if (!code) return next(new ApiError(11001));

        const data =
            (await Url.findOne({ url: code })) || (await Url.findById(code));

        if (!data) res.json(null);

        data.key = null;

        res.json(data);
    });

    //* POST /shortener
    app.post("/shortener", async (req, res, next) => {
        let { dest, code, key } = req.body;

        // return if invalid url
        if (!isWebUri(dest)) return next(new ApiError(10001));

        // return if code in use
        if (code && (await Url.exists({ _id: code })))
            return next(new ApiError(10002));
        // create code
        else {
            do {
                code = codeGen();
            } while (await Url.exists({ _id: code }));
        }

        // create key
        if (!key) key = nanoid();

        const url: Document = new Url({
            _id: code,
            dest,
            url: `${base}/${code}`,
            key,
        });

        await url.save();

        res.json(url);
    });

    //* redirecting
    app.get("/:code", async (req, res, next) => {
        const dest = await Url.findById(req.params.code);

        if (!dest) {
            return res.status(404).send("Link not found");
        }

        res.redirect(301, dest.dest);

        await dest.updateOne({ clicks: dest.clicks + 1 });
    });
};

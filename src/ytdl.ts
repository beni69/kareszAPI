import cp from "child_process";
import express from "express";
import ffmpeg from "ffmpeg-static";
import fs from "fs";
import { join } from "path";
import { promisify } from "util";
import ytdl from "ytdl-core";
import { ApiError } from ".";

const rm = promisify(fs.rm);

export const init = (app: express.Application) => {
    //* GET /ytdl
    app.get("/ytdl", async (req, res, next) => {
        const r = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/i;
        const ref: string = req.body.url || req.query.url;

        if (!ref || typeof ref != "string") return next(new ApiError(20001));
        else if (!r.test(ref)) return next(new ApiError(20002));
        else if (!ytdl.validateURL(ref)) return next(new ApiError(20003));

        if (!fs.existsSync("tmp")) fs.mkdirSync("tmp");

        const info = await ytdl.getBasicInfo(ref);
        const fname = `tmp/ytdl-${info.videoDetails.videoId}.mp4`;

        if (fs.existsSync(fname))
            return res.download(join(process.cwd(), fname));

        const audio = ytdl(ref, { quality: "highestaudio" });
        const video = ytdl(ref, { quality: "highestvideo" });

        const ffp = cp.spawn(
            ffmpeg,
            [
                // Remove ffmpeg's console spamming
                "-loglevel",
                "8",
                "-hide_banner",
                // Redirect/Enable progress messages
                "-progress",
                "pipe:3",
                // Set inputs
                "-i",
                "pipe:4",
                "-i",
                "pipe:5",
                // Map audio & video from streams
                "-map",
                "0:a",
                "-map",
                "1:v",
                // Keep encoding
                "-c:v",
                "copy",
                // Define output file
                fname,
            ],
            {
                windowsHide: true,
                stdio: [
                    "inherit",
                    "inherit",
                    "inherit",
                    "pipe",
                    "pipe",
                    "pipe",
                ],
            }
        );

        ffp.on("close", () => {
            console.log("ffmpeg done!");

            res.download(join(process.cwd(), fname));

            timeDel(fname);
        });

        //@ts-ignore
        audio.pipe(ffp.stdio[4]);
        //@ts-ignore
        video.pipe(ffp.stdio[5]);
    });

    //* GET /ytdl/info
    app.get("/ytdl/info", async (req, res, next) => {
        const r = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/i;
        const ref: string = req.body.url || req.query.url;

        if (!ref || typeof ref != "string") return next(new ApiError(20001));
        else if (!r.test(ref)) return next(new ApiError(20002));
        else if (!ytdl.validateURL(ref)) return next(new ApiError(20003));

        const data = await ytdl.getBasicInfo(ref);

        res.json(data.videoDetails);
    });

    function timeDel(file: string, time = 300000) {
        setTimeout(async () => {
            await rm(file);
        }, time);
    }
};

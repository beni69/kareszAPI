import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { readFile as readFileCB } from "fs";
import helmet from "helmet";
import morgan from "morgan";
import { promisify } from "util";
import ApiError from "./ApiError";
import { connect as connectDB } from "./Mongoose";

const readFile = promisify(readFileCB);

dotenv.config();

const app = express();

const { MONGODB } = process.env;
if (MONGODB) connectDB(MONGODB);

//* middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan(log));

//* routes
require("./ytdl").init(app);
require("./shortener").init(app);

//* error handler
app.use(ApiError.Handler);

const PORT = process.env.PORT || 3000;

//* GET /
app.get("/", (req, res) => {
    // if url shortener => redirect, otherwise don't
    if (req.hostname == "krsz.me" || req.hostname == "u.karesz.xyz")
        res.redirect(301, "http://krsz.me/new");
    else
        res.json({
            data: "Hello World!",
            serverTime: new Date(),
            v: 2,
        });
});

app.listen(PORT, () => console.log(`Listening on port ${chalk.blue(PORT)}`));

process.on("unhandledRejection", err => {});

function log(
    tokens: morgan.TokenIndexer<Request, Response>,
    req: Request,
    res: Response
) {
    const code = tokens.status(req, res);

    let msg = [
        chalk.bold.inverse(tokens.method(req, res)),
        status(code),
        chalk.bold(tokens.url(req, res)),
        chalk.magenta(tokens["response-time"](req, res) + " ms"),
        chalk.blue(req.headers["x-forwarded-for"] || req.socket.remoteAddress),
        tokens["user-agent"](req, res),
    ].join(chalk.grey` - `);

    return msg;

    function status(code?: string) {
        if (!code) return "";

        const colors = [
            chalk.reset,
            chalk.green,
            chalk.cyan,
            chalk.yellow,
            chalk.red,
        ];

        return colors[Math.floor(parseInt(code) / 100) - 1](code);
    }
}

export { ApiError };

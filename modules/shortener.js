const express = require("express");
const validUrl = require("valid-url");
const router = express.Router();
const url = require("../models/url");
const config = require("config");
const baseUrl = config.get("baseurl");
const { succ, err, getDate } = require("./index");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    config.get("codeLength")
);
const keyGen = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_",
    21
);

// creating urls
router.post("/shortener", async (req, res) => {
    let { dest, code, key } = req.body;

    // check destination url
    if (!validUrl.isUri(dest)) return err(res, "Invalid URL");

    // if no custom code
    if (!code) {
        //! turning this off: potential security vunerability
        // // if theres already an entry witn the same dest, just return that one
        // if ((await url.exists({ dest })) && req.body.force != true)
        //     return res.json({
        //         data: "Success!",
        //         created: await url.findOne({ dest }),
        //     });

        // create a unique code
        do {
            code = nanoid();
        } while (await url.exists({ _id: code }));

        // create a key
        if (!key) key = keyGen();

        const newUrl = new url({
            _id: code,
            dest,
            url: `${baseUrl}/${code}`,
            timestamp: Date.now(),
            key,
        });
        await newUrl.save();
        res.json({
            data: "Success!",
            created: newUrl,
        });
    }
    // if custom code
    else {
        // return if a link already exists with thee same code
        if (await url.exists({ _id: code }))
            return err(res, "Custom code already in use", 409);

        // create a key
        if (!key) key = keyGen();

        const newUrl = new url({
            _id: code,
            dest,
            url: `${baseUrl}/${code}`,
            timestamp: Date.now(),
            key,
        });
        await newUrl.save();
        res.json({
            data: "Success!",
            created: newUrl,
        });
    }
});

// get info on a link
router.get("/shortener", async (req, res) => {
    const code = req.body.code || req.query.code || null;
    if (code == null) return err(res, "Please provide a url or a code");

    // get the entry by either the url or the code
    let data;
    if (validUrl.isUri(code)) {
        data = await url.findOne({ dest: code });
        if (!data) {
            const c = code.replace(/http(s|):\/\/krsz.me\//i, "");
            data = await url.findById(c);
        }
    } else data = await url.findById(code);
    if (!data) return err(res, "This link couldn't be found", 404);

    data.key = "**********"; // Deleting the key wont work for some reason
    res.json(data);
});

// delete a link
router.delete("/shortener", async (req, res) => {
    // const code = req.body.code || req.query.code || null;
    const { code, key } = req.body || req.query;
    if (!code) return err(res, "Please provide a url or a code");
    if (!key) return err(res, "Please provide a key");

    // get the entry by either the url or the code
    let data;
    if (validUrl.isUri(code)) data = await url.findOne({ url: code });
    else data = await url.findById(code);
    if (!data) return err(res, "This link couldn't be found", 404);

    if (key === data.key) await data.delete();
    else return err(res, "Invalid key!");

    res.json({ data: "Success!", deleted: data });
});

// redirecting
router.get("/:code", async (req, res) => {
    const { code } = req.params;

    // return 404 if invalid
    if (!(await url.exists({ _id: code })))
        return res.status(404).json("Link not found");

    // redirect user
    const dest = await url.findById(code);
    res.status(301).redirect(dest.dest);

    // count clicks
    await dest.updateOne({ clicks: dest.clicks + 1 });
});

module.exports = router;

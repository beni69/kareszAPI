const express = require("express");
const validUrl = require("valid-url");
const router = express.Router();
const url = require("../models/url");
const config = require("config");
const baseUrl = config.get("baseurl");
const {succ, err} = require("./index");
const {customAlphabet} = require("nanoid");
const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    6
);

// creating urls
router.post("/shortener", async (req, res) => {
    const {dest, code} = req.body;

    // check destination url
    if (!validUrl.isUri(dest)) return err(res, "Invalid URL");

    // if no custom code
    if (!code) {
        // if theres already an entry witn the same dest, just return that one
        if ((await url.exists({dest})) && req.body.force != true)
            return res.json({
                data: "Success!",
                created: await url.findOne({dest}),
            });

        // create a unique code
        let code;
        do {
            code = nanoid();
        } while (await url.exists({_id: code}));

        const newUrl = new url({_id: code, dest, url: `${baseUrl}/${code}`});
        await newUrl.save();
        res.json({
            data: "Success!",
            created: newUrl,
        });
    }
    // if custom code
    else {
        // return if a link already exists with thee same code
        if (await url.exists({_id: code}))
            return err(res, "Custom code already in use", 409);

        const newUrl = new url({_id: code, dest, url: `${baseUrl}/${code}`});
        await newUrl.save();
        res.json({
            data: "Success!",
            created: newUrl,
        });
    }
});

// get info on a link
router.get("/shortener", async (req, res) => {
    const code = req.body.data || req.query.data || null;
    if (code == null) return err(res, "Please provide a url or a code");

    // get the entry by either the url or the code
    let data;
    if (validUrl.isUri(code)) data = await url.findOne({url: code});
    else data = await url.findById(code);
    if (!data) return err(res, "This link couldn't be found", 404);

    res.json(data);
});

// redirecting
router.get("/:code", async (req, res) => {
    const {code} = req.params;

    // return 404 if invalid
    if (!(await url.exists({_id: code})))
        return res.status(404).json("Link not found");

    // redirect user
    const dest = await url.findById(code);
    res.redirect(dest.dest);

    // count clicks
    await dest.updateOne({clicks: dest.clicks + 1});
});

module.exports = router;

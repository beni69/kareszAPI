# the api for the karesz url shortener and more

## How to use:

### GET /shortener?code=_{a [krsz.me](https://krsz.me) link or the code part of a link}_

This request sends back some info about the provided link, like the creation
timestamp, the destination or the amount of clicks.

### POST /shortener

Create a new link.

| Field | Type   | Description                                                                                                                                     |
| ----- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| dest  | String | The destination url. This can only be a link, the code checks.                                                                                  |
| code  | String | _Optional._ This will be the code in the link.                                                                                                  |
| key   | String | _Optional._ Every link has a password _(a key)_ that can be used to delete or update it. You can provide a key of we will generate one for you. |

### DELETE /shortener

Delete a link.

| Field | Type   | Description          |
| ----- | ------ | -------------------- |
| code  | String | The code or the link |
| key   | String | Your key             |

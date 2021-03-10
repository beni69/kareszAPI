# the api for the karesz url shortener and more

## How to use:

### GET /shortener?code=_{a [krsz.me](https://krsz.me) link or the code part of a link}_

#### This request sends back some info about the provided link, like the creation timestamp, the destination or the amount of clicks.

**Response:** the json object of the link

### POST /shortener

#### Create a new link.

| Field | Type   | Description                                                                                                                                     |
| ----- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| dest  | String | The destination url. This can only be an actual url: (http|https)://...                                                                         |
| code  | String | _Optional._ This will be the code in the link.                                                                                                  |
| key   | String | _Optional._ Every link has a password _(a key)_ that can be used to delete or update it. You can provide a key or we will generate one for you. |

**Response:** "Success!", and the json object of the created link.

### DELETE /shortener

#### Delete a link.

| Field | Type   | Description          |
| ----- | ------ | -------------------- |
| code  | String | The code or the link |
| key   | String | Your key             |

**Response:** "Success!", and the json object of the deleted link.

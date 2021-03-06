# [gfycat-id-camel-caser](https://alttiri.github.io/gfycat-id-camel-caser/)
Turns Gfycat's lowercase ID to CamelCase formatted ID.

Gfycat's ID matches such pattern: [Adjective](https://github.com/AlttiRi/gfycat-id-camel-caser/blob/master/dictionaries/adjectives.json)[Adjective](https://github.com/AlttiRi/gfycat-id-camel-caser/blob/master/dictionaries/adjectives.json)[Animal](https://github.com/AlttiRi/gfycat-id-camel-caser/blob/master/dictionaries/animals.json).

The example: 
- `lazyfatcat` turns to `LazyFatCat`.
- `emobluedog` turns to  `EmoBlueDog`
- `hexakosioihexekontahexaphobicparaskavidekatriaphobicqueenalexandrasbirdwingbutterfly`
turns to 
`HexakosioihexekontahexaphobicParaskavidekatriaphobicQueenalexandrasbirdwingbutterfly`

---

# iframe API

```js
async function initIframeAPI({src, name}) {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.setAttribute("referrerpolicy", "no-referrer");
    iframe.setAttribute("style", "display: none;");
    iframe.setAttribute("src", src);
    document.body.append(iframe);
    await new Promise(resolve => {
        iframe.addEventListener("load", resolve);
    });

    let i = 0; const seed = Math.random().toString().substring(2);
    return function() {
        const inputArguments = [...arguments];
        const id = `${name}:${seed}:${i++}`;
        iframe.contentWindow.postMessage({inputArguments, id}, "*");
        let promiseResolve;
        const handler = event => {
            const {data, from, messageId} = event.data;
            if (name === from && id === messageId) {
                window.removeEventListener("message", handler);
                promiseResolve(data);
            }
        }
        return new Promise(resolve => {
            promiseResolve = resolve;
            window.addEventListener("message", handler);
        });
    }
}
```

```js
/**
 * @param {String} inputString
 * @param {TypeWord[]?} types = ["adjective", "adjective", "animal"]
 * @return {Promise<MatchResult>}
 */
const matchGfyId = await initIframeAPI({
    src: "https://alttiri.github.io/gfycat-id-camel-caser/iframe-api.html",
    name: "gfy-id-camel-caser"
});

/** @type {MatchResult} */
const result = await matchGfyId("redbluecat");
console.log(result.string);
```

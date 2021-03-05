import {WordQueues} from "./words-handler.js";

export async function getWords() {
    const animalsPromise = fetch("./dictionaries/animals.json").then(resp => resp.json());
    const adjectivesPromise = fetch("./dictionaries/adjectives.json").then(resp => resp.json());

    const [animals, adjectives] = await Promise.all([animalsPromise, adjectivesPromise]);
    return {animals, adjectives};
}

/**
 * @typedef MatchResult
 * @property {WordQueue|null} wordQueue - `null` if no word found
 * @property {Boolean|null} typed - is type order is matched (partially or no)
 * @property {String[]} types - the expected types order
 * @property {String} inputString - the input string after simplification
 * @property {String} string - the equal of `wordQueue?.toString()` or "".
 */

/**
 * @param {String} inputString
 * @return {Promise<MatchResult>}
 */
export async function matchString(inputString) {
    const _inputString = inputString.toLowerCase().replaceAll(/[^a-z]/g, "");
    await WordQueues.init();
    const wordQueues = new WordQueues();
    wordQueues.handle(inputString);

    const types = ["adjective", "adjective", "animal"];
    const resultWordQueue = wordQueues.getMoreAppropriateStringByPattern(types);

    let wordQueue = null, typed = null;
    if (resultWordQueue) {
        wordQueue = resultWordQueue;
        typed = true;
    } else {
        const resultWordQueue = wordQueues.getResultSimple();
        if (resultWordQueue) {
            wordQueue = resultWordQueue;
            typed = false;
        }
    }
    return {
        wordQueue,
        inputString: _inputString,
        types,
        typed,
        string: wordQueue?.toString() || ""
    };
}

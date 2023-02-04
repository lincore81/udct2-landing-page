/**
 * Apply all attributes to the given `Element`.
 * @param {Element} element
 * @param {Object.<string, string>} attributes The object holding attribute kv-pairs.
 * @returns {void}
 */
export const applyAttributes = (element, attributes) => Object.keys(attributes)
    .forEach(key => element.setAttribute(key, attributes[key]));


/**
 *
 * @param {Element} element
 * @param {(string | Element)[]} children
 * @returns {void}
 */
export const appendChildren = (element, children) =>
    children.forEach(child => child instanceof Element
        ? element.appendChild(child)
        : element.appendChild(document.createTextNode(child)));


/**
 *
 * @param {Element} element
 * @param {[string, Function][]} events
 * @returns {void}
 */
export const addEventListeners = (element, events) =>
    events.forEach(([eventname, listener]) =>
        // @ts-ignore: type signature is parameter dependent
        element.addEventListener(eventname, listener));


/**
 * Create a new Element with the requested `tag`, then apply the given
 * attributes, children and event listeners to it. If `tag` is an element, use
 * it instead of creating a new one.
 * The interface is inspired by mithriljs.
 * @param {string | Element} tag
 * @param {Object.<string, string>} attributes
 * @param {(string | Element)[]} children
 * @param {[string, Function][]=} [events]
 * @returns {Element} The created/modified Element.
 */
export const makeElement = (tag, attributes, children, events) => {
    const it = tag instanceof Element
        ? tag
        : document.createElement(tag);
    applyAttributes(it, attributes);
    appendChildren(it, children);
    if (events) addEventListeners(it, events);
    return it;
};

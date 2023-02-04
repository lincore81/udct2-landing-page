
/**
 * Hi there, I slightly over-engineered this. I hope that's ok.
 */


/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
*/

/**
 * @typedef {Readonly<{sections: Element[], navItems: Element[], header: Element}>} AppState
 */

/**
 * Define Global Variables
 *
*/
const SECTION_SELECTOR = `main > section`
    , CSS_ACTIVE_CLASS = `active`
    , CSS_HIDDEN_CLASS = `hidden`
    , LABEL_ATTRIB = `data-nav`
    , NAV_LIST_ID = `navbar__list`
    , HEADER_FADE_TIME = 3000
    ;

/**
 * End Global Variables
 * Start Helper Functions
 *
*/

/**
 * Apply all attributes to the given `Element`.
 * @param {Element} element
 * @param {Object.<string, string>} attributes The object holding attribute kv-pairs.
 * @returns {void}
 */
export const applyAttributes = (element, attributes) => Object.keys(attributes)
    .forEach(key => element.setAttribute(key, attributes[key]));


/**
 * Append all children to the given `Element`. Also handles text, but the
 * behaviour of multiple text nodes is unknown.
 * @param {Element} element
 * @param {(string | Element)[]} children
 * @returns {void}
 */
export const appendChildren = (element, children) =>
    children.forEach(child => child instanceof Element
        ? element.appendChild(child)
        : element.appendChild(document.createTextNode(child)));


/**
 * Add event listeners to the given `Element`. The function doesn't provide a
 * means to remove event listeners.
 * @param {Element} element
 * @param {[string, EventListener][]} events
 * @returns {void}
 */
export const addEventListeners = (element, events) =>
    events.forEach(([eventname, listener]) =>
        element.addEventListener(eventname, listener));


/**
 * Create a new Element with the requested `tag`, then apply the given
 * attributes, children and event listeners to it. If `tag` is an element, use
 * it instead of creating a new one.
 * Interface inspired by mithril.js.
 * @param {string | Element} tag
 * @param {Object.<string, string>} attributes
 * @param {(string | Element)[]} children
 * @param {[string, EventListener][]=} [events]
 * @returns {Element} The created/modified Element.
 */
export const $ = (tag, attributes, children, events) => {
    const it = tag instanceof Element
        ? tag
        : document.createElement(tag);
    applyAttributes(it, attributes);
    appendChildren(it, children);
    if (events) addEventListeners(it, events);
    return it;
};


/**
 * Wrap around an event listener and only pass along the first call every
 * `intervalMs` milliseconds.
 * @param {EventListener} f The event listener to wrap around.
 * @param {number} [intervallMs=100] Only the first call in this many milliseconds is passed to `f`.
 * @returns {EventListener} Can be used as the first argument to `addEventListener`.
 */
export const debounce = (f, intervallMs=100) => {
    let shouldCall = true;
    return ev => {
        if (shouldCall) {
            f(ev);
            shouldCall = false;
            setTimeout(() => shouldCall = true, intervallMs);
        }
    };
};


/**
 * Calculate the fraction of the viewport that the given element occupies
 * (ignoring horizontal space).
 * @param {Element} element
 * @returns {number}
 */
export const calcViewportFractionOf = element => {
    const rect = element.getBoundingClientRect()
        , top = Math.max(rect.top, 0)
        , bottom = Math.min(rect.bottom, innerHeight)
        , visibleHeight = bottom - top;
    return visibleHeight / innerHeight;
};

/**
 * Find the 'active' element of all given elements, i. e. the element that
 * occupies the largest part of the viewport.
 * @param {Element[]} elements
 * @returns {Element}
 */
export const findActiveElement = elements => elements
    .map(element => ({element, height: calcViewportFractionOf(element)}))
    .reduce((a, b) => a.height >= b.height ? a : b)
    .element;


/**
 * End Helper Functions
 * Begin Main Functions
 *
*/

// build the nav
// Build menu (events)
// Scroll to section on link click (events)

/**
 * Find all sections in the document and create a navigation item for each.
 * Finally append all created items to the nav list.
 * @returns {AppState} An array of [`section`, `<li><a /></li>`] pairs.
 */
export const populateNav = () => {
    const sections = Array.from(document.querySelectorAll(SECTION_SELECTOR))
        , navList  = document.getElementById(NAV_LIST_ID)
        , navItems = sections.map((section, index) =>
            // create a <li><a /></li> structure w/ `click` event listener
            $(`li`, index? {} : {class: CSS_ACTIVE_CLASS}, [
                $(`a`,
                    /* attribs: */
                    {
                        href: `#${section.id}`,
                        class: `menu__link`
                    },
                    /* children:*/
                    [section.getAttribute(LABEL_ATTRIB) || 'NO LABEL!'],
                    /* events:  */
                    [['click', scrollToSection(section)]]
                )
            ]));
    if (!navList) {
        throw new Error(`No such element: '${NAV_LIST_ID}'`);
    }
    $(navList, {}, navItems);
    const header = document.querySelector('.page__header');
    if (!header) {
        throw new Error(`No header found.`);
    }
    return {sections, navItems, header};
};



// Add class 'active' to section when near top of viewport

/**
 * Toggle class such that the 'active' section/li element are highlighted.
 * @param {AppState} state
 */
export const updateNavBar = state => {
    const active = findActiveElement(state.sections);
    if (!active) return;
    state.sections.forEach((section, i) => {
        if (section === active) {
            section.classList.add(CSS_ACTIVE_CLASS);
            state.navItems[i].classList.add(CSS_ACTIVE_CLASS);
        } else {
            section.classList.remove(CSS_ACTIVE_CLASS);
            state.navItems[i].classList.remove(CSS_ACTIVE_CLASS);
        }
    });
};

// Scroll to anchor ID using scrollTO event

/**
 * Curried event listener that scrolls to the given section.
 * @param {Element} section
 * @returns {EventListener}
 */
export const scrollToSection = section => ev => {
    ev.preventDefault();
    section.scrollIntoView({behavior: 'smooth'});
};

// Set sections as active
/**
 * Entry point:
 */
(() => {
    const state = populateNav();
    state.header.addEventListener('mouseenter', () => {
        state.header.classList.remove(CSS_HIDDEN_CLASS);
    });
    let timerHandle = 0;
    window.addEventListener(`scroll`,
        debounce(() => {
            updateNavBar(state);
            if (timerHandle) {
                clearTimeout(timerHandle);
                state.header.classList.remove(CSS_HIDDEN_CLASS);
                timerHandle = 0;
            }
            timerHandle = setTimeout(
                () => state.header.classList.add(CSS_HIDDEN_CLASS),
                HEADER_FADE_TIME);
        })
    );
})();


/**
 * End Main Functions
 * Begin Events
 *
*/
// Nothing here, sorry

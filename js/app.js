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
 * @typedef {Readonly<{sections: Element[], navItems: Element[]}>} AppState
 */

/**
 * Define Global Variables
 *
*/

const SECTION_SELECTOR = `main > section`
    , CSS_ACTIVE_CLASS = `active`
    , LABEL_ATTRIB = `data-nav`
    , NAV_LIST_ID = `navbar__list`
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
 * @param {EventListener} f
 * @param {number} [intervallMs=100]
 * @returns {EventListener}
 */
const debounce = (f, intervallMs=100) => {
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
 * Return the element that begins closest to the top of the viewport, but still
 * below it. If all elements are above the viewport, return the last one. If the
 * given array is empty, return nothing. Does not consider whether items are
 * below the bottom of the viewport.
 * @param {Element[]} elements The elements to check.
 * @returns {Element | undefined} The topmost element, if any.
 */
export const getTopmostElementInView = elements =>
      elements.length === 0 ? undefined
    : elements.length === 1 ? elements[0]
    : elements
        .map(e => ({element: e, y: e.getBoundingClientRect().top}))
        .reduce((a, b) =>
              a.y<0   ? b
            : b.y<0   ? a
            : b.y<a.y ? b:a)
        .element;

/**
 * End Helper Functions
 * Begin Main Functions
 *
*/

// build the nav

/**
 * Find all sections in the document and create a navigation item for each.
 * Finally append all created items to the nav list.
 * @returns {AppState} An array of [`section`, `<li><a /></li>`] pairs.
 */
const populateNav = () => {
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
    return {sections, navItems};
};

// Add class 'active' to section when near top of viewport

/**
 *
 * @param {AppState} state
 */
const updateNavBar = state => {
    const active = getTopmostElementInView(state.sections);
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
const scrollToSection = section => ev => {
    ev.preventDefault();
    section.scrollIntoView({behavior: 'smooth'});
};

/**
 * End Main Functions
 * Begin Events
 *
*/

// main:
(() => {
    const state = populateNav();
    window.addEventListener(`scroll`,
        debounce(() => updateNavBar(state))
    );
})();

// Build menu

// Scroll to section on link click

// Set sections as active


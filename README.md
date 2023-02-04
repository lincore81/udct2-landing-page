# Project 2: Landing Page

## About
This is something akin to a landing page, for pure training purposes. It
features a dynamic nav bar, amazing!  It also does the smooth scrolling thing,
because who *doesn't* enjoy that?
Professionalism.

### Usage
Don't. 

There really is no point, unless you're the reviewer, in which case: Hello there.
I'm just writing this to tick all your boxes.

### Dependencies
There are no hard dependencies. I only used a few dev tools for linting, i. e:
- [eslint](https://eslint.org): So I can better follow your rules :)
- [tsc](https://typescriptlang.org): Type checking, yay!

## Project Goals

### Mandatory
 - [x] Create a dynamic navigation from all `main > section`s on the page.
 - [x] Highlight the section/nav item corresponding to the section that is currently viewed.
 - [x] When the user clicks on a nav item, smoothly scroll to the appropriate section
 - [ ] A proper `README.md`
 - [ ] Comments at the beginning of each class and function
 - [x] Consistent code style, high readability

### Optional
 - [ ] Hide nav bar when not scrolling (after delay)
 - [ ] Add `scroll to top` when viewport is below page fold
 - [ ] Change the design/content
 - [ ] Make sections collapsible

### Rubric (where different 🤔)
 - [x] project structure (`/js/app.js /css/styles.css /index.html /README.md`)
 - [ ] responsive, works on all devices
 - [ ] styling for active states 
 - [ ] at least 4 sections
 - [ ] nice README:
   - [x] project description
   - [x] usage
   - [x] dependencies
   - [x] proper gfm syntax
 - [ ] comments at the beginning of *every* function, hooray!
 - [ ] readable code (are you insisting that I use 
       [this style guide](http://udacity.github.io/frontend-nanodegree-styleguide/javascript.html#formatting)?)

## Problem Solving

### How to create a dynamic navigation bar?
1. Get all `<section>` elements inside `<main>`.
2. Convert the NodeList to Array and map the elements to `<li><a></a></li>` fragments.
3. Append the elements as children to `nav > ul`.

### How to find the currently viewed section?
The definition of `currently viewed` is: The element that begins closest to the
top of the viewport, but not above it (at least in theory).

1. Map all section elements to a `[Element, number]`, where the number is the
   y-offset relative to the viewport's top.
2. Reduce the array to the pair with the smallest non-negative `number`.
3. The associated `Element` is probably 'currently viewed'.


### How to smoothly scroll to a section?
`section.scrollIntoView({behavior: 'smooth'})` 👍

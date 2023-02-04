# Project 2: Landing Page

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


## Problem Solving

### How to create a dynamic navigation bar
1. Get all `<section>` elements inside `<main>`.
2. Convert the NodeList to Array and map the elements to `<li><a></a></li>` fragments.
3. Append the elements as children to `nav > ul`.

### How to find the currently viewed section
The definition of `currently viewed` is: The element that begins closest to the
top of the viewport, but not above it (at least in theory).

1. Map all section elements to a `[Element, number]`, where the number is the
   y-offset relative to the viewport's top.
2. Reduce the array to the pair with the smallest non-negative `number`.
3. The associated `Element` is probably 'currently viewed'.


### How to smoothly scroll to a section
`section.scrollIntoView({behavior: 'smooth'})`

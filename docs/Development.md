Challenges
==========

### Structured layout with animation

### Display front-end data using responsive components

### Process and update data dynamically

### Separation of concerns (MVC)

### Tools and hosting

>Node, React, Webpack, ESLint, Babel

With no prior experience of working within a full React and Node.js development environment, choosing, learning and configuring the required tools was by far the biggest challenge and most time consuming aspect.

It took around a week to become confident with React. The concept and syntax, although confusing initially due to its wildly different design paradigm, was not too challenging. The biggest challenge was understanding how data is passed between components and the philosophy of lifting state up, or ‘thinking in React’. Previous web development experience was based on the traditional separation of HTML, CSS and JS, which felt more logical and easier to maintain, compared to the React way of bundling HTML and JS with JSX and rendering with the Virtual DOM.

Moreover, the cluttered development environment -- with each installed Node module having loads of dependencies of its own -- and the overwhelming amount of build tools and configuration exacerbated the confusion. Webpack took a significant amount of time to learn and set up correctly, even with its well established documentation. The configuration was very difficult to grasp at first, particularly with the swathe of loaders and plugins to contend with. Previous build task experience included Gulp and npm scripts, but the Webpack approach of piping *everything*, including images and CSS, through JavaScript took some getting used to.

However, there was plenty of experience to gain from adopting a new and unfamiliar development process. Particularly, appreciating the power of Webpack and its module bundling, such as hot module reloading for development testing, automatically extracting CSS from JS after transpiling it from Sass, bundling and compressing different JS modules into one after converting them through Babel and more.

Though traditional web development still feels more logical and simple due to the lack of hurdles incorporated by a complex build process, working with React quickly became more enjoyable and provided the ability to dynamically render content through reusable components in a way that would have been horrendously difficult otherwise. If anything, I have come to appreciate the benefits of both development approaches, including learning more about HTML/CSS and the JavaScript API and how to use them together with React for the best experience.


Experience
===========

Responsive design practices
  - Performance
    - Image compression.
    - Critical rendering path and preloading critical resources.
    - Inline critical CSS for quick first-time-to-render.
    - DevTools performance monitoring and device emulation.
    - PageSpeed and Lighthouse metrics analysis.
    - Minification.

Prototyping and project planning

UI/UX design
  - Sass mixins and code splitting.
  - Flexbox responsive design practises.
  - Transforms and animations, maintaining smoothness.
  - Using a relative parent and absolute child to absolutely position an element within container restrictions.
  - Full-width background containers with limited-width child containers for content.

Developing reusable code
  - Shifting responsibility to main `App` component and passing state down to children.
  - Moving all necessary functionality such as calculations to the Component that requires them.

JavaScript API and DOM manipulation
  - Using `onLoad()` on elements to schedule actions such as image loading.
  - Toggling classes to display animations or loading screens.
  - Getting element `clientHeight` and manipulating page scroll with `pageYOffset`.

React components
  - Maximising use of stateless commponents for presentation.
  - Scheduling processing with lifecycle methods.

AJAX and asynchronous rendering

Working with API data sources

Node.js/Python back-end applications

Implementing a database

Node.js project structure and build process
  - Webpack
    - Splitting development and production tasks.
    - Hot module reloading and dev-server.
    - Inline CSS for development, split CSS bundle for production.
  - Babel ES6, React and JSX
Challenges
==========

### Tools and hosting

>Node, React, Webpack, ESLint, Babel

With no prior experience of working within a full React and Node.js development environment, choosing, learning and configuring the required tools was by far the biggest challenge and most time consuming aspect.

It took around a week to become confident with React. The concept and syntax, although confusing initially due to its wildly different design paradigm, was not too challenging. The biggest challenge was understanding how data is passed between components and the philosophy of lifting state up, or ‘thinking in React’. Previous web development experience was based on the traditional separation of HTML, CSS and JS, which felt more logical and easier to maintain, compared to the React way of bundling HTML and JS with JSX and rendering with the Virtual DOM.

Moreover, the cluttered development environment -- with each installed Node module having loads of dependencies of its own -- and the overwhelming amount of build tools and configuration exacerbated the confusion. Webpack took a significant amount of time to learn and set up correctly, even with its well established documentation. The configuration was very difficult to grasp at first, particularly with the swathe of loaders and plugins to contend with. Previous build task experience included Gulp and npm scripts, but the Webpack approach of piping *everything*, including images and CSS, through JavaScript took some getting used to.

However, there was plenty of experience to gain from adopting a new and unfamiliar development process. Particularly, appreciating the power of Webpack and its module bundling, such as hot module reloading for development testing, automatically extracting CSS from JS after transpiling it from Sass, bundling and compressing different JS modules into one after converting them through Babel and more.

Though traditional web development still feels more logical and simple due to the lack of hurdles incorporated by a complex build process, working with React quickly became more enjoyable and provided the ability to dynamically render content through reusable components in a way that would have been horrendously difficult otherwise. If anything, I have come to appreciate the benefits of both development approaches, including learning more about HTML/CSS and the JavaScript API and how to use them together with React for the best experience.

### Fetch, process and update data

Asynchronous network requests were implemented using the JavaScript Fetch API, which uses ES6 Promises. This was a particular challenge, having no previous experience of Promises, and required an entirely new and unfamiliar approach compared to a typical AJAX request. 

The benefit of Promises is preventing “callback hell”, however, improper use of Promises simply leads to “Promise hell” since as soon as one function implements a Promise, the rest of the chain must also use them. Trying to combine promises with synchronous or callback functions quickly leads to problems. Rather, a Promise chain must be kept flat, passing each resolved Promise through a `then()` chain, with each `then()` itself returning a new Promise. 

Therefore, it is difficult to implement functions which rely on multiple Promise-resolving functions to complete, since unlike a callback, the function is not guaranteed to wait for the asynchronous function. Using `Promise.all()` helps to alleviate this problem by specifying an array of Promise-returning functions which will be run in parallel, returning an array of resolved values which can be accessed by index. This approach was used extensively in API network requests as shown below to get driver data, which required calling on multiple Promise-returning functions in parallel.

```JavaScript
  ...
      // Wait for all promise functions to resolve, return array of results
      return Promise.all([
        getWins(driver),
        getPoles(driver),
        getPoints(driver, season),
        getDNF(driver, season),
        getChampionships(driver, false),
        getRaceResults(driver, season),
        getComponents(driver)
      ]);
    })
    // Construct driver object
    .then( (data) => {
        results: data[5],
        components: data[6]
      };
    })
    .catch(error);
   ...
```

This behvaiour can easily be abstracted to its own function, such as to map the array of drivers to function calls using `Promise.all()`.

```JavaScript
const awaitAllDriverRequests = (driversList, season, request) => {
  return Promise.all(driversList.map( (drivers) => {
    return drivers.map( (driver) => {
      return request(driver, season);
    });
  }));
}
```

Another difficulty is when `Promise.all()` returns a multi-dimensional array of Promises, where the outermost array corresponds to the results of each function. For example, the list of drivers is a 2D-Array of driver groups per team. The result of running `getDriverInfo()` will be a 2D-Array of Promises. 

```JavaScript
// input -> [[driver1, driver2], [driver3, driver4]]
const getDriverInfo = (drivers, season) => {
  console.log("Getting driver info...");
  return awaitAllDriverRequests(drivers, season, api.getInfo)
    .then( (result) => resolvePromiseArrays(result));
}
// output <- [[Promise1, Promise2], [Promise3, Promise4]]
```

Passing this array through `then()` and accessing the data by index will only show the inner array of Promise objects. Therefore, each inner array must also be passed through `Promise.all()` to resolve the values. 

```JavaScript
const resolvePromiseArrays = (array) => {
  return Promise.all(array.map( (innerArray) => {
    return Promise.all(innerArray);
  }));
}
```

The new ES8 `async/await` feature makes working with Promises significantly easier by specifying when processing should pause until an asynchronous function has completed, essentially allowing for traditional synchronous behaviour without breaking the underlying Promise chain. However, as `async/await` is built around Promises, the experience and lessons learned will be invaluable in future projects. 

### Display front-end data using responsive components

Flexbox was used throughout to implement a responsive UI including easy centering of content and spacing with the `justify-content` parameter. However, working with Charts.js presented some difficulties due to its canvas rendering and size monitor. Mobile specific options were implemented to disable aspect ratio on charts to fit within their flex containers correctly. 

Functionality was also implemented on mobile to hide the navbar when scrolling down and reapper when scrolling up to maximise content space by tracking the last scroll up position. 

Loading images responsively using lazy-loading presented some challenges, such as reserving space for the header car image until loading has finished. This required rendering the image inside two container elements, where the outermost element has `maxWidth` and `maxHeight` set to the exact dimensions of the image to load. The image width and height is then used to calculate its aspect ratio, which is applied to the inner container using padding as a percentage to resrve a block of space for the eventual image. 

```JSX
const aspect = (props.height/props.width) * 100;
<div className="image-wrapper" style={{maxWidth: props.width, maxHeight: props.height}}>
   <div className="image-container" style={{paddingBottom: + aspect + "%"}}>
     <img src={props.src} alt={props.alt} id={id} className={className} style={{opacity: 0}}
     onLoad={(e) => e.target.style.opacity = 1}/>
   </div>
</div>
```
Various techniques to maximise performance and usability were implemented, including Progressive Web App (PWA) principles such as fast inital render and caching the application shell. For example, the critical CSS is inlined in the HTML to increase first-time-to-render rather than wait for an external stylesheet request. Moreover, HTML `preload` header is used, where supported, to fetch the stylesheet and JS bundle in the background without blocking the inital page render. More work can be done to increase performance such as bundling fonts through Webpack to further reduce network requests, and splitting the JS bundle into chunks which can be individually cached and downloaded as required. 

### Separation of concerns (MVC)

Developing with React requires maintaining a clear hierarchy of components to manage state between smart containers and views. A smart container controls the rendering of view components below it by passing state down as props. 

Smart components were divided into the main content regions such as the header and stats area, which are in turn rendered within the main page container using React Router to match the URL’s for team pages, which updates the state of the page component to render for the correct team. 

This can become convoluted when state must be passed through intermediary children in order to reach the component that requires it. The project could have benefitted from better state management as driver stats must be passed down through multiple children before reaching a chart component. Using a state store such as Redux or the React Context API can alleviate this problem, where any component can fetch state when required while maintaining a unidirectional flow.

Moreover, code maintainability is important and following the DRY principle. There are many areas where a component could be refactored into multiple smaller components, particularly where multiple components must process driver data which could have been abstracted to another reusable components or JS module. 

Experience
===========

Optimisation
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
  - Using a relative parent and absolute child to position an element within container restrictions.
  - Full-width background containers with limited-width child containers for content.
  - Responsive image lazy-load with reserved space.
  - Hide navbar on scrollDown, show on scrollUp (mobile).
  - Scroll to page element. 

Developing reusable code
  - Shifting responsibility to main `App` component and passing state down to children.
  - Moving all necessary functionality such as calculations to the Component that requires them.

JavaScript API and DOM manipulation
  - Using `onLoad()` on elements to schedule actions such as image loading.
  - Toggling classes to display animations or loading screens.
  - Getting element `clientHeight` and manipulating page scroll with `pageYOffset`.

React components
  - Maximising use of stateless components for presentation.
  - Scheduling processing with lifecycle methods.

AJAX and asynchronous rendering
  - Using JavaScript Fetch API with asynchronous Promises.

Working with API data sources

Node.js
  - Working with file system.
  - Creating command line interface.
  - Exporting modules.

Implementing a database

Node.js project structure and build process
  - Webpack
    - Splitting development and production tasks.
    - Hot module reloading and dev-server.
    - Inline CSS for development, split CSS bundle for production.
  - Babel ES6, React and JSX.

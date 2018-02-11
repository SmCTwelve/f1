import React, {Component} from 'react';
import Logo from '../logo/Logo.jsx';
import {Link} from 'react-router-dom';

// Previous navbar position
let lastScrollTop = 0;

/**
 * Nav component to be rendered inside shell container.
 *
 * Props: `team` -- the team logo to render.
 * `index` -- (bool) whether this is the index page where no logo should be rendered.
 * `mobile` -- (bool) hide navbar on scroll down if true.
 */
class Nav extends Component {
  constructor(props) {
    super(props);

    this.animateNav = this.animateNav.bind(this);
    this.hideNav = this.hideNav.bind(this);
    this.scrollToElement = this.scrollToElement.bind(this);
  }

  /**
   * Hide the navbar on scroll down, show on scroll up.
   */
  hideNav(navbar) {
    const pos = window.pageYOffset || document.documentElement.scrollTop;
    if (pos > lastScrollTop) {
      navbar.classList.add('nav-hide');
    }
    else {
      navbar.classList.remove('nav-hide');
    }
    lastScrollTop = pos;
  }

  /**
   * Scroll to a section of the page.
   * @param {String} elementId id value of HTML element.
   */
  scrollToElement(elementId) {
    const rect = document.getElementById(elementId).getBoundingClientRect();
    window.scroll({
      top: (rect.top - 65) + window.scrollY,
      left: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Reduce the height of the navbar and floating logo when scrolling.
   * If mobile detected the navbar will be hidden completely when scrolling down and
   * reappear on scroll up.
   */
  animateNav() {
    const navbar = document.querySelector('.nav-container'); // navbar container element
    if (this.props.mobile) {
      this.hideNav(navbar);
    }
    const logo = navbar.querySelector('.logo-container');
    const navHeight = navbar.clientHeight;
    const distance = window.pageYOffset;
    if (distance > navHeight - 65) {
      navbar.classList.add('shrink');
      logo.classList.add('shrink');
    }
    else {
      if (navbar.classList.contains('shrink')) {
        navbar.classList.remove('shrink');
        logo.classList.remove('shrink');
      }
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.animateNav);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.animateNav);
  }

  render() {
    if (this.props.index) {
      // Index page
      return(
        <header className="nav-container">
          <nav className="nav">
            <Link to="/" className="navlink">HOME</Link>
            <Link to="/about" className="navlink">ABOUT</Link>
          </nav>
        </header>
      );
    }
    // Team page
    else {
      return(
        <header className="nav-container">
          <nav className="nav">
            <Logo team={this.props.team} />
            <Link to="/" className="navlink" id="home">TEAMS</Link>
            <button className="navlink" onClick={() => this.scrollToElement("info")}>
              INFO
            </button>
            <button className="navlink" onClick={() => this.scrollToElement("stats")}>
              DRIVERS
            </button>
          </nav>
        </header>
      );
    }
  }
}

export default Nav;
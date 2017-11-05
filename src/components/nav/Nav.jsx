import React, {Component} from 'react';
import Logo from '../logo/Logo.jsx';

/**
 * Nav component to be rendered inside shell container.
 *
 * Props: `team` -- the team logo to render.
 * `index` -- (bool) whether this is the index page where no logo should be rendered.
 */
class Nav extends Component {
  constructor(props) {
    super(props);

    this.animateNav = this.animateNav.bind(this);
  }

  // Shrink the navbar and logo when scrolling.
  animateNav() {
    const navbar = document.querySelector('.nav-container'); // navbar container element
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

  render() {
    return(
      <header className="nav-container">
        <nav className="nav">
          {/* Conditionally render Logo */}
          {this.props.index ? (null) : (<Logo team={this.props.team} />)}
          <a className="navlink" href="blank">HOME</a>
          <a className="navlink" href="#info">ABOUT</a>
          <a className="navlink" href="blank">TEAMS</a>
        </nav>
      </header>
    );
  }
}

export default Nav;
import React from 'react';

/**
 * Renders a responsive image element inside of a container with reserved space based on the image
 * aspect ratio.
 *
 * Props:
 * `src` -- image url (required).
 * `alt` -- alt text (required).
 * `width, height` -- the width and height of the img source, used for aspect ratio (required).
 * `id` -- image id.
 * `class` -- image class.
 * @param {*} props
 */
const Picture = (props) => {

  const aspect = (props.height/props.width) * 100;
  const className = 'class' in props ? props.class : '';
  const id = 'id' in props ? props.id : '';

  return(
    <div className="image-wrapper" style={{maxWidth: props.width, maxHeight: props.height}}>
      <div className="image-container" style={{paddingBottom: + aspect + "%"}}>
        <img src={props.src} alt={props.alt} id={id} className={className + "hide"}
        onLoad={(e) => e.target.classList.remove("hide")} />
      </div>
    </div>
  );
};

export default Picture;
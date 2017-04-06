import React from "react";
import { Link } from "react-router";
import { MDCTextfield } from "@material/textfield/dist/mdc.textfield";
import screenfull from "screenfull";

import researchers from "./researchers.json";
import "./ResearcherPicker.css";

class ResearcherPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectNumber: "",
      fullscreen: screenfull.isFullscreen
    };
  }
  componentDidMount() {
    if (screenfull.enabled) {
      screenfull.onchange(() => {
        this.setState({ fullscreen: screenfull.isFullscreen });
      });
    }
  }
  handleChange = e => {
    this.setState({ subjectNumber: e.target.value });
  };
  handleClick = () => {
    if (screenfull.enabled) {
      screenfull.request();
    }
  };
  render() {
    const { subjectNumber, fullscreen } = this.state;
    const body = researchers.reduce(
      (rows, researcher) =>
        rows.concat(
          <Link
            to={{
              pathname: "/startpage",
              query: { subjectNumber: subjectNumber, route: researcher.route }
            }}
          >
            <div className="mdl-list__item mdl-card__actions mdl-card--border">
              <span className="mdl-list__item-primary-content">
                <i
                  style={{
                    backgroundImage: "url(" + researcher.avatarUrl + ")",
                    backgroundSize: "auto 40px"
                  }}
                  className="material-icons mdl-list__item-avatar"
                />
                <span>{researcher.name}</span>
              </span>
            </div>
          </Link>
        ),
      []
    );
    console.log(body);
    return (
      <div>
        <div className="mdl-card mdl-shadow--2dp">
          <div className="mdl-card__title">
            <h2 className="mdl-card__title-text">Choose a researcher</h2>
          </div>
          {body}
        </div>
        <div className="subject-number-container">
          <Textfield subjectNumber={subjectNumber} onChange={this.handleChange}>
            Subject number
          </Textfield>
        </div>
        <i
          className="material-icons app-fab--absolute"
          onClick={this.handleClick}
          style={fullscreen ? { display: "none" } : { display: "block" }}
        >
          fullscreen
        </i>
      </div>
    );
  }
}

class Textfield extends React.Component {
  componentDidMount() {
    MDCTextfield.attachTo(document.querySelector(".mdc-textfield"));
  }
  render() {
    const { subjectNumber, onChange } = this.props;
    return (
      <label className="mdc-textfield">
        <input
          type="number"
          className="mdc-textfield__input"
          onChange={onChange}
          value={subjectNumber}
        />
        <span className="mdc-textfield__label">{this.props.children}</span>
      </label>
    );
  }
}

export default ResearcherPicker;
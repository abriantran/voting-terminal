import React from "react";
class SubmitButton extends React.Component {
  render() {
    /**
     * A submit button. Disabled if enough choices have not been picked
     * If clicked, sends onClick function up to parent
     */
    var choices = this.props.final_choices;
    var disable = true;
    if (choices === undefined) {
      disable = false;
    } else if (choices[0] && choices[1] && choices[2]) {
      disable = false;
    }
    return (
      <button
        style={{...this.props.style, float: "right" }}
        className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary"
        disabled={disable}
        onClick={() => this.props.onClick()}
      >
      Cast your vote
      </button>
    );
  }
}

export default SubmitButton;

import React, { Component } from "react";
import { hashHistory } from "react-router";
import FileSaver from "file-saver";
import * as firebase from "firebase";

import CandidateTable from "./CandidateTable";
import SubmitButton from "./SubmitButton";
import DesignHeading from "./DesignHeading";
import ArrowButton from "./ArrowButton";

import election from "./election.json";
import "./ClaudiaZieglerAcemyanDesign.css";
class Office extends React.Component {
  //Office is the logic layer that contains and distributes most of the information
  constructor(props) {
    super(props);
    var timings_temp = [];
    timings_temp.push(["Begin", new Date().getTime()]);
    this.secondsElapsed = 0;
    this.events = [];
    this.state = {
      timings: timings_temp,
      final_choices: [null, null, null],
      table_valids: [1, 0, 0]
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.secondsElapsed++, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);

    const { subjectNumber, office } = this.props;
    const { final_choices } = this.state;
    const { events } = this;
    firebase.database().ref().push().set({
      designer: "Claudia Ziegler Acemyan",
      events: events,
        subjectNumber: subjectNumber,
      contests: [
        {
          office: office,
          choices: final_choices
        }
      ]
    });
  }
  //creates one candidate table
  renderCandidateTable(index) {
    const { table_valids, final_choices } = this.state;
    const inFocus = table_valids.indexOf(1);
    return (
      <CandidateTable
        onClick={(t, i) => this.handleClick(t, i)}
        onNext={() => this.handleNext(index)}
        onPrevious={() => this.handlePrevious(index)}
        candidates={this.props.candidates}
        choiceNo={index + 1}
        choice={final_choices[index]}
        disabled={this.state.table_valids[index] === 0 ? true : false}
        previousChoices={final_choices.slice(0, index)}
        boldSelectedCandidate={true}
        hidePreviouslySelectedCheckboxes={true}
        inFocus={index === inFocus ? true : false}
        size={3}
      />
    );
  }
  handleSubmit() {
    var timings = this.state.timings.slice();
    timings.push(["End", new Date().getTime()]);
    var blob = new Blob([JSON.stringify(timings)], {
      typ: "text/plain; charset=utf-8"
    });
    FileSaver.saveAs(blob, "Claudia" + this.props.subjectNumber + ".txt");

    const { events, secondsElapsed } = this;
    this.events = [
      ...events,
      { event: "Submit", secondsElapsed: secondsElapsed }
    ];

    hashHistory.push("/finalpage");
  }
  render() {
    //Creates an array of three candidate tables
    var tables = [];
    for (let i = 0; i < 3; i++) {
      tables.push(this.renderCandidateTable(i));
    }
    tables.splice(
      1,
      0,
      <ArrowButton
        buttonNo={0}
        final_choices={this.state.final_choices}
        table_valids={this.state.table_valids}
        onClick={(i, n) => this.handleButton(i, n)}
      />
    );
    tables.splice(
      3,
      0,
      <ArrowButton
        buttonNo={1}
        final_choices={this.state.final_choices}
        table_valids={this.state.table_valids}
        onClick={(i, n) => this.handleButton(i, n)}
      />
    );

    //Creation of three (San Fran allows 3) candidate tables
    //Certain properties are passed down, see CandidateTable for more info
    return (
      <div>
        <DesignHeading />
        <div className="mdc-layout-grid">
          {tables}
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <SubmitButton
              final_choices={this.state.final_choices}
              onClick={() => this.handleSubmit()}
            />
          </div>
        </div>
      </div>
    );
  }
  handleButton(i, next_or_previous) {
    var temp_table_valid = this.state.table_valids.slice();
    var timings_temp = this.state.timings.slice();
    if (next_or_previous) {
      timings_temp.push(["Previous", new Date().getTime()]);
      temp_table_valid[i + 1] = 0;
      temp_table_valid[i] = 1;
    } else {
      timings_temp.push(["Next", new Date().getTime()]);
      temp_table_valid[i] = 0;
      temp_table_valid[i + 1] = 1;
    }

    const { events, secondsElapsed } = this;
    this.events = [
      ...events,
      {
        event: next_or_previous ? "Previous Button" : "Next Button",
        secondsElapsed: secondsElapsed
      }
    ];

    this.setState({
      timings: timings_temp,
      table_valids: temp_table_valid
    });
  }
  //Whenever a candidate detects a click, it sends that fact to CandidateTable
  //CandidateTable sends that up to Office with the table_index and index
  //handleClick will then change the state of the checkboxvalues array
  //All boxes in the row and column of the focused box will be set to 0
  //The focused box itself will be toggled
  handleClick(table_index, index) {
    var timings_temp = this.state.timings.slice();
    timings_temp.push([table_index, index, new Date().getTime()]);
    var cand_name = this.props.candidates[index].name;
    var choices_temp = this.state.final_choices.slice();
    if (choices_temp[table_index] === cand_name) {
      choices_temp[table_index] = null;
    } else {
      choices_temp[table_index] = cand_name;
    }
    for (let i = 0; i < 3; i++) {
      if (i !== table_index && choices_temp[i] === choices_temp[table_index]) {
        choices_temp[i] = null;
      }
    }

    const { events, secondsElapsed } = this;
    this.events = [
      ...events,
      { choices: choices_temp, secondsElapsed: secondsElapsed }
    ];

    this.setState({
      timings: timings_temp,
      final_choices: choices_temp
    });
  }
}

class Contest extends Component {
  render() {
    return (
      <Office
        subjectNumber={this.props.subjectNumber}
        office={this.props.contest.office}
        candidates={this.props.contest.candidates}
      />
    );
  }
}

class Election extends Component {
  render() {
    return (
      <Contest
        subjectNumber={this.props.subjectNumber}
        contest={election.contests[0]}
      />
    );
  }
}

export default class ClaudiaZieglerAcemyanDesign extends Component {
  render() {
    return (
      <div className="mdc-layout-grid">
        <Election subjectNumber={this.props.location.query.subjectNumber} />
      </div>
    );
  }
}

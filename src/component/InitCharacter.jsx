import React, { Component } from "react";
import { userService, gearList } from "../services";
import "./style.css";

class InitCharacter extends Component {
  unmount = false;
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      error: null,
      submitted: false,
      loading: false,
      lastClick: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.unmount = true;
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { name, lastClick } = this.state;
    const { currentUser, handelUserData } = this.props;

    this.setState({ submitted: true });
    if (!name && !lastClick) {
      return;
    }
    this.setState({ loading: true });

    let gear = {};
    switch (lastClick.id) {
      case "1":
        gear = {
          weapon: gearList.weapons.guideBookJunior,
          armor: gearList.armors.silkRobe,
          skill: gearList.skills.sacrifice
        };
        break;
      case "2":
        gear = {
          weapon: gearList.weapons.surgicalDagger,
          armor: gearList.armors.labCoat,
          skill: gearList.skills.bloodLetting
        };
        break;
      case "3":
        gear = {
          weapon: gearList.weapons.rustyShortSword,
          armor: gearList.armors.chainArmor,
          skill: gearList.skills.slap
        };
        break;
      default:
        break;
    }

    userService.initCharacter(currentUser, name, gear, this).then(function() {
      handelUserData();
    });
  };

  handelClick = e => {
    const { lastClick } = this.state;
    e.target.classList.toggle("open");
    if (lastClick) lastClick.classList.toggle("open");
    if (!this.unmount) this.setState({ lastClick: e.target });
  };

  render() {
    const { name, submitted, loading } = this.state;
    return (
      <React.Fragment>
        <div className="panels">
          <div id="1" className="panel panel1" onClick={this.handelClick}>
            <p className="classes">Demon Scholar</p>
          </div>
          <div id="2" className="panel panel2" onClick={this.handelClick}>
            <p className="classes">Plague Doctor</p>
          </div>
          <div id="3" className="panel panel3" onClick={this.handelClick}>
            <p className="classes knight">Knight of Madness</p>
          </div>
        </div>
        <form name="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label className="text" htmlFor="name">
              Character Name
            </label>
            <input
              type="name"
              className="form-control"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
            {submitted && !name && (
              <div className="alert alert-danger">
                Character name is required
              </div>
            )}
          </div>
          <div className="form-group button">
            <button className="btn btn-primary button" disabled={loading}>
              Start
            </button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export { InitCharacter };
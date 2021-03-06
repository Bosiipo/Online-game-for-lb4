import React, { Component } from "react";
import { authenticationService } from "../services";

class Login extends Component {
  unmount = false;
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: "",
      submitted: false,
      loading: false,
      shortPassword: false
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
    const { email, password } = this.state;
    const { handelUserData } = this.props;

    this.setState({ submitted: true });
    if (!(email && password)) {
      return;
    }
    if (password.length < 8) {
      this.setState({ shortPassword: true });
      return;
    }

    this.setState({ loading: true, shortPassword: false });
    authenticationService.login(email, password, this).then(
      function() {
        if (!this.unmount) this.setState({ loading: false });
      }.bind(this)
    );
    handelUserData();
  };

  render() {
    const {
      email,
      password,
      error,
      loading,
      submitted,
      shortPassword
    } = this.state;
    return (
      <React.Fragment>
        <h2>Login</h2>
        {error && error.response.data.error.statusCode === 404 && (
          <div className={"alert alert-danger"}>Email doesn't exist</div>
        )}
        {error && error.response.data.error.statusCode === 401 && (
          <div className={"alert alert-danger"}>Password is incorrect</div>
        )}
        {error && error.response.data.error.statusCode === 422 && (
          <div className={"alert alert-danger"}>
            Email or Password is invalid
          </div>
        )}
        <form name="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
          </div>
          {submitted && !email && (
            <div className="alert alert-danger">Email is required</div>
          )}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
          </div>
          {submitted && !password && (
            <div className="alert alert-danger">Password is required</div>
          )}
          {submitted && shortPassword && (
            <div className="alert alert-danger">
              Password too short - minimum length is 8 characters
            </div>
          )}
          <div className="form-group">
            <button className="btn btn-primary" disabled={loading}>
              Login
            </button>
          </div>
          <div>
            Don't have an account? <a href="/signup"> SignUp!</a>
          </div>
        </form>
      </React.Fragment>
    );
  }
}
export { Login };
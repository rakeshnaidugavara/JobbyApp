import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    loginErrorMessage: '',
    showLoginErrorMessage: false,
  }

  onUsernameChange = event => {
    this.setState({usernameInput: event.target.value})
  }

  onPasswordChange = event => {
    this.setState({passwordInput: event.target.value})
  }

  onLoginSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onLoginFailure = errorMsg => {
    this.setState({
      loginErrorMessage: errorMsg,
      showLoginErrorMessage: true,
    })
  }

  onLoginFormSubmit = async event => {
    event.preventDefault()
    const {usernameInput, passwordInput} = this.state
    const userDetails = {username: usernameInput, password: passwordInput}
    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  render() {
    const {
      usernameInput,
      passwordInput,
      loginErrorMessage,
      showLoginErrorMessage,
    } = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="login-inner-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-website-logo"
          />
          <form
            className="login-form-container"
            onSubmit={this.onLoginFormSubmit}
          >
            <div className="login-form-input-container">
              <label htmlFor="username" className="login-form-label-element">
                USERNAME
              </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                className="login-form-input-element"
                onChange={this.onUsernameChange}
                value={usernameInput}
              />
            </div>

            <div className="login-form-input-container">
              <label htmlFor="password" className="login-form-label-element">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="login-form-input-element"
                onChange={this.onPasswordChange}
                value={passwordInput}
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            {showLoginErrorMessage && (
              <p className="login-error-message">*{loginErrorMessage}</p>
            )}
          </form>
        </div>
      </div>
    )
  }
}

export default Login

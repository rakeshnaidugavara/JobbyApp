import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onLogoutButton = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <div className="header-container">
      <ul className="small-header-container">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="small-header-website-logo"
            />
          </Link>
        </li>
        <ul className="small-header-icons-container">
          <li>
            <Link to="/" className="header-link-item-icon">
              <AiFillHome className="small-header-icons" />
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="header-link-item-icon">
              <BsFillBriefcaseFill className="small-header-icons" />
            </Link>
          </li>
          <button
            type="button"
            className="small-header-logout-button"
            onClick={onLogoutButton}
          >
            <FiLogOut className="small-header-icons" />
          </button>
        </ul>
      </ul>

      <ul className="large-header-container">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="large-header-website-logo"
            />
          </Link>
        </li>
        <ul className="large-header-link-items-container">
          <li>
            <Link to="/" className="large-header-link-items">
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="large-header-link-items">
              Jobs
            </Link>
          </li>
        </ul>
        <button
          type="button"
          className="large-header-logout-button"
          onClick={onLogoutButton}
        >
          Logout
        </button>
      </ul>
    </div>
  )
}

export default withRouter(Header)

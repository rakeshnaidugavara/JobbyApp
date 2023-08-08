import './index.css'

const NotFound = () => (
  <div className="not-found-route-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      alt="not found"
      className="not-found-route-image"
    />
    <h1 className="not-found-route-heading">Page Not found</h1>
    <p className="not-found-route-description">
      We are sorry, the page you requested could not be found
    </p>
  </div>
)

export default NotFound

import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'

import Header from '../Header'

import './index.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_Progress',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobItemDetails: {},
    similarJobsDetails: [],
    jobItemDetailsAPIStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  jobItemDetailsAPISuccess = jobItemData => {
    const lifeAtCompany = {
      description: jobItemData.job_details.life_at_company.description,
      imageUrl: jobItemData.job_details.life_at_company.image_url,
    }
    const skills = jobItemData.job_details.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    }))
    const jobDetails = {
      companyLogoUrl: jobItemData.job_details.company_logo_url,
      companyWebsiteUrl: jobItemData.job_details.company_website_url,
      employmentType: jobItemData.job_details.employment_type,
      id: jobItemData.job_details.id,
      jobDescription: jobItemData.job_details.job_description,
      lifeAtCompany,
      location: jobItemData.job_details.location,
      packagePerAnnum: jobItemData.job_details.package_per_annum,
      rating: jobItemData.job_details.rating,
      skills,
      title: jobItemData.job_details.title,
    }
    const similarJobsDetails = jobItemData.similar_jobs.map(eachItem => ({
      companyLogoUrl: eachItem.company_logo_url,
      employmentType: eachItem.employment_type,
      id: eachItem.id,
      jobDescription: eachItem.job_description,
      location: eachItem.location,
      rating: eachItem.rating,
      title: eachItem.title,
    }))
    this.setState({
      jobItemDetails: jobDetails,
      similarJobsDetails,
      jobItemDetailsAPIStatus: apiStatusConstants.success,
    })
  }

  jobItemDetailsAPIFailure = () => {
    this.setState({jobItemDetailsAPIStatus: apiStatusConstants.failure})
  }

  getJobItemDetails = async () => {
    this.setState({jobItemDetailsAPIStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')
    const jobItemUrl = `https://apis.ccbp.in/jobs/${id}`
    const jobItemOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const jobItemResponse = await fetch(jobItemUrl, jobItemOptions)
    const jobItemData = await jobItemResponse.json()
    if (jobItemResponse.ok === true) {
      this.jobItemDetailsAPISuccess(jobItemData)
    } else {
      this.jobItemDetailsAPIFailure()
    }
  }

  onJobItemDetailsRetryButton = () => {
    this.getJobItemDetails()
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemDetailsViewContainer = () => {
    const {jobItemDetails} = this.state
    return (
      <div className="job-item-details-view-container">
        <div className="job-item-details-logo-title-rating-container">
          <img
            src={jobItemDetails.companyLogoUrl}
            alt="job details company logo"
            className="job-item-details-company-logo"
          />
          <div className="job-item-details-title-rating-container">
            <h1 className="job-item-details-job-title">
              {jobItemDetails.title}
            </h1>
            <div className="job-item-details-star-icon-rating-container">
              <AiFillStar className="job-item-details-star-icon" />
              <p className="job-item-details-rating">{jobItemDetails.rating}</p>
            </div>
          </div>
        </div>
        <div className="job-item-details-location-employment-type-salary-container">
          <div className="job-item-details-location-employment-type-container">
            <div className="job-item-details-icon-and-text-container">
              <MdLocationOn className="job-item-details-location-employment-icon" />
              <p className="job-item-details-icon-name">
                {jobItemDetails.location}
              </p>
            </div>
            <div className="job-item-details-icon-and-text-container">
              <BsFillBriefcaseFill className="job-item-details-location-employment-icon" />
              <p className="job-item-details-icon-name">
                {jobItemDetails.employmentType}
              </p>
            </div>
          </div>
          <p className="job-item-details-package-per-annum">
            {jobItemDetails.packagePerAnnum}
          </p>
        </div>
        <div className="job-item-details-description-container">
          <div className="job-item-details-description-text-and-visit-container">
            <h1 className="job-item-details-side-headings">Description</h1>
            <a
              href={jobItemDetails.companyWebsiteUrl}
              className="job-item-details-visit-link"
            >
              Visit
              <BsBoxArrowUpRight className="job-item-details-visit-arrow" />
            </a>
          </div>
          <p className="job-item-details-description">
            {jobItemDetails.jobDescription}
          </p>
        </div>
        <div className="job-item-details-skills-container">
          <h1 className="job-item-details-skill-text">Skills</h1>
          <ul className="job-item-details-list-container">
            {jobItemDetails.skills.map(eachItem => (
              <li key={eachItem.name} className="job-item-details-skill-item">
                <img
                  src={eachItem.imageUrl}
                  alt={eachItem.name}
                  className="job-item-details-skill-image"
                />
                <p className="job-item-details-skill-name">{eachItem.name}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="job-item-details-life-at-company-container">
          <div className="job-item-details-life-at-company-text-container">
            <h1 className="job-item-details-skill-text">Life at Company</h1>
            <p className="job-item-details-description">
              {jobItemDetails.lifeAtCompany.description}
            </p>
          </div>
          <img
            src={jobItemDetails.lifeAtCompany.imageUrl}
            alt="life at company"
            className="job-item-details-life-at-company-image"
          />
        </div>
      </div>
    )
  }

  renderSimilarJobItemDetailsContainer = () => {
    const {similarJobsDetails} = this.state
    return (
      <div className="similar-job-item-details-container">
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list-container">
          {similarJobsDetails.map(eachItem => (
            <li key={eachItem.id} className="similar-job-item-container">
              <div className="job-item-details-logo-title-rating-container">
                <img
                  src={eachItem.companyLogoUrl}
                  alt="similar job company logo"
                  className="job-item-details-company-logo"
                />
                <div className="job-item-details-title-rating-container">
                  <h1 className="job-item-details-job-title">
                    {eachItem.title}
                  </h1>
                  <div className="job-item-details-star-icon-rating-container">
                    <AiFillStar className="job-item-details-star-icon" />
                    <p className="job-item-details-rating">{eachItem.rating}</p>
                  </div>
                </div>
              </div>
              <div className="similar-jobs-description-container">
                <h1 className="similar-jobs-description-heading">
                  Description
                </h1>
                <p className="similar-jobs-description">
                  {eachItem.jobDescription}
                </p>
              </div>
              <div className="job-item-details-location-employment-type-container">
                <div className="job-item-details-icon-and-text-container">
                  <MdLocationOn className="job-item-details-location-employment-icon" />
                  <p className="job-item-details-icon-name">
                    {eachItem.location}
                  </p>
                </div>
                <div className="job-item-details-icon-and-text-container">
                  <BsFillBriefcaseFill className="job-item-details-location-employment-icon" />
                  <p className="job-item-details-icon-name">
                    {eachItem.employmentType}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJobItemDetailsSuccessView = () => (
    <div className="job-item-details-success-view-container">
      {this.renderJobItemDetailsViewContainer()}
      {this.renderSimilarJobItemDetailsContainer()}
    </div>
  )

  renderJobItemDetailsFailureView = () => (
    <div className="job-item-details-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-item-details-failure-view-image"
      />
      <h1 className="job-item-details-failure-view-heading">
        Oops! Something Went Wrong
      </h1>
      <p className="job-item-details-failure-view-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="job-item-details-retry-button"
        onClick={this.onJobItemDetailsRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderJobItemDetailsRoute = () => {
    const {jobItemDetailsAPIStatus} = this.state
    switch (jobItemDetailsAPIStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemDetailsSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderJobItemDetailsFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-route-container">
        <Header />
        <div className="job-details-route-inner-container">
          {this.renderJobItemDetailsRoute()}
        </div>
      </div>
    )
  }
}

export default JobItemDetails

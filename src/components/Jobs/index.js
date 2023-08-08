import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsSearch, BsFillBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'

import './index.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_Progress',
  success: 'SUCCESS',
  failure: 'FAILURE',
  noJobs: 'NO_JOBS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    profileAPIStatus: apiStatusConstants.initial,
    jobListDetails: [],
    jobListAPIStatus: apiStatusConstants.initial,
    jobSearchInput: '',
    employmentTypeFilterList: [],
    salaryRangeFilter: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsListDetails()
  }

  profileAPISuccess = profileData => {
    const formattedProfileData = {
      name: profileData.name,
      profileImageUrl: profileData.profile_image_url,
      shortBio: profileData.short_bio,
    }
    this.setState({
      profileDetails: formattedProfileData,
      profileAPIStatus: apiStatusConstants.success,
    })
  }

  profileAPIFailure = () => {
    this.setState({profileAPIStatus: apiStatusConstants.failure})
  }

  getProfileDetails = async () => {
    this.setState({profileAPIStatus: apiStatusConstants.inProgress})
    const profileUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const profileOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileUrl, profileOptions)
    const data = await response.json()
    if (response.ok === true) {
      this.profileAPISuccess(data.profile_details)
    } else {
      this.profileAPIFailure()
    }
  }

  jobsListAPISuccess = jobsData => {
    if (jobsData.jobs.length === 0) {
      this.setState({jobListAPIStatus: apiStatusConstants.noJobs})
    } else {
      const formattedJobsList = jobsData.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobListDetails: formattedJobsList,
        jobListAPIStatus: apiStatusConstants.success,
      })
    }
  }

  jobsListAPIFailure = () => {
    this.setState({jobListAPIStatus: apiStatusConstants.failure})
  }

  getJobsListDetails = async () => {
    const {
      jobSearchInput,
      employmentTypeFilterList,
      salaryRangeFilter,
    } = this.state
    const employmentTypeFilterString = employmentTypeFilterList.join(',')
    this.setState({jobListAPIStatus: apiStatusConstants.inProgress})
    const jobsUrl = `https://apis.ccbp.in/jobs?search=${jobSearchInput}&employment_type=${employmentTypeFilterString}&minimum_package=${salaryRangeFilter}`
    const jwtToken = Cookies.get('jwt_token')
    const jobOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const jobsResponse = await fetch(jobsUrl, jobOptions)
    const jobsData = await jobsResponse.json()
    if (jobsResponse.ok === true) {
      this.jobsListAPISuccess(jobsData)
    } else {
      this.jobsListAPIFailure()
    }
  }

  onProfileRetryButton = () => {
    this.getProfileDetails()
  }

  onJobListRetryButton = () => {
    this.getJobsListDetails()
  }

  onChangeJobSearchInput = event => {
    this.setState({jobSearchInput: event.target.value})
  }

  onClickJobSearchIcon = () => {
    this.getJobsListDetails()
  }

  onChangeEmploymentTypeFilter = event => {
    const {employmentTypeFilterList} = this.state
    const employmentTypeFilterValue = event.target.value
    if (employmentTypeFilterList.includes(employmentTypeFilterValue)) {
      const filteredList = employmentTypeFilterList.filter(
        eachItem => eachItem !== employmentTypeFilterValue,
      )
      this.setState(
        {employmentTypeFilterList: filteredList},
        this.getJobsListDetails,
      )
    } else {
      this.setState(
        prevState => ({
          employmentTypeFilterList: [
            ...prevState.employmentTypeFilterList,
            employmentTypeFilterValue,
          ],
        }),
        this.getJobsListDetails,
      )
    }
  }

  onChangeSalaryFilter = event => {
    this.setState(
      {salaryRangeFilter: event.target.value},
      this.getJobsListDetails,
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsProfileSuccessView = () => {
    const {profileDetails} = this.state
    const {profileImageUrl, name, shortBio} = profileDetails
    return (
      <div className="jobs-profile-container">
        <img
          src={profileImageUrl}
          alt="profile"
          className="jobs-profile-image"
        />
        <h1 className="jobs-profile-name">{name}</h1>
        <p className="jobs-profile-short-bio">{shortBio}</p>
      </div>
    )
  }

  renderJobsProfileFailureView = () => (
    <div className="job-profile-failure-view-container">
      <button
        type="button"
        className="job-profile-retry-button"
        onClick={this.onProfileRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderJobsProfileContainer = () => {
    const {profileAPIStatus} = this.state
    switch (profileAPIStatus) {
      case apiStatusConstants.success:
        return this.renderJobsProfileSuccessView()
      case apiStatusConstants.inProgress:
        return (
          <div className="profile-loader-container">{this.renderLoader()}</div>
        )
      case apiStatusConstants.failure:
        return this.renderJobsProfileFailureView()
      default:
        return null
    }
  }

  renderSmallJobsFilterSearchContainer = () => {
    const {jobSearchInput} = this.state
    return (
      <div className="small-jobs-filter-search-container">
        <input
          type="search"
          placeholder="Search"
          onChange={this.onChangeJobSearchInput}
          value={jobSearchInput}
          className="small-jobs-filter-search-element"
        />
        <button
          type="button"
          data-testid="searchButton"
          onClick={this.onClickJobSearchIcon}
          className="small-jobs-filter-search-button"
        >
          <BsSearch className="small-jobs-filter-search-icon" />
        </button>
      </div>
    )
  }

  renderTypeOfEmploymentFilter = () => (
    <div className="type-of-employment-filter-container">
      <h1 className="jobs-filter-heading">Type Of Employment</h1>
      <ul className="filter-inner-container">
        {employmentTypesList.map(eachItem => (
          <li key={eachItem.employmentTypeId} className="filter-item">
            <input
              type="checkbox"
              id={eachItem.employmentTypeId}
              value={eachItem.employmentTypeId}
              className="filter-checkbox"
              onChange={this.onChangeEmploymentTypeFilter}
            />
            <label
              htmlFor={eachItem.employmentTypeId}
              className="filter-label-element"
            >
              {eachItem.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderSalaryRangeFilter = () => (
    <div className="salary-range-filter-container">
      <h1 className="jobs-filter-heading">Salary Range</h1>
      <ul className="filter-inner-container">
        {salaryRangesList.map(eachItem => (
          <li key={eachItem.salaryRangeId} className="filter-item">
            <input
              type="radio"
              name="salaryFilter"
              id={eachItem.salaryRangeId}
              value={eachItem.salaryRangeId}
              onChange={this.onChangeSalaryFilter}
              className="filter-checkbox"
            />
            <label
              htmlFor={eachItem.salaryRangeId}
              className="filter-label-element"
            >
              {eachItem.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderJobsProfileAndFilterContainer = () => (
    <>
      <div className="jobs-profile-and-filters-container">
        {this.renderSmallJobsFilterSearchContainer()}
        {this.renderJobsProfileContainer()}
        {this.renderTypeOfEmploymentFilter()}
        {this.renderSalaryRangeFilter()}
      </div>
    </>
  )

  renderLargeJobsFilterSearchContainer = () => {
    const {jobSearchInput} = this.state
    return (
      <div className="large-jobs-filter-search-container">
        <input
          type="search"
          placeholder="Search"
          onChange={this.onChangeJobSearchInput}
          value={jobSearchInput}
          className="large-jobs-filter-search-element"
        />
        <button
          type="button"
          data-testid="searchButton"
          onClick={this.onClickJobSearchIcon}
          className="large-jobs-filter-search-button"
        >
          <BsSearch className="large-jobs-filter-search-icon" />
        </button>
      </div>
    )
  }

  renderJobsListSuccessView = () => {
    const {jobListDetails} = this.state
    return (
      <ul className="jobs-list-container">
        {this.renderLargeJobsFilterSearchContainer()}
        {jobListDetails.map(eachItem => (
          <Link
            to={`/jobs/${eachItem.id}`}
            key={eachItem.id}
            className="jobs-link-item"
          >
            <li className="jobs-route-job-item">
              <div className="jobs-route-logo-title-rating-container">
                <img
                  src={eachItem.companyLogoUrl}
                  alt="company logo"
                  className="jobs-route-company-logo"
                />
                <div className="jobs-route-title-rating-container">
                  <h1 className="jobs-route-job-title">{eachItem.title}</h1>
                  <div className="jobs-route-star-icon-rating-container">
                    <AiFillStar className="jobs-route-star-icon" />
                    <p className="jobs-route-rating">{eachItem.rating}</p>
                  </div>
                </div>
              </div>
              <div className="jobs-route-location-employment-type-salary-container">
                <div className="jobs-route-location-employment-type-container">
                  <div className="jobs-route-icon-and-text-container">
                    <MdLocationOn className="jobs-route-location-employment-icon" />
                    <p className="jobs-route-icon-name">{eachItem.location}</p>
                  </div>
                  <div className="jobs-route-icon-and-text-container">
                    <BsFillBriefcaseFill className="jobs-route-location-employment-icon" />
                    <p className="jobs-route-icon-name">
                      {eachItem.employmentType}
                    </p>
                  </div>
                </div>
                <p className="jobs-route-package-per-annum">
                  {eachItem.packagePerAnnum}
                </p>
              </div>
              <div className="jobs-route-description-container">
                <h1 className="jobs-route-description-text">Description</h1>
                <p className="jobs-route-description">
                  {eachItem.jobDescription}
                </p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  renderJobsListFailureView = () => (
    <div className="jobs-list-failure-view-container">
      {this.renderLargeJobsFilterSearchContainer()}
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-list-failure-view-image"
      />
      <h1 className="jobs-list-failure-view-heading">
        Oops! Something Went Wrong
      </h1>
      <p className="jobs-list-failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="job-profile-retry-button"
        onClick={this.onJobListRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => (
    <div className="jobs-list-failure-view-container">
      {this.renderLargeJobsFilterSearchContainer()}
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="jobs-list-failure-view-image"
      />
      <h1 className="jobs-list-failure-view-heading">No Jobs Found</h1>
      <p className="jobs-list-failure-view-description">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  renderJobsListContainer = () => {
    const {jobListAPIStatus} = this.state
    switch (jobListAPIStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListSuccessView()
      case apiStatusConstants.inProgress:
        return (
          <div className="jobs-list-container jobs-list-loader-container">
            {this.renderLoader()}
          </div>
        )
      case apiStatusConstants.failure:
        return this.renderJobsListFailureView()
      case apiStatusConstants.noJobs:
        return this.renderNoJobsView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobs-container">
        <Header />
        <div className="jobs-inner-container">
          {this.renderJobsProfileAndFilterContainer()}
          {this.renderJobsListContainer()}
        </div>
      </div>
    )
  }
}

export default Jobs

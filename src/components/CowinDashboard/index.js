import {Component} from 'react'
import Loader from 'react-loader-spinner' // Import Loader component
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

class CowinDashboard extends Component {
  requestStatus = {
    initial: 'INITIAL',
    progress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE',
  }

  state = {
    urlRequestStatus: this.requestStatus.progress,
    vaccinationDetails: [],
  }

  componentDidMount() {
    this.getApiDetails()
  }

  getApiDetails = async () => {
    this.setState({urlRequestStatus: this.requestStatus.progress})
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      this.setState({
        vaccinationDetails: data,
        urlRequestStatus: this.requestStatus.success,
      })
    } else {
      this.setState({urlRequestStatus: this.requestStatus.failure})
    }
  }

  loaderFunction = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  failurePage = () => (
    <div
      style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
    >
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Something went Wrong</h1>
    </div>
  )

  successPage = () => {
    const {vaccinationDetails} = this.state
    return (
      <div>
        <VaccinationCoverage
          details={vaccinationDetails.last_7_days_vaccination}
        />
        <VaccinationByGender data={vaccinationDetails.vaccination_by_gender} />
        <VaccinationByAge data={vaccinationDetails.vaccination_by_age} />
      </div>
    )
  }

  getPage = () => {
    const {urlRequestStatus} = this.state
    switch (urlRequestStatus) {
      case this.requestStatus.progress:
        return this.loaderFunction()
      case this.requestStatus.success:
        return this.successPage()
      case this.requestStatus.failure:
        return this.failurePage()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main-container">
        <div style={{padding: '25px'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="logo-image"
            />
            <h1 style={{color: ' #2cc6c6'}}>Co-WIN</h1>
          </div>
          <h1>CoWIN Vaccination in India</h1>
        </div>
        {this.getPage()}
      </div>
    )
  }
}

export default CowinDashboard

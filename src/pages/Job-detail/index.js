import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";

const JobDetail = () => {
  return (
    <React.Fragment>
      <MetaTags>
        <title>business development associate Job Openings Mumbai | Innowrap</title>
        <meta name="description"
              content="Are you looking out for Job? Applycup provides Job opportunities across India" />
      </MetaTags>
      <div className="apply-now-container">
        <div className="header">
          <h4 className="job-title">business development associate <span>Full-Time</span></h4>
          <h6 className="job-company">Innowrap</h6>
          <div className="job-details">
            <span><i className="bx bx-briefcase-alt"></i> 2 - 3 years</span>
            <span><i className="bx bx-money"></i> INR 3 - 3.5 LPA</span>
            <span><i className="bx bx-map"></i> Mumbai</span>
          </div>
          <button className="btn btn-light apply-btn" title={"Apply Now"}>Apply Now</button>
        </div>
        <div className="apply-now-body">
          <div className="apply-now-body-container">
            <div>
              <div className="apply-now-card">
                <div className="apply-now-card-title">Job Description</div>
                <div className="apply-now-card-detail" >
                  <span>Relax in the spacious rooms complete with a minibar, and free Wi-Fi. To get a stunning view of the city, you may also choose to upgrade to one of their suites. With Curly Tales offer, you can avail of them at prices as low as ₹8000 per night. And that’s it! You also get to enjoy complimentary breakfast and lunch.</span>
                </div>
              </div>
              <div className="apply-now-card">
                <div className="apply-now-card-title">Requirements</div>
                <div className="apply-now-card-detail" >
                  <span>Relax in the spacious rooms complete with a minibar, and free Wi-Fi. To get a stunning view of the city, you may also choose to upgrade to one of their suites. With Curly Tales offer, you can avail of them at prices as low as ₹8000 per night. And that’s it! You also get to enjoy complimentary breakfast and lunch.</span>
                </div>
              </div>
              <div className="apply-now-card">
                <div className="apply-now-card-title">Benefits</div>
                <div className="apply-now-card-detail" >
                  <span>Relax in the spacious rooms complete with a minibar, and free Wi-Fi. To get a stunning view of the city, you may also choose to upgrade to one of their suites. With Curly Tales offer, you can avail of them at prices as low as ₹8000 per night. And that’s it! You also get to enjoy complimentary breakfast and lunch.</span>
                </div>
              </div>
            </div>
            <div className="apply-now-job">
              <div className="apply-now-job-detail">
                <div>
                  <div className="apply-now-row">
                    <div className="apply-now-column1">Role:</div>
                    <div className="apply-now-column2">business development associate</div>
                  </div>
                </div>
                <div>
                  <div className="apply-now-row">
                    <div className="apply-now-column1">Location:</div>
                    <div className="apply-now-column2">Mumbai</div>
                  </div>
                </div>
                <div>
                  <div className="apply-now-row">
                    <div className="apply-now-column1">Work Exp.:</div>
                    <div className="apply-now-column2">2-3 Years</div>
                  </div>
                </div>
                <div>
                  <div className="apply-now-row">
                    <div className="apply-now-column1">Job Type:</div>
                    <div className="apply-now-column2">Full Time</div>
                  </div>
                </div>
                <div>
                  <div className="apply-now-row">
                    <div className="apply-now-column1">Salary:</div>
                    <div className="apply-now-column2">INR 3-3.5 LPA</div>
                  </div>
                </div>
                <div></div>
              </div>
              <button className="btn btn-primary mt-4" title={"Apply Now"}>Apply Now</button>
              <div className="apply-now-social">
                Share with friends
                <div className="share-icon-row">
                  <div className="share-icon">
                    <a href="#"><i className="bx bxl-facebook-square"></i></a>
                  </div>
                  <div className="share-icon">
                    <a href="#"><i className="bx bxl-linkedin-square"></i></a>
                  </div>
                  <div className="share-icon">
                    <a href="#"><i className="bx bxl-twitter"></i></a>
                  </div>
                  <div className="share-icon">
                    <a href="#"><i className="bx bx-mail-send"></i></a>
                  </div>
                </div>
              </div>
              <button className="btn btn-outline-primary mt-4" title={"View all openings"}>View all openings</button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default JobDetail;
import React from 'react';
import './Loader.css'; // Ensure styles below are added there

export default function Footer() {
  return (
    <footer className="footer-bg-container pt-5 pb-4 text-white">
      <div className="container">
        <div className="row">

          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <h2 className="footer-section-heading">FeedMe Now</h2>
            <div className="d-flex justify-content-center justify-content-md-start mt-3">
              <a href="#" className="footer-social-cards"><i className="fab fa-google"></i></a>
              <a href="#" className="footer-social-cards"><i className="fab fa-twitter"></i></a>
              <a href="#" className="footer-social-cards"><i className="fab fa-instagram"></i></a>
              <a href="#" className="footer-social-cards"><i className="fab fa-linkedin"></i></a>
            </div>
            <p className="footer-address mt-3">
              Motilal Nehru National Institute of Technology, Prayagraj, Uttar Pradesh, India.
            </p>
          </div>

          <div className="col-6 col-lg-3 mb-4">
            <h5 className="footer-heading">Get to know us</h5>
            <ul className="list-unstyled footer-para">
              <li>About Us</li>
              <li>Careers</li>
              <li>Where We Deliver?</li>
              <li>Rate With Us</li>
            </ul>
          </div>

          <div className="col-6 col-lg-3 mb-4">
            <h5 className="footer-heading">Connect With Us</h5>
            <ul className="list-unstyled footer-para">
              <li>Facebook</li>
              <li>Twitter</li>
              <li>Instagram</li>
            </ul>
          </div>

          <div className="col-6 col-lg-3 mb-4">
            <h5 className="footer-heading">Legal</h5>
            <ul className="list-unstyled footer-para">
              <li>Terms & Conditions</li>
              <li>Cookie Policy</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div className="col-12 text-center mt-4">
            <p className="footer-creater-name mb-0">
              &copy; 2024 by <span className="text-warning">Web Kings</span>. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}

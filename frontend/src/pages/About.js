import Header from "../components/Header";
import "./About.css";

const About = () => {
  return (
    <>
      <Header />

      <div className="about-page">
        <h1 className="about-title">About This Website</h1>

        <p className="about-text">
          A fully functional Flipkart-style e-commerce website built using the MERN stack.
          It includes user login, product management, admin dashboard, order placement,
          cart system, and order tracking.
        </p>

        <p className="about-text">
          Created by <strong>Ajay K.P</strong> with the help of AI assistance for faster
          development and clean structure.
        </p>
      </div>
    </>
  );
};

export default About;

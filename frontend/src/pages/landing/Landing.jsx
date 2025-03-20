import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="flex-1 flex flex-col md:flex-row items-center justify-center px-4 py-16 mt-8">
        <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Connect, Collaborate & Learn Together
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            StudySphere brings students and educators together in real-time. Share knowledge,
            solve problems, and make your study sessions more productive.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-transparent border border-white text-white font-medium px-6 py-3 rounded-md hover:bg-white hover:text-gray-900 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/chat.png"
            alt="StudySphere Illustration"
            className="w-full max-w-md rounded-lg shadow-2xl"
          />
        </div>
      </section>

      {/* Features section */}
      <section className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Why Choose StudySphere?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🚀"
              title="Real-Time Collaboration"
              description="Connect instantly with peers and mentors to solve problems together."
            />
            <FeatureCard
              icon="🛡️"
              title="Secure Communication"
              description="End-to-end encryption ensures your academic conversations remain private."
            />
            <FeatureCard
              icon="📱"
              title="Accessible Anywhere"
              description="Study on any device with our responsive platform designed for collaboration."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} StudySphere. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-700 bg-opacity-40 backdrop-filter backdrop-blur-lg p-6 rounded-lg text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export default Landing;

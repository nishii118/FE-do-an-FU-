import React from "react";

import image from "../../../assets/images/bridge.jpg";
import bgImage from "../../../assets/images/user-banner.jpg";

const AboutChallenge = () => {
  return (
    <div className="bg-white">
      <header
        className="relative text-center py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-6 text-white">
            Trở thành đại sứ của Sức mạnh 2000 chưa bao giờ dễ dàng đến thế
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-white">
            Trang web "GÓP LẺ" trực tuyến của chúng tôi là một cộng đồng nơi bạn
            có thể tập hợp gia đình và bạn bè để cùng tham gia để các bạn có thể
            đem đến nụ cười cho trẻ em vùng cao.
          </p>
          <button className="bg-primary text-white py-3 px-6 rounded-full text-lg">
            Đăng ký
          </button>
        </div>
      </header>
      <div className="container mx-auto">
        {/* Feature Sections */}
        <section className="flex justify-center mt-16">
          <div className="text-center mx-4 flex-1">
            <h3 className="text-xl font-semibold mb-4">Build Your Page</h3>
            <p className="mb-6">
              Set your campaign goal and let the world know why you’re
              passionate about your cause.
            </p>
          </div>
          <div className="text-center mx-4 flex-1">
            <h3 className="text-xl font-semibold mb-4">Involve Others</h3>
            <p className="mb-6">
              Email your page to your family, friends, classmates, and
              co-workers, and ask them for their support.
            </p>
          </div>
          <div className="text-center mx-4 flex-1">
            <h3 className="text-xl font-semibold mb-4">Get Creative!</h3>
            <p className="mb-6">The possibilities are endless!</p>
          </div>
        </section>

        {/* Campaign Examples */}
        <section className="mt-20">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 p-4">
                <img
                  src={image}
                  alt="Engage Your School"
                  className="rounded-lg mb-4"
                />
              </div>
              <div className="w-full md:w-1/2 p-4">
                <h3 className="text-xl font-semibold mb-2">
                  Engage Your School
                </h3>
                <p className="mb-4">
                  Your classroom and school can help to support students by
                  starting a campaign, hosting bake sales, and doing classroom
                  dress-up days.
                </p>
                <button className="bg-blue-500 text-white py-2 px-4 rounded-full">
                  Learn More
                </button>
              </div>
            </div>

            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 p-4">
                <h3 className="text-xl font-semibold mb-2">
                  Calling All Athletes!
                </h3>
                <p className="mb-4">
                  Support students around the globe by joining one of our
                  marathon teams in 2024!
                </p>
                <button className="bg-yellow-500 text-white py-2 px-4 rounded-full">
                  Learn More
                </button>
              </div>
              <div className="w-full md:w-1/2 p-4">
                <img
                  src={image}
                  alt="Calling All Athletes!"
                  className="rounded-lg mb-4"
                />
              </div>
            </div>

            <div className="flex flex-wrap mt-8">
              <div className="w-full md:w-1/2 p-4">
                <img
                  src={image}
                  alt="Donate Your Birthday"
                  className="rounded-lg mb-4"
                />
              </div>
              <div className="w-full md:w-1/2 p-4">
                <h3 className="text-xl font-semibold mb-2">
                  Donate Your Birthday
                </h3>
                <p className="mb-4">
                  This year, you can have double the impact on children around
                  the world by donating your birthday to a cause.
                </p>
                <button className="bg-teal-500 text-white py-2 px-4 rounded-full">
                  Sign Up Here
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutChallenge;

import React from "react";

// import Intro from './components/Intro';
import Playground from "./components/Playground";
import BannerFreeKassa from "./components/BannerFreeKassa";

function Page(props) {
  return (
    <React.Fragment>
      {/* <Intro /> */}
      <Playground />
      {/* <BannerFreeKassa /> */}
    </React.Fragment>
  );
}

Page.propTypes = {};

export default Page;

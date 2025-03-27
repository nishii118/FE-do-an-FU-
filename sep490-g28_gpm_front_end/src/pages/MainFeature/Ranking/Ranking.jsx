import { Helmet } from "react-helmet";
import { NewsBannerBreadcrumb } from "../Common";
import ChallengesSlider from "./ChallengesSlider";
import Leaderboard from "./Leaderboard";
import defaultImage from "../../../assets/images/sucmanh2000.png";
const ITEMS_PER_PAGE = 6;

const Ranking = () => {
  return (
    <div>
      <Helmet>
        <title>Top 10 đại sứ</title>
        <meta
          name="description"
          content="Top 10 đại sứ đồng hành cùng Sức mạnh 2000."
        />

        <meta property="og:title" content="Top 10 đại sứ" />
        <meta
          property="og:description"
          content="Top 10 đại sứ đồng hành cùng Sức mạnh 2000."
        />
        <meta property="og:image" content={defaultImage} />
        <meta property="og:url" content="https://fpt.sucmanh2000.com/xep-hang"/>
        <meta property="og:type" content="website" />
      </Helmet>
      <NewsBannerBreadcrumb
        data={[{ title: "Thử thách" }]}
        pageTitle={"Đại sứ và thử thách"}
      />
      <Leaderboard />
      <ChallengesSlider />
    </div>
  );
};

export default Ranking;

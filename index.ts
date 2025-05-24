import axios from "axios";
import fs from "fs";
import path from "path";

const getTotalSeasons = async (seasonImdbId: string) => {
  const getSeaonDeatil = await axios(
    `http://www.omdbapi.com/?i=${seasonImdbId}&apikey=${process.env.api_key}`
  );
  const totalSeasons = getSeaonDeatil.data.totalSeasons;
  return parseInt(totalSeasons);
};

const EpisiodeDetail = async (totalSeasons: number, seasonImdbId: string) => {
  const complteDetail: { titleWithEpNo: string; subtitleURL: string }[] = [];
  let str = "";
  for (let i = 0; i < totalSeasons; i++) {
    const getSeaonDeatil = await axios(
      `http://www.omdbapi.com/?i=${seasonImdbId}&apikey=${
        process.env.api_key
      }&Season=${i + 1}`
    );
    const { Title: seasonTitle, Season, Episodes } = getSeaonDeatil.data;
    console.log(seasonTitle);
    console.log(Season);
    try {
      for (let i = 0; i < Episodes.length; i++) {
        const { Title, Episode, imdbID } = Episodes[i];
        const modifiedImdbID = imdbID.replace("tt", "");
        const name = `Season-${Season} - ${Title} - EP-${Episode}`;
        const baseURL =
          "https://www.opensubtitles.org/en/download/s/sublanguageid-eng/imdbid-";
        const subtitleURL = `${baseURL}${modifiedImdbID}`;
        str += name + " - " + "`" + subtitleURL + "`" + "\n\n";
        complteDetail.push({ titleWithEpNo: name, subtitleURL });
      }
    } catch (e) {
      console.log("inside catch ");
      console.log(`seasonTitle : ${seasonTitle} Season : ${Season}`);
      console.log(e);
    }

    const dir = "subtitles";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(path.join(dir, `${seasonTitle}.txt`), str, "utf8");
    // console.log(getSeaonDeatil.data);
  }
};
const seasonImdbId = "tt7335184";
const TotalSeasons = await getTotalSeasons(seasonImdbId);
EpisiodeDetail(TotalSeasons, seasonImdbId);

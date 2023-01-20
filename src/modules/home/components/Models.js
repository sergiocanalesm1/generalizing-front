import Book from "./originModels/Book";
import Chalkboard from "./originModels/Chalkboard";
import Newspaper from "./originModels/Newspaper";
import PersonalXP from "./originModels/PersonalXP";
import Theater from "./originModels/Theater";
import Video from "./originModels/Video";
import Videogame from "./originModels/Videogame";
import Vinyl from "./originModels/Vinyl";

// TODO check if removing position works
export default [
  Book,
  Chalkboard,
  Newspaper,
  PersonalXP,
  Theater,
  Video,
  Videogame,
  Vinyl,
];

export const originsComponentOrder = [
  "Book",
  "Lecture",
  "Article",
  "Personal Experience",
  "Theater Play",
  "Video",
  "Video Game",
  "Song",
];

// export const bookModelUrl = "./models/book.glb";
// export const lectureModelUrl = "./models/chalkboard2.glb";
// export const articleModelUrl = "./models/newspaper2.glb";
// export const personalXPModelUrl = "./models/personal xp.glb";
// export const theaterPlayModelUrl = "./models/theater.glb";
// export const videoModelUrl = "./models/theater.glb";
// export const videoGameModelUrl = "./models/videogame.glb";
// export const songModelUrl = "./models/vinyl2.glb";

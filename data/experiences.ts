export type CategoryId =
  | "travel"
  | "food"
  | "adventure"
  | "city"
  | "culture"
  | "everyday";

export type Category = {
  id: CategoryId;
  label: string;
  icon: string;
  tagline: string;
};

export type Experience = {
  id: string;
  category: CategoryId;
  title: string;
  icon: string;
  points: 1 | 2 | 3; // 1 = very common, 2 = fairly special, 3 = rare flex
};

export const categories: Category[] = [
  { id: "travel", label: "Travel", icon: "🧳", tagline: "Places you've actually been." },
  { id: "food", label: "Food", icon: "🍛", tagline: "Be honest. What have you eaten?" },
  { id: "adventure", label: "Adventure", icon: "⛰️", tagline: "The stories you tell at gatherings." },
  { id: "city", label: "City Life", icon: "🏙️", tagline: "Surviving the chaos counts." },
  { id: "culture", label: "Culture", icon: "🎉", tagline: "Celebrations, crowds and memories." },
  { id: "everyday", label: "Everyday Bangladesh", icon: "☔", tagline: "The small things only we understand." },
];

export const experiences: Experience[] = [
  // TRAVEL
  { id: "t1", category: "travel", icon: "🏖️", title: "Watched the waves at Cox's Bazar", points: 1 },
  { id: "t2", category: "travel", icon: "🍃", title: "Walked through the tea gardens of Sylhet", points: 1 },
  { id: "t3", category: "travel", icon: "⛰️", title: "Explored the hills of Bandarban", points: 2 },
  { id: "t4", category: "travel", icon: "☁️", title: "Stood above the clouds in Sajek", points: 2 },
  { id: "t5", category: "travel", icon: "🛶", title: "Took a boat across Kaptai Lake in Rangamati", points: 2 },
  { id: "t6", category: "travel", icon: "🌅", title: "Seen sunrise and sunset from the same beach in Kuakata", points: 2 },
  { id: "t7", category: "travel", icon: "🏝️", title: "Made it all the way to Saint Martin", points: 3 },
  { id: "t8", category: "travel", icon: "🐅", title: "Entered the Sundarbans", points: 3 },
  { id: "t9", category: "travel", icon: "🚂", title: "Took a long train journey with the window open", points: 2 },
  { id: "t10", category: "travel", icon: "🚢", title: "Spent a night on a launch", points: 2 },

  // FOOD
  { id: "f1", category: "food", icon: "🍗", title: "Ate kacchi in Old Dhaka", points: 2 },
  { id: "f2", category: "food", icon: "🥟", title: "Had fuchka from a roadside stall", points: 1 },
  { id: "f3", category: "food", icon: "🌙", title: "Ate biryani at midnight", points: 1 },
  { id: "f4", category: "food", icon: "☕", title: "Had cha at a roadside tea stall", points: 1 },
  { id: "f5", category: "food", icon: "🌧️", title: "Ate street food while it was raining", points: 1 },
  { id: "f6", category: "food", icon: "🍚", title: "Had bhorta with rice and zero regrets", points: 1 },
  { id: "f7", category: "food", icon: "🥘", title: "Ate at a proper mezban", points: 2 },
  { id: "f8", category: "food", icon: "💍", title: "Survived a massive Bangladeshi wedding feast", points: 1 },
  { id: "f9", category: "food", icon: "🐟", title: "Ate hilsa during monsoon season", points: 2 },
  { id: "f10", category: "food", icon: "🫖", title: "Tried the seven-layer tea in Sreemangal", points: 3 },

  // ADVENTURE
  { id: "a1", category: "adventure", icon: "🚤", title: "Went on a boat trip", points: 1 },
  { id: "a2", category: "adventure", icon: "🌄", title: "Watched the sunrise at a beach", points: 2 },
  { id: "a3", category: "adventure", icon: "🌇", title: "Watched the sunset by a river", points: 1 },
  { id: "a4", category: "adventure", icon: "🥾", title: "Hiked up a hill", points: 2 },
  { id: "a5", category: "adventure", icon: "⛺", title: "Camped outdoors", points: 3 },
  { id: "a6", category: "adventure", icon: "🚗", title: "Went on a spontaneous road trip", points: 2 },
  { id: "a7", category: "adventure", icon: "🌌", title: "Saw a sky full of stars from a village", points: 2 },
  { id: "a8", category: "adventure", icon: "🏊", title: "Jumped into a pond or river", points: 1 },
  { id: "a9", category: "adventure", icon: "🚌", title: "Hung on at the door of a packed bus", points: 2 },
  { id: "a10", category: "adventure", icon: "🏍️", title: "Rode a motorbike through the countryside", points: 2 },
  { id: "a11", category: "adventure", icon: "💦", title: "Chased a waterfall in the hills", points: 3 },

  // CITY LIFE
  { id: "c1", category: "city", icon: "🚦", title: "Survived Dhaka traffic for 2+ hours", points: 1 },
  { id: "c2", category: "city", icon: "🛺", title: "Bargained over a CNG fare", points: 1 },
  { id: "c3", category: "city", icon: "☔", title: "Rode a rickshaw in heavy rain", points: 1 },
  { id: "c4", category: "city", icon: "🌆", title: "Ate at a Dhaka rooftop restaurant", points: 2 },
  { id: "c5", category: "city", icon: "🌃", title: "Stayed out late just for food", points: 1 },
  { id: "c6", category: "city", icon: "☕", title: "Went café hopping", points: 1 },
  { id: "c7", category: "city", icon: "🛍️", title: "Got lost in Bashundhara City", points: 1 },
  { id: "c8", category: "city", icon: "🎡", title: "Spent a whole day at Jamuna Future Park", points: 1 },
  { id: "c9", category: "city", icon: "🚇", title: "Rode the Dhaka Metro Rail", points: 2 },
  { id: "c10", category: "city", icon: "🧭", title: "Got lost in the lanes of Old Dhaka", points: 2 },
  { id: "c11", category: "city", icon: "📱", title: "Rode a bike-ride through a gap that shouldn't exist", points: 2 },

  // CULTURE
  { id: "u1", category: "culture", icon: "💐", title: "Attended a Bangladeshi wedding", points: 1 },
  { id: "u2", category: "culture", icon: "🎊", title: "Celebrated Pohela Boishakh", points: 1 },
  { id: "u3", category: "culture", icon: "🏡", title: "Went to the village for Eid", points: 2 },
  { id: "u4", category: "culture", icon: "🎠", title: "Wandered through a local mela", points: 2 },
  { id: "u5", category: "culture", icon: "🏏", title: "Watched a cricket match with a roaring crowd", points: 2 },
  { id: "u6", category: "culture", icon: "👨‍👩‍👧‍👦", title: "Sat at a family gathering with 50+ relatives", points: 2 },
  { id: "u7", category: "culture", icon: "🏰", title: "Visited Lalbagh Fort or Ahsan Manzil", points: 1 },
  { id: "u8", category: "culture", icon: "🌹", title: "Went to the Shaheed Minar on 21 February", points: 2 },
  { id: "u9", category: "culture", icon: "🐄", title: "Visited a cattle haat before Eid", points: 2 },
  { id: "u10", category: "culture", icon: "🌙", title: "Joined an iftar rush at Chawkbazar", points: 3 },
  { id: "u11", category: "culture", icon: "🪁", title: "Flew a ghuri (kite) from a rooftop", points: 2 },

  // EVERYDAY BANGLADESH
  { id: "e1", category: "everyday", icon: "🏠", title: "Said \"আসতেছি\" while still at home", points: 1 },
  { id: "e2", category: "everyday", icon: "💬", title: "Had relatives ask when you're getting married", points: 1 },
  { id: "e3", category: "everyday", icon: "🔌", title: "Had a power cut at the worst possible moment", points: 1 },
  { id: "e4", category: "everyday", icon: "🛍️", title: "Used a plastic bag as an umbrella", points: 1 },
  { id: "e5", category: "everyday", icon: "🌦️", title: "Got caught in sudden rain with no plan", points: 1 },
  { id: "e6", category: "everyday", icon: "🏏", title: "Argued about cricket like it was personal", points: 1 },
  { id: "e7", category: "everyday", icon: "🫖", title: "Discussed life over tea for an unnecessarily long time", points: 1 },
  { id: "e8", category: "everyday", icon: "🍽️", title: "Got asked \"খাইসো?\" by someone who wanted you to eat more", points: 1 },
  { id: "e9", category: "everyday", icon: "🪑", title: "Fought for a seat on a crowded bus", points: 1 },
  { id: "e10", category: "everyday", icon: "👵", title: "Had an aunty compare your life to a cousin's", points: 1 },
];
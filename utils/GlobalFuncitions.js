import opencage from "opencage-api-client";
import Constants from "expo-constants";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export const addressToCords = async (address) => {
  try {
    const res = await opencage.geocode({
      q: address,
      key: Constants.manifest.extra.opencageApiKey,
      no_annotations: 1,
    });
    return res.results[0].geometry;
  } catch (error) {
    console.error(error.toString());
  }
};

export const getFromCol = async (col_name, set_fun) => {
  const col = collection(db, col_name);
  const cards_col = await getDocs(col);
  set_fun(
    cards_col.docs.map((doc) => {
      let id = doc.id;
      let data = doc.data();
      return { id, ...data };
    })
  );
};

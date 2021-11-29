import opencage from "opencage-api-client";
import Constants from "expo-constants";

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

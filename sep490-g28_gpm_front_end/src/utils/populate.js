import { FIREBASE_FILE_URL } from "../config";
import noImage from "../assets/images/no-image.png";
import defaultImage from "../assets/images/sucmanh2000.png"

export const convertFireBaseImage = (path) => {
  if (path) {
    const pathURL = encodeURIComponent(path);
    return FIREBASE_FILE_URL + pathURL + "?alt=media";
  }
  return null;
};

export const convertFireBaseFile = (path) => {
  const pathURL = encodeURIComponent(path);
  return FIREBASE_FILE_URL + pathURL + "?alt=media";
};

export const convertImage = (path) => {
  if (!path) return defaultImage;
  const pathURL = encodeURIComponent(path);
  return FIREBASE_FILE_URL + pathURL + "?alt=media";
};

export const getProjectId = (projectCode) => {
  const regex = /da(\d+)-/;
  const match = projectCode?.match(regex);
  if (match) {
    return match[1];
  }
  return null;
}

export const getNewsId = (slug) => {
  const regex = /^(\d+)-/;
  const match = slug?.match(regex);
  if (match) {
    return match[1];
  }
  return null;
}

export const getCampaignId = (slug) => {
  const regex = /^(\d+)-/;
  const match = slug?.match(regex);
  if (match) {
    return match[1];
  }
  return null;
}

export const getChallengeId = (slug) => {
  const regex = /tt(\d+)-/;
  const match = slug?.match(regex);
  if (match) {
    return Number(match[1]);
  }
  return null;
}


export const animateNumber = (
  finalNumber,
  delay,
  callback,
  startNumber = 0
) => {
  let currentNumber = startNumber;
  const interval = window.setInterval(updateNumber, delay);
  function updateNumber() {
    if (currentNumber >= finalNumber) {
      clearInterval(interval);
    } else {
      currentNumber++;
    }
    callback(currentNumber);
  }
};

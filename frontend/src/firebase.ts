import { initializeApp } from 'firebase/app';
import {
  uploadBytes, ref, getStorage, getDownloadURL, deleteObject, listAll,
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export const uploadImage = async (heroNickName: string, image: File) => {
  const imageRef = ref(storage, `${heroNickName}/${image.name}`);

  await uploadBytes(imageRef, image);
};

export const getAllImagesURLs = async (imagesPaths: string[]) => {
  const urls = await Promise.all(imagesPaths.map(async imagePath => {
    const imageRef = ref(storage, imagePath);
    const url = await getDownloadURL(imageRef);

    return [imagePath, url];
  }));

  return urls;
};

export const deleteImage = async (imagePath: string) => {
  const desertRef = ref(storage, imagePath);

  try {
    await deleteObject(desertRef);
  } catch (e: any) {
    throw new Error(`Can\`t delete image ${e.message}`);
  }
};

export const getAllPathsFromDirectory = async (directory: string) => {
  const directoryRef = ref(storage, `${directory}/`);

  const result = await listAll(directoryRef);
  const paths = result.items.map(item => item.fullPath);

  return paths;
};

export const deleteDirectory = async (directory: string) => {
  const directoryRef = ref(storage, `${directory}/`);

  try {
    const result = await listAll(directoryRef);

    await Promise.all(result.items.map(item => deleteObject(item)
      .catch(error => {
        throw new Error(`Can't delete photo. Error:${error.message}`);
      })));
  } catch (e: any) {
    throw new Error(`Can't delete images folder: ${e.message}`);
  }
};

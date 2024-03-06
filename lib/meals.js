// import fsp from "node:fs/promises";
// import fs from "node:fs";
import xss from "xss";
import slugify from "slugify";

import {
  addDoc,
  query,
  getDocs,
  collection,
  where,
} from "firebase/firestore/lite";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

// const readFileData = async () => {
//   const filedata = await fsp.readFile("./db.json", "utf-8");
//   const data = JSON.parse(filedata);
//   return data;
// };

// const writeFileData = async (meals) => {
//   const updatedData = JSON.stringify(meals, null, 4);
//   await fsp.writeFile("./db.json", updatedData);
//   console.log("Data saved successfully.");
// };

export async function getMeals() {
  const ref = collection(db, "recipes");
  const snapshot = await getDocs(ref);
  if (snapshot.size === 0) return [];
  const meals = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return meals;
}

export async function getMeal(slug) {
  const ref = collection(db, "recipes");
  const queryRef = query(ref, where("slug", "==", slug));
  const snapshot = await getDocs(queryRef);
  if (snapshot.size !== 1) {
    throw new Error("Could not find correct meal data");
  }
  const meal = snapshot.docs[0];
  return { id: meal.id, ...meal.data() };
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);
  const ext = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${ext}`;
  const uploadPath = `/images/${fileName}`;

  const uploadedImageRef = ref(storage, uploadPath);
  await uploadBytes(uploadedImageRef, meal.image);
  meal.image = await getDownloadURL(uploadedImageRef);

  const collectionRef = collection(db, "recipes");
  const mealData = await addDoc(collectionRef, meal);
  console.log("Data saved", mealData.id);
}

/*
Local data code

meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);
  const ext = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${ext}`;
  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();
  stream.write(Buffer.from(bufferedImage), (err) => {
    if (err) {
      throw new Error("Saving image failed!");
    }
  });
  const actualImage = meal.image;
  meal.image = `/images/${fileName}`;

  const meals = await readFileData();
  const updatedMeals = [...meals, meal];
  await writeFileData(updatedMeals);

*/

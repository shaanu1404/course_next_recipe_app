import { Suspense } from "react";
import Link from "next/link";
import classes from "./page.module.css";
import MealsGrid from "@/components/meals/meals-grid";
import { getMeals } from "@/lib/meals";
import Loading from "@/components/loading/loading";

export const metadata = {
  title: "All meals",
  description: "Browse the delicious meal shared by our vibrant community.",
};

async function Meals() {
  const meals = await getMeals();

  if (meals.length === 0) {
    return <p className={classes["not-available"]}>Recipes not available!</p>;
  }

  return <MealsGrid meals={meals} />;
}

const MealsPage = async () => {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious meal, created{" "}
          <span className={classes.highlight}>by you</span>
        </h1>
        <p>
          Choose your favorite recipe and cook it yourself. It&apos;s easy and
          fun!
        </p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share your Favorite Recipe</Link>
        </p>
      </header>
      <main className={classes.main}>
        <Suspense fallback={<Loading>Fetching meals...</Loading>}>
          <Meals />
        </Suspense>
      </main>
    </>
  );
};

export default MealsPage;

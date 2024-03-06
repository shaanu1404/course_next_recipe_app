import classes from "./loading.module.css";

export default function Loading({ children }) {
  return <p className={classes.loading}>{children}</p>;
}

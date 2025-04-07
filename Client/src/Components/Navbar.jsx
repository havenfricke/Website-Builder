import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { AppState } from "../AppState";

// A helper function to create URL-friendly slugs from page titles
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
};


export const Navbar = observer(() => {
  const pages = AppState.pages;

  return (
    <nav id="nav">
      {pages.map((page) => {
        // Set the path: Home should be the root path ("/"), others use the slugified title
        const path = page.title.toLowerCase() === "home" ? "/" : `/${slugify(page.title)}`;

        return (
          <Link key={page.id} to={path}>
            <div>{page.title}</div>
          </Link>
        );
      })}
    </nav>
  );
});

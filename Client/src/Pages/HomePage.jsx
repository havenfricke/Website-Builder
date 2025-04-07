import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { pageService } from "../Services/PageService";
import { pageImageService } from "../Services/PageImageService";
import { AppState } from "../AppState";

function HomePage() {
  useEffect(() => {
    pageService.getAllPages();
  }, []);

  // Find the page titled "Home" (case insensitive)
  const homePage = AppState.pages.find(
    page => page.title.toLowerCase() === "home"
  );

  if(homePage)
  {
    pageImageService.getAllPageImages(homePage.id);
  }
  

  return (
    <section className="home-page">
      {homePage ? (
        <div dangerouslySetInnerHTML={{ __html: homePage.content }} />
      ) : (
        null
      )}
    </section>
  );
}

export default observer(HomePage);

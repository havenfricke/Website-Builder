import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { AppState } from "../AppState";
import { pageService } from "../Services/PageService";
import { pageImageService } from '../Services/PageImageService';

// Optional slugify function to convert page titles to URL-friendly slugs
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

function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);

  // Fetch pages if they haven't been loaded yet
  useEffect(() => {
    if (AppState.pages.length === 0) {
      pageService.getAllPages();
    }
  }, []);

  // Once pages are loaded, search for the page matching the slug
  useEffect(() => {
    if (AppState.pages.length > 0) {
      const matchedPage = AppState.pages.find(p => slugify(p.title) === slug);
      setPage(matchedPage);
      pageImageService.getAllPageImages(matchedPage.id);
    }
  }, [AppState.pages, slug]);

  if (!page) {
    return null;
  }

  return (
    <section className="dynamic-page">
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </section>
  );
}

export default observer(DynamicPage);

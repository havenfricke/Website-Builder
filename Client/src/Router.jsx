import { App } from './App.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from './Pages/HomePage.jsx';
import DynamicPage from './Pages/DynamicPage.jsx';

export const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/", 
          element: <HomePage />
        },
        {
          path: "/:slug", 
          element: <DynamicPage />
        }
      ],
    },
  ]);
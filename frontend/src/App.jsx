// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Spots from './components/Spots';
import CreateSpotForm from './components/Spots/CreateSpotForm';
import SignupFormPage from './components/SignupFormModal';
import Navigation from './components/Navigation';

import * as sessionActions from './store/session';
import SpotDetails from './components/Spots/SpotDetails';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Spots />
      },
      {
        path: "signup",
        element: <SignupFormPage />
      },
      {
        path: "spots/:spotId",
        element: <SpotDetails/>
      },
      {
        path: "spots/new",
        element: <CreateSpotForm/>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
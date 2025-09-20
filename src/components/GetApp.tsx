import React from 'react';
import PlayStore from '../assets/icons/play-store.svg';
import AppStore from '../assets/icons/app-store.svg';
import Link from '@docusaurus/Link';

export const GetApp = () => {
  return (
    <div className="get-app">
      <div className="get-app__info">
        <p className="get-app__title">Get the App</p>
        <p className="get-app__subtitle">Android & iOS</p>
      </div>
      <div className="get-app__links">
        <Link to="https://tinyurl.com/y62lftzl" target="_blank">
          <PlayStore />
        </Link>
        <Link to="https://apple.co/2Y0DdLx" target="_blank">
          <AppStore />
        </Link>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Fab, Zoom } from '@material-ui/core';

import { clickInstall } from '../../state/actions';
import { useStateValue } from '../../state';

const InstallButton = () => {
  const {
    state: { isInstallable },
    dispatch,
  } = useStateValue();
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [promptEvent, setPromptEvent] = useState(null);

  useEffect(
    function () {
      window.addEventListener('load', () => {
        (navigator.standalone ||
          matchMedia('(display-mode: standalone)').matches) &&
          setIsAppInstalled(true);
      });

      window.addEventListener('beforeinstallprompt', event => {
        event.preventDefault();
        setPromptEvent(event);
      });

      window.addEventListener('appInstalled', () => {
        dispatch(clickInstall());
      });
    },
    [isAppInstalled, dispatch]
  );

  const handleOnClick = async () => {
    setIsAppInstalled(true);
    promptEvent.prompt();

    const userChoice = await promptEvent.userChoice;

    if (userChoice.outcome === 'accepted') {
      dispatch(clickInstall());
    } else {
      setIsAppInstalled(false);
    }
  };

  return (
    <>
      {!isAppInstalled && !!promptEvent && (
        <Zoom
          in={isInstallable}
          timeout={1000}
          style={{
            transitionDelay: `1000ms`,
            position: 'fixed',
            left: 0,
            bottom: 0,
            margin: '15px',
          }}>
          <Fab
            color="primary"
            variant="extended"
            size="medium"
            onClick={handleOnClick}>
            Install App
          </Fab>
        </Zoom>
      )}
    </>
  );
};

export default InstallButton;

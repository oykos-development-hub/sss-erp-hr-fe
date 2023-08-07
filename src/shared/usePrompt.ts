import {useCallback, useEffect} from 'react';

function useConfirmExit(confirmExit: () => boolean, when = true) {
  useEffect(() => {
    if (!when) {
      return;
    }

    const originalPushState = window.history.pushState;

    window.history.pushState = function (state: any, title: string, url?: string | null) {
      const result = confirmExit();
      if (result !== false) {
        originalPushState.apply(window.history, [state, title, url]);
      }
    };

    return () => {
      window.history.pushState = originalPushState;
    };
  }, [confirmExit, when]);
}

export function usePrompt(message: string, when = true) {
  useEffect(() => {
    if (when) {
      window.onbeforeunload = function () {
        return message;
      };
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, [message, when]);

  const confirmExit = useCallback(() => {
    const confirm = window.confirm(message);
    return confirm;
  }, [message]);
  useConfirmExit(confirmExit, when);
}

import { useState } from 'react';

const useCandidate = () => {
  const [isShowing, setIsShowing] = useState(false);

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  function toggle() {
    setIsShowing(!isShowing);
    removeBodyCss();
  }

  return {
    isShowing,
    toggle,
  }
};

export default useCandidate;
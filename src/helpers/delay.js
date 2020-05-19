const delay = (delayRef, milliseconds) => {
  if (delay.current) {
    return;
  }
  return new Promise(
    (resolve) =>
      (delayRef.current = setTimeout(() => {
        delay.current = null;
        resolve();
      }, milliseconds))
  );
};
export default delay;

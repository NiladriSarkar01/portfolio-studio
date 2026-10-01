export const refreshPortfolio = () => {
  window.setTimeout(() => {
    window.location.reload();
  }, 3000);

  return {
    output: "Refreshing the portfolio in 3 seconds.",
  };
};

export const leavePortfolio = () => {
  window.setTimeout(() => {
    window.history.back();
  }, 2000);

  return {
    output: "Returning to the previous page in 2 seconds.",
  };
};

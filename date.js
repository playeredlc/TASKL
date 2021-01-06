exports.getDate = () => {
  const today = new Date();
  const options = {
    month: "long",
    day: "numeric",
    weekday: "short",
  };
  return today.toLocaleDateString("en-US", options);
};
exports.getDay = () => {
  const today = new Date();
  const options = {
    weekday: "short",
  };
  return today.toLocaleDateString("en-US", options);
};
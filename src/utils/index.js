function handleNotFoundError(message, res) {
  const error = new Error(message);

  return res.status(404).json({
    msg: error.message,
  });
}

const uniqueId = () => Date.now().toString(32) + Math.random().toString(32).substring(2);

export { handleNotFoundError, uniqueId };

// Database and port
dbconfig()
  .then(() => {
    app.on("error", (err) => {
      console.log(`Error while listening on port: ${process.env.PORT}`, err);
      throw err;
    });

    app.listen(process.env.PORT || 5003, () => {
      console.log(`The server is listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error connecting to database`, err);
    throw err;
  });
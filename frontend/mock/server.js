// mock/server.js
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("mock/db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom login route
server.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = router.db.get("users").find({ email, password }).value();

  if (user) {
    res.json({ token: user.token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Dashboard route
server.get("/api/dashboard", (req, res) => {
  const data = router.db.get("dashboard").value();
  res.json(data);
});

server.use("/api", router);
server.listen(4000, () => {
  console.log("Mock API running at http://localhost:4000");
});

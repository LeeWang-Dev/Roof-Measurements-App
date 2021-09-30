import userService from "../services/userService";

class UserRoute {
  constructor(router) {
    this.router = router;
  }
  registerRouters() {
    this.router.post("/user/register", this.addUser.bind(this));
  }

  //Add user
  addUser(req, res, next) {
    const data = req.body;
    userService
      .addUser(data)
      .then((result) => {
        res.rend(result);
      })
      .catch(next);
  }
}

export default UserRoute;

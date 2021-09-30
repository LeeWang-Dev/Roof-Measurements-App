import shareService from "../services/shareService";

class ShareRoute {
  constructor(router) {
    this.router = router;
    this.registerRouter();
  }

  registerRouter() {
    this.router.get("/measurement/share/get", this.getShared.bind(this));
    this.router.post(
      "/measurement/share/addUpdate",
      this.addUpdateShared.bind(this)
    );
    this.router.delete(
      "/measurement/share/delete",
      this.deleteShared.bind(this)
    );
  }

  //Get shared
  getShared(req, res, next) {
    const auth = req.headers.authorization;
    const id = req.query.id;
    shareService
      .getShared(auth, id)
      .then((result) => {
        res.send(result);
      })
      .catch(next);
  }
  //Add and update shared
  addUpdateShared(req, res, next) {
    const auth = req.headers.authorization;
    const data = req.body;
    shareService
      .addUpdateShared(auth, data)
      .then((result) => {
        res.send(result);
      })
      .catch(next);
  }
  //Delete shared
  deleteShared(req, res, next) {
    const auth = req.headers.authorization;
    const id = req.query.id;

    shareService
      .deleteShared(auth, id)
      .then((result) => {
        res.send(result);
      })
      .catch(next);
  }
}

export default ShareRoute;

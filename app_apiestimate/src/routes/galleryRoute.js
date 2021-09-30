import GalleryService from "../services/galleryService";

class GalleryRoute {
  constructor(router) {
    this.router = router;
    this.registerRouter();
  }
  registerRouter() {
    this.router.get("/image/get", this.getImage.bind(this));
    this.router.get("/image/count/get", this.getCommentCount.bind(this));
  }
  //Get images
  getImage(req, res, next) {
    const auth = req.headers.authorization;
    const id = req.query.id;
    GalleryService.getImages(auth, id)
      .then((result) => {
        res.send(result);
      })
      .catch(next);
  }
  getCommentCount(req, res, next) {
    const auth = req.headers.authorization;
    const id = req.query.id;
    GalleryService.getCommentCount(auth, id)
      .then((result) => {
        res.send(result);
      })
      .catch(next);
  }
}

export default GalleryRoute;

import CommentService from "../services/commentService";

class CommentRoute {
  constructor(router) {
    this.router = router;
    this.registerRouter();
  }
  registerRouter() {
    this.router.get("/image/comment/get", this.getComment.bind(this));
    this.router.post("/image/comment/add", this.addComment.bind(this));
    this.router.delete("/image/comment/delete", this.deleteComment.bind(this));
  }
  //Get comments
  getComment(req, res, next) {
    const auth = req.headers.authorization;
    const id = req.query.id;

    CommentService.getComments(auth, id)
      .then((result) => {
        res.send(result);
      })
      .catch(next);
  }
  //Add comment
  addComment(req, res, next) {
    const auth = req.headers.authorization;
    const data = req.body;

    CommentService.addComment(auth, data)
      .then((result) => {
        res.send(result);
      })
      .catch(next);
  }
  //Delete comment
  deleteComment(req, res, next) {
    const auth = req.headers.authorization;
    const id = req.query.id;

    CommentService.deleteComment(auth, id)
      .then((result) => {
        res.send(result);
      })
      .catch(next);
  }
}

export default CommentRoute;

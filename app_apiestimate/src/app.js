import express from "express";
import CommentRoute from "./routes/commentRoute";
import GalleryRoute from "./routes/galleryRoute";
import ShareRoute from "./routes/shareRoute";
import UserRoute from "./routes/userRoute";

const apiRouter = express.Router();

new CommentRoute(apiRouter);
new GalleryRoute(apiRouter);
new ShareRoute(apiRouter);
new UserRoute(apiRouter);

export default apiRouter;

import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Grid,
  Dialog,
  Fab,
  Avatar,
  Divider,
  InputBase,
  ListItemAvatar,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { Comment, Send, Close } from "@material-ui/icons";
import ListComponent from "./component/ListComponent";
//Add Service
import { getImages, getCommentCount, addComment } from "../../services/images";
import { BASE_URL } from "../../utils/constants";

const styles = (theme) => ({
  container: {
    position: "absolute",
    display: "flex",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    padding: 20,
    boxSizing: "border-box",
    zIndex: 100,
    backgroundColor: "#fff",
    overflowX: "hidden",
    overflowY: "auto",
  },
  commentContainer: {
    width: "100%",
    height: "77%",
  },
  root: {
    width: "100%",
    height: 400,
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  title: {
    padding: "24px 0",
    fontSize: 24,
    fontWeight: 500,
    fontStyle: "normal",
    color: "#171d29",
  },
  imageList: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  dialog: {
    "& .MuiBackdrop-root": {
      backgroundColor: "#171d29e6",
    },
    "& .MuiDialog-paperWidthSm": {
      maxWidth: 920,
    },
    "& .MuiDialog-paper": {
      width: 920,
    },
    "& .MuiDialogTitle-root": {
      padding: 15,
      borderBottom: "1px solid #76778633",
      fontSize: 20,
      fontWeight: 500,
      fontStyle: "normal",
      color: "#171d29",
    },
    "& .MuiDialogContent-root": {
      padding: "24px 32px",
    },
    [theme.breakpoints.down("xs")]: {
      "& .MuiDialog-paperWidthSm": {
        width: "100%",
      },
      "& .MuiDialogContent-root": {
        padding: 20,
      },
    },
  },
  margin: {
    margin: theme.spacing(1),
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
});

function Gallery(props) {
  const { classes, projectId } = props;
  const [user, setUser] = useState({
    name: "",
    email: "",
    img: "",
  });
  const [colsGallery, setColsGallery] = useState(3);
  const [rowsHeight, setRowsHeight] = useState(200);
  const [initState, setInitState] = useState(true);
  const [idImage, setIdImage] = useState(0);
  const [open, setOpen] = useState(false);
  const [sizeImage, setSizeImage] = useState(500);
  const [images, setImages] = useState([]);
  const [imgOpen, setImgOpen] = useState("");
  const [commentText, setCommentText] = useState("");
  const [newComment, setNewComment] = useState(null);

  const updateWidthAndHeight = () => {
    const width = window.innerWidth;
    if (width < 500) {
      setColsGallery(1);
      setRowsHeight(200);
      setSizeImage(400);
    } else if (width < 900) {
      setColsGallery(2);
      setRowsHeight(200);
      setSizeImage(400);
    } else if (width < 1300) {
      setColsGallery(3);
      setRowsHeight(250);
      setSizeImage(550);
    } else {
      setColsGallery(4);
      setRowsHeight(300);
      setSizeImage(610);
    }
  };
  const getUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  };
  const initImages = async () => {
    setInitState(false);
    const response = await getImages(projectId);
    if (response.status === "success") {
      setImages(response.images);
    } else {
      setImages([]);
    }
  };

  const getCount = async (index, id) => {
    const response = await getCommentCount(id);

    if (response.status === "success") {
      updateImage(index, response.count);
    }
  };

  const updateImage = (index, count) => {
    let temp_state = [...images];
    let temp_element = { ...temp_state[index] };
    temp_element.count = count;
    temp_state[index] = temp_element;

    setImages(temp_state);
  };

  const handleClickOpen = (index, value) => {
    setOpen(true);
    setImgOpen(value.img);
    setIdImage(index);
    getCount(index, value.img);
  };

  const handleClose = () => {
    setOpen(false);
    getCount(idImage, imgOpen);
  };

  const handleAdd = async () => {
    const date = new Date();

    const data = {
      date: date,
      imageId: imgOpen,
      userEmail: user.email,
      commentText: commentText,
    };
    const response = await addComment(data);
    if (response.status === "success") {
      setCommentText("");
      const addData = {
        date: date,
        img: user.img,
        name: user.name,
        text: commentText,
      };

      setNewComment(addData);
      console.log("Comment added");
      setNewComment(null);
    } else {
      console.log(response);
      console.log("Error add comment");
    }
  };

  useEffect(() => {
    updateWidthAndHeight();
    if (initState) {
      getUser();
      initImages();
    }

    window.addEventListener("resize", updateWidthAndHeight);
    return () => window.removeEventListener("resize", updateWidthAndHeight);
  });

  let contentComment = (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <img
        src={BASE_URL + "/images/" + projectId + "/" + imgOpen}
        alt="img"
        width={sizeImage}
        height={sizeImage - 35}
      />
      <Grid item xs>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar
              alt={user.name}
              src={BASE_URL + "/profilesImages/" + user.photo}
            />
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary="Internal Drains 1" />
          <IconButton aria-label="close" color="default" onClick={handleClose}>
            <Close />
          </IconButton>
        </ListItem>
        <Divider
          style={{
            background: "#B4B4B4",
            height: 1,
            opacity: 0.7,
          }}
        />
        <div
          className="scroller"
          style={{
            height: sizeImage - 170,
          }}
        >
          <ListComponent
            key="list-comments"
            imageId={imgOpen}
            newComment={newComment}
          />
        </div>
        <Divider
          style={{
            background: "#B4B4B4",
            height: 1,
            opacity: 0.7,
          }}
        />

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <InputBase
            className={classes.input}
            placeholder="Add comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            multiline
          />
          <Fab
            size="medium"
            color="primary"
            aria-label="add"
            onClick={handleAdd}
            className={classes.margin}
          >
            <Send />
          </Fab>
        </Grid>
      </Grid>
    </Grid>
  );

  return (
      <Grid container className={classes.container}>
        <div className={classes.title}>Photo library</div>
        {images.length > 0 ? (
          <ImageList
            rowHeight={rowsHeight}
            cols={colsGallery}
            className={classes.imageList}
          >
            {images.map((item, index) => (
              <ImageListItem
                key={item.img}
                className="imageItem"
                onClick={() => handleClickOpen(index, item)}
              >
                <img
                  src={BASE_URL + "/images/" + projectId + "/" + item.img}
                  alt={item.title}
                  className="image"
                />
                {item.count > 0 ? (
                  <ImageListItemBar
                    actionIcon={
                      <div>
                        <IconButton aria-label="comments">
                          <Comment style={{ color: "white" }} />
                        </IconButton>
                        <label className="comment">{item.count} comments</label>
                      </div>
                    }
                  />
                ) : (
                  ""
                )}
              </ImageListItem>
            ))}
          </ImageList>
        ) : (
          ""
        )}
        <Dialog
          open={open}
          onClose={handleClose}
          className={classes.dialog}
          aria-labelledby="form-dialog-title"
        >
          {contentComment}
        </Dialog>
      </Grid>
  );
}

export default withStyles(styles)(Gallery);

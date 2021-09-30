import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import ReactTimeAgo from "react-time-ago";

import { BASE_URL } from "../../../utils/constants";
//Service
import { getComments } from "../../../services/images";

const styles = (theme) => ({
  root: {
    width: "100%",
    maxWidth: "36ch",
    height: "60%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
});

function ListComponent(props) {
  const { classes, imageId, newComment } = props;
  const [comments, setComments] = useState([]);
  const [initState, setInitState] = useState(true);
  const [locale, setLocale] = useState("en-US");

  const handleComments = async () => {
    setInitState(false);
    const response = await getComments(imageId);
    if (response.status === "success") {
      setComments(response.comments);
    } else {
      setComments([]);
    }
  };

  const getLanguage = () => {
    let result = "en-US";

    result =
      navigator.userLanguage ||
      (navigator.languages &&
        navigator.languages.length &&
        navigator.languages[0]) ||
      navigator.language ||
      navigator.browserLanguage ||
      navigator.systemLanguage ||
      "en";

    setLocale(result);
  };

  const commentAdded = () => {
    if (newComment != null) {
      const data = comments.concat(newComment);
      setComments(data);
      console.log(newComment);
    } else {
      console.log(newComment);
    }
  };

  useEffect(() => {
    if (initState) {
      handleComments();
      getLanguage();
    }
    commentAdded();
  });

  return (
    <div
      style={{
        paddingTop: 5,
      }}
    >
      {comments.length > 0 ? (
        <List className={classes.root}>
          {comments.map((item, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt={item.name}
                  src={
                    item.img !== "" || item.img !== null
                      ? BASE_URL + "/images/profile/" + item.img
                      : ""
                  }
                />
              </ListItemAvatar>

              <div className="comment-card">
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  style={{
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  {item.name}
                </Typography>
                <div
                  style={{
                    marginTop: -5,
                    marginBottom: 7,
                    color: "#9A9A9A",
                  }}
                >
                  <ReactTimeAgo
                    date={new Date(item.date)}
                    locale={locale}
                    timeStyle="round"
                  />
                </div>
                <Typography
                  component="label"
                  variant="body2"
                  style={{
                    color: "black",
                  }}
                >
                  {item.text}
                </Typography>
              </div>
            </ListItem>
          ))}
        </List>
      ) : (
        ""
      )}
    </div>
  );
}

export default withStyles(styles)(ListComponent);

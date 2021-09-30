import React from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@material-ui/core";

const DetailComponent = (userName, avatar, date, description, email) => (
  <ListItem alignItems="flex-start" style={{ color: "black" }}>
    <ListItemAvatar>
      <Avatar alt="avatar" src={avatar} />
    </ListItemAvatar>
    <ListItemText
      title={"username"}
      secondary={
        <div>
          {"date"}
          <Typography component="span" variant="body2" color="textPrimary">
            {description}
          </Typography>
        </div>
      }
    />
  </ListItem>
);

export default DetailComponent;

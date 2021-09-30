import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Pagination from "@material-ui/lab/Pagination";

import {
  List,
  ListItem,
  DialogActions,
  Avatar,
  CircularProgress,
  Fab,
  FormControl,
  Select,
  ListItemText,
  Snackbar,
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";

// import material ui dialog
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
// import material ui icon components
import { Add } from "@material-ui/icons";
import IconLink from "@material-ui/icons/Link";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import ViewHeadlineIcon from "@material-ui/icons/ViewHeadline";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MapIcon from "@material-ui/icons/Map";

import axios from "axios";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import ReactTimeAgo from "react-time-ago";

import BootstrapTooltip from "./customs/BootstrapToolTip";
import InchesFormat from "./customs/InchesFormat";
import {
  BASE_URL,
  google,
  rowsPerPage,
  roofAccessItems,
  projectTypes,
  selectMenuProps,
} from "../utils/constants";

import { removeToken } from "../redux/actions/token";

import imgLogo from "../assets/images/Logotipe.png";

//Service
import { addShared, getShared, deleteShared } from "../services/shared";

const styles = (theme) => ({
  container: {
    width: "100vw",
    height: "100vh",
    padding: 0,
    boxSizing: "border-box",
    overflowX: "hidden",
    overflowY: "auto",
  },
  header: {
    height: 56,
    padding: "8px 24px",
    color: "#fff",
    fontStyle: "normal",
    backgroundColor: "#5c77ff",
  },
  logo: {
    width: 100,
    height: 32,
    marginRight: 30,
  },
  search: {
    position: "relative",
    width: "100%",
    maxWidth: 550,
  },
  searchIcon: {
    position: "absolute",
    display: "flex",
    marginLeft: 19,
    height: "100%",
    alignItems: "center",
    color: "#fff",
    pointerEvents: "none",
    zIndex: 100,
    [theme.breakpoints.down("xs")]: {
      color: "#767786",
    },
  },
  inputRoot: {
    width: "100%",
    color: "inherit",
  },
  inputInput: {
    width: "100%",
    height: 40,
    padding: 0,
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    paddingRight: 19,
    border: "1px solid #7f99ff",
    borderRadius: 20,
    backgroundColor: "#7893ff",
    "&:focus": {
      //border:'1px solid #7f99ff'
    },
    [theme.breakpoints.down("xs")]: {
      border: "1px solid #767786",
      backgroundColor: "#fff",
    },
  },
  accountBox: {
    display: "flex",
    alignItems: "center",
    fontSize: 12,
    color: "#fff",
    cursor: "pointer",
  },
  content: {
    padding: "16px 24px",
  },
  createButton: {
    width: 244,
    height: 40,
    marginRight: 10,
    borderRadius: 16,
    border: "none",
    "& .MuiButton-label": {
      fontFamily: "Roboto",
      fontSize: 18,
      color: "white",
      fontWeight: 400,
      textAlign: "center",
      fontStyle: "normal",
    },
    "&:hover": {
      //backgroundColor: '#ebebeb'
    },
    "&:hover .MuiButton-label": {
      //color:'#8c8c8c',
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginRight: 0,
    },
  },
  projectBox: {
    border: "1px solid #767786",
    borderRadius: 8,
    maxWidth: 330,
    userSelect: "none",
    "& .MuiAvatar-root": {
      width: "100%",
      height: 200,
      borderRadius: 0,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    "& .MuiAvatar-img": {
      "-webkit-transition": "all .5s ease",
      "-moz-transition": "all .5s ease",
      "-ms-transition": "all .5s ease",
      transition: "all .5s ease",
      filter: "brightness(100%)",
    },
    "& .MuiAvatar-img:hover": {
      cursor: "pointer",
      transform: "scale(1.1)",
      "-webkit-transform": "scale(1.1)",
      "-moz-transform": "scale(1.1)",
      "-ms-transform": "scale(1.1)",
      filter: "brightness(110%)",
    },
  },
  projectList: {
    marginBottom: 40,
    userSelect: "none",
    "& .MuiListItem-root:hover": {
      borderRadius: 8,
      textDecoration: "none",
      backgroundColor: "#f1f1f3",
    },
    "& .MuiAvatar-root": {
      width: 48,
      height: 48,
      borderRadius: 8,
      cursor: "pointer",
      "-webkit-transition": "all .5s ease",
      "-moz-transition": "all .5s ease",
      "-ms-transition": "all .5s ease",
      transition: "all .5s ease",
    },
    "& .MuiAvatar-root:hover": {
      zIndex: 100,
      transform: "scale(1.2)",
      "-webkit-transform": "scale(1.2)",
      "-moz-transform": "scale(1.2)",
      "-ms-transform": "scale(1.2)",
    },
  },
  listHeader: {
    padding: "16px 20px",
    color: "#767786",
    fontSize: 14,
    fontWeight: 500,
    fontStryle: "normal",
    "& .MuiSvgIcon-root": {
      width: 18,
      height: 18,
    },
  },
  projectName: {
    color: "#171d29",
    fontSize: 16,
    fontWeight: 500,
    fontStryle: "normal",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  lastViewed: {
    color: "#767786",
    fontSize: 16,
    fontWeight: 400,
    fontStryle: "normal",
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      color: "#767786",
    },
    "& .MuiPaginationItem-textPrimary.Mui-selected": {
      color: "#fff",
    },
  },
  dialog: {
    "& .MuiBackdrop-root": {
      backgroundColor: "#171d29e6",
    },
    "& .MuiDialog-paperWidthSm": {
      maxWidth: 684,
    },
    "& .MuiDialog-paper": {
      width: 684,
    },
    "& .MuiDialogTitle-root": {
      padding: 32,
      borderBottom: "1px solid #76778633",
      fontSize: 24,
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
  dialogShare: {
    "& .MuiBackdrop-root": {
      backgroundColor: "#171d29e6",
    },
    "& .MuiDialog-paperWidthSm": {
      maxWidth: 684,
    },
    "& .MuiDialog-paper": {
      width: 684,
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
  deleteDialog: {
    "& .MuiBackdrop-root": {
      backgroundColor: "#171d29e6",
    },
    "& .MuiDialog-paperWidthSm": {
      maxWidth: 684,
    },
    "& .MuiDialog-paper": {
      width: 684,
    },
    "& .MuiDialogTitle-root": {
      padding: 32,
      borderBottom: "1px solid #76778633",
      fontSize: 24,
      fontWeight: 500,
      fontStyle: "normal",
      color: "#171d29",
    },
    "& .MuiDialogContent-root": {
      padding: "24px 80px",
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
  sectionTitle: {
    marginBottom: 32,
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: 500,
    fontStyle: "normal",
    color: "#767786",
    opacity: 0.6,
  },
  textBox: {
    marginBottom: 24,
    "& .MuiInputBase-root": {
      width: "auto",
      height: 56,
      borderRadius: 6,
      backgroundColor: "#fff",
    },
    "& .MuiOutlinedInput-input": {
      padding: "19px 16px",
      fontFamily: "Roboto",
      fontSize: 16,
      color: "#171d29",
      fontWeight: 400,
      fontStyle: "normal",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#767786",
    },
  },
  submitButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    "& span": {
      fontFamily: "Roboto",
      fontSize: 18,
      fontWeight: 500,
      textAlign: "center",
      color: "#fff",
      fontStyle: "normal",
    },
  },
  cancelButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    border: "1px solid #767786",
    "& span": {
      fontFamily: "Roboto",
      fontSize: 18,
      fontWeight: 500,
      textAlign: "center",
      color: "#767786",
      fontStyle: "normal",
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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
function Projects(props) {
  const { classes, token, removeToken } = props;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const history = useHistory();
  const [userInfo, setUserInfo] = useState(null);
  const [anchorAccountElement, setAnchorAccountElement] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectFilters, setProjectFilters] = useState([]);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("gallery");
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("updatedAt");
  const [page, setPage] = React.useState(1);
  const [anchorActionsElement, setAnchorActionsElement] = useState(null);
  const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
  const [changeShareDialogOpen, setChangeShareDialogOpen] = useState(false);
  const [changeProjectNameDialogOpen, setChangeProjectNameDialogOpen] =
    useState(false);
  const [deleteProjectDialogOpen, setDeleteProjectDialogOpen] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const [cityName, setCityName] = useState("");
  const [stateName, setStateName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [buildingHeight, setBuildingHeight] = useState("");
  const [roofAccessItem, setRoofAccessItem] = useState(roofAccessItems[0]);
  const [projectType, setProjectType] = useState(projectTypes[0]);
  const [emailShared, setEmailShared] = useState("");
  const [sharedAccess, setSharedAccess] = useState("false");
  const [sharedUsers, setSharedUsers] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  //Toast
  const [severity, setSeverity] = useState("success");
  const [openToast, setOpenToast] = useState(false);
  const [messageToast, setMessageToast] = useState("");

  const handleChangeSearch = (event) => {
    var inputValue = event.target.value;
    if (inputValue === "") {
      setProjectFilters(projects);
    } else {
      var newFilters = projects.filter(function (obj) {
        var rowString = obj.project_name.toLowerCase();
        return rowString.indexOf(inputValue.toLowerCase()) !== -1;
      });
      setPage(1);
      setProjectFilters(newFilters);
    }
  };

  const createSortHandler = (property) => (event) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleActionsButtonClick = (row) => (e) => {
    setProject(row);
    setProjectName(row.project_name);
    setAnchorActionsElement(e.currentTarget);
  };

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  };

  const handleDuplicateProject = () => {
    setAnchorActionsElement(null);
    axios
      .post(`${BASE_URL}/api/measurement/duplicate/${project.id}`)
      .then(function (response) {
        if (response.data.status === "success") {
          var results = response.data.results;
          var newID = results["insertId"];
          var updatedAt = results["updatedAt"];
          var newProject = {
            id: newID,
            project_name: project.project_name,
            updatedAt: updatedAt,
          };
          var newProjects = [...projects, newProject];
          var newProjectFilters = [...projectFilters, newProject];
          setProjects(newProjects);
          setProjectFilters(newProjectFilters);
        } else {
          console.log(response.data.message);
          if (response.data.status === "failed-token") {
            removeToken();
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleCopyLink = () => {
    setAnchorActionsElement(null);
    navigator.clipboard.writeText(
      `${window.location.origin}/Edit/Project/${project.id}`
    );
  };

  const handleChangeShare = (id) => {
    getUser();
    setAnchorActionsElement(null);
    setChangeShareDialogOpen(true);
    getSharedData(id);
    console.log(sharedUsers);
  };

  const handleSharedAccess = (event) => {
    setSharedAccess(event.target.value);
  };

  const getSharedData = async (id) => {
    setSharedUsers([]);
    const res = await getShared(id);
    if (res.status === "success") {
      const data = sharedUsers.concat(res.sharedUsers);
      setSharedUsers(data);
    } else {
      setSharedUsers([]);
    }
  };

  const handleUserAdd = () => {
    const data = sharedUsers.concat({
      id: 0,
      email: emailShared,
      owner: sharedAccess.toString(),
    });
    setSharedUsers(data);
    setEmailShared("");
  };

  const handleSharedSend = async () => {
    const data = {
      sharedUsers: sharedUsers,
      measurementsId: project.id,
      email: user.email,
      name: user.name,
    };

    const response = await addShared(data);
    if (response.status === "success") {
      setMessageToast("The invitation was sent");
      setSeverity("success");
      setOpenToast(true);
      //setSharedUsers([]);
    } else {
      setMessageToast("Error sending invitation");
      setSeverity("error");
      setOpenToast(true);
    }
  };

  const handleToast = () => {
    setOpenToast(false);
  };

  const updateShared = async (index, value, item) => {
    if (value === "remove") {
      if (item.id !== 0 || item.id !== undefined || item.id !== null) {
        const response = await deleteShared(item.id);
        if (response.status === "success") {
          sharedUsers.splice(index, 1);
        } else {
          sharedUsers.splice(index, 1);
        }
      } else {
        sharedUsers.splice(index, 1);
      }
    } else {
      if (value) {
        let temp_state = [...sharedUsers];
        let temp_element = { ...temp_state[index] };
        temp_element.owner = "true";
        temp_state[index] = temp_element;

        setSharedUsers(temp_state);
      } else {
        let temp_state = [...sharedUsers];
        let temp_element = { ...temp_state[index] };
        temp_element.owner = "false";
        temp_state[index] = temp_element;

        setSharedUsers(temp_state);
      }
    }
  };

  const handleChangeProjectName = () => {
    setAnchorActionsElement(null);
    setChangeProjectNameDialogOpen(true);
  };

  const handleDeleteProject = () => {
    setAnchorActionsElement(null);
    setDeleteProjectDialogOpen(true);
  };

  const handleChangeProjectNameSubmit = () => {
    setChangeProjectNameDialogOpen(false);
    var params = {
      project_name: projectName,
    };
    axios
      .put(`${BASE_URL}/api/measurement/project/rename/${project.id}`, params)
      .then(function (response) {
        if (response.data.status === "success") {
          var results = response.data.results;
          var updatedAt = results["updatedAt"];
          var updateIndex = projects.indexOf(project);
          var newProjects = [...projects];
          newProjects[updateIndex] = {
            ...newProjects[updateIndex],
            project_name: projectName,
            updatedAt: updatedAt,
          };
          setProjects(newProjects);
          updateIndex = projectFilters.indexOf(project);
          var newProjectFilters = [...projectFilters];
          newProjectFilters[updateIndex] = {
            ...newProjectFilters[updateIndex],
            project_name: projectName,
            updatedAt: updatedAt,
          };
          setProjectFilters(newProjectFilters);
        } else {
          console.log(response.data.message);
          if (response.data.status === "failed-token") {
            removeToken();
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleDeleteProjectDialogOk = () => {
    setDeleteProjectDialogOpen(false);
    axios
      .delete(`${BASE_URL}/api/measurement/delete/${project.id}`)
      .then(function (response) {
        if (response.data.status === "success") {
          const newRows = projects.filter((item) => item.id !== project.id);
          const newFilters = projectFilters.filter(
            (item) => item.id !== project.id
          );
          setProjects(newRows);
          setProjectFilters(newFilters);
        } else {
          console.log(response.data.message);
          if (response.data.status === "failed-token") {
            removeToken();
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleCreateProjectDialogEntered = () => {
    var input = document.getElementById("input-address");
    const autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, "place_changed", function () {
      var place = autocomplete.getPlace();
      setAddress(place.formatted_address);
      setLocation(place.geometry.location.toJSON());
      var address_components = place.address_components;
      for (let i = 0; i < address_components.length; i++) {
        var component = address_components[i];
        var type = component.types[0];
        if (type === "administrative_area_level_1") {
          setStateName(component.long_name);
        } else if (type === "locality") {
          setCityName(component.long_name);
        } else if (type === "postal_code") {
          setZipCode(component.long_name);
        }
      }
    });
  };

  const handleCreateProjectSubmit = () => {
    if (location) {
      var routeUrl = [
        "/Edit/Create-Project",
        `/${encodeURIComponent(newProjectName)}`,
        `/${encodeURIComponent(address)}`,
        `/${encodeURIComponent(projectType)}`,
        `?lat=${location.lat}`,
        `&lng=${location.lng}`,
        `&city=${encodeURIComponent(cityName)}`,
        `&state=${encodeURIComponent(stateName)}`,
        `&zipCode=${encodeURIComponent(zipCode)}`,
        `&buildingHeight=${encodeURIComponent(buildingHeight)}`,
        `&roofAccessItem=${encodeURIComponent(roofAccessItem)}`,
      ].join("");
      history.push(routeUrl);
    }
  };

  const handleViewGoogleMapsOpenClick = () => {
    if (location) {
      var toUrl = [
        "https://www.google.com/maps/@?api=1&map_action=map",
        `zoom=20`,
        `basemap=satellite`,
        `center=${location.lat},${location.lng}`,
      ].join("&");
      window.open(toUrl, "_blank");
    }
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/user/info`)
      .then(function (response) {
        if (response.data.status === "success") {
          setUserInfo(response.data.results);
        } else {
          console.log(response.data.message);
          if (response.data.status === "failed-token") {
            removeToken();
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get(`${BASE_URL}/api/measurements`)
      .then(function (response) {
        if (response.data.status === "success") {
          setProjects(response.data.results);
          setProjectFilters(response.data.results);
          setIsLoading(false);
        } else {
          console.log(response.data.message);
          if (response.data.status === "failed-token") {
            removeToken();
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <Grid
      className={classes.container}
      container
      direction="column"
      wrap="nowrap"
    >
      <Grid
        className={classes.header}
        container
        alignItems="center"
        wrap="nowrap"
      >
        <Grid item xs={6} sm={8}>
          <Grid container alignItems="center" wrap="nowrap">
            <Link
              to="/Projects"
              style={{ display: "flex", textDecoration: "none" }}
            >
              <img src={imgLogo} alt="Logo" className={classes.logo} />
            </Link>
            <Hidden xsDown>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search project"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "search" }}
                  onChange={handleChangeSearch}
                />
              </div>
            </Hidden>
          </Grid>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Grid container justifyContent="flex-end">
            <div
              className={classes.accountBox}
              onClick={(e) => setAnchorAccountElement(e.currentTarget)}
            >
              <Hidden smDown>
                <div style={{ marginRight: 10 }}>{userInfo?.name}</div>
              </Hidden>
              <AccountCircleIcon fontSize="large" />
              <ExpandMoreIcon fontSize="small" />
            </div>
          </Grid>
        </Grid>
      </Grid>
      <div className={classes.content}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          style={{ marginBottom: 24 }}
        >
          <Grid
            item
            xs={12}
            sm={4}
            style={{
              fontSize: 20,
              color: "#171d29",
              fontWeight: 500,
              fontStyle: "normal",
            }}
          >
            <Hidden xsDown>Recent Projects</Hidden>
            <Hidden smUp>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search project"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "search" }}
                  onChange={handleChangeSearch}
                />
              </div>
            </Hidden>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Grid container justifyContent="flex-end">
              <Button
                className={classes.createButton}
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => setCreateProjectDialogOpen(true)}
              >
                New Project
              </Button>
              <Hidden xsDown>
                <BootstrapTooltip title="View Gallery" placement="bottom">
                  <IconButton
                    aria-label="view gallery"
                    style={{ color: "#171d29", marginRight: 10 }}
                    onClick={() => setViewMode("gallery")}
                  >
                    <ViewModuleIcon />
                  </IconButton>
                </BootstrapTooltip>
                <BootstrapTooltip title="View List" placement="bottom">
                  <IconButton
                    aria-label="view list"
                    style={{ color: "#767786", marginRight: 10 }}
                    onClick={() => setViewMode("list")}
                  >
                    <ViewHeadlineIcon />
                  </IconButton>
                </BootstrapTooltip>
              </Hidden>
            </Grid>
          </Grid>
        </Grid>
        {viewMode === "gallery" ? (
          <>
            <Grid container spacing={3}>
              {stableSort(
                projectFilters,
                getComparator("asc", "project_name")
              ).map((row, index) => (
                <Grid
                  item
                  xl={2}
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  key={row.id}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Grid
                    container
                    direction="column"
                    className={classes.projectBox}
                  >
                    <Link
                      to={`/Edit/Project/${row.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Avatar
                        src={`${BASE_URL}/images/${row.id}/thumb.jpg`}
                        alt={row.project_name}
                      />
                    </Link>
                    <Grid container style={{ padding: 16 }}>
                      <Grid item xs={10}>
                        <div
                          className={classes.projectName}
                          style={{ marginBottom: 8 }}
                        >
                          {row.project_name}
                        </div>
                        <div
                          className={classes.lastViewed}
                          style={{ fontSize: 12 }}
                        >
                          Edited{" "}
                          <ReactTimeAgo
                            date={new Date(row.updatedAt)}
                            locale="en-US"
                            timeStyle="round"
                          />
                        </div>
                      </Grid>
                      <Grid item xs={2}>
                        <Grid container justifyContent="flex-end">
                          <BootstrapTooltip
                            title="More Actions"
                            placement="bottom"
                          >
                            <IconButton
                              edge="end"
                              aria-label="actions"
                              onClick={handleActionsButtonClick(row)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </BootstrapTooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                  color: "#404dff",
                }}
              >
                <CircularProgress size={48} />
              </div>
            ) : null}
          </>
        ) : (
          <>
            <Hidden xsDown>
              <List className={classes.projectList}>
                <Grid
                  container
                  className={classes.listHeader}
                  alignItems="center"
                  wrap="nowrap"
                >
                  <Grid item xs={6}>
                    <Grid
                      container
                      alignItems="center"
                      style={{ cursor: "pointer" }}
                      onClick={createSortHandler("project_name")}
                    >
                      <div style={{ marginRight: 10 }}>File name</div>
                      {orderBy === "project_name" ? (
                        <>
                          {order === "desc" ? (
                            <ArrowDownwardIcon />
                          ) : (
                            <ArrowUpwardIcon />
                          )}
                        </>
                      ) : null}
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Grid
                      container
                      alignItems="center"
                      style={{ cursor: "pointer" }}
                      onClick={createSortHandler("updatedAt")}
                    >
                      <div style={{ marginRight: 10 }}>Last Updated</div>
                      {orderBy === "updatedAt" ? (
                        <>
                          {order === "desc" ? (
                            <ArrowDownwardIcon />
                          ) : (
                            <ArrowUpwardIcon />
                          )}
                        </>
                      ) : null}
                    </Grid>
                  </Grid>
                  <Grid item xs={2}>
                    <Grid container justifyContent="flex-end">
                      Actions
                    </Grid>
                  </Grid>
                </Grid>
                {stableSort(projectFilters, getComparator(order, orderBy))
                  .slice(
                    (page - 1) * rowsPerPage,
                    (page - 1) * rowsPerPage + rowsPerPage
                  )
                  .map((row, index) => (
                    <ListItem key={row.id}>
                      <Grid container alignItems="center">
                        <Grid item xs={6}>
                          <Grid container alignItems="center" wrap="nowrap">
                            <Link
                              to={`/Edit/Project/${row.id}`}
                              style={{ textDecoration: "none" }}
                            >
                              <Avatar
                                src={`${BASE_URL}/images/${row.id}/thumb.jpg`}
                                alt={row.project_name}
                                style={{ marginRight: 24 }}
                              />
                            </Link>
                            <div className={classes.projectName}>
                              {row.project_name}
                            </div>
                          </Grid>
                        </Grid>
                        <Grid item xs={4} className={classes.lastViewed}>
                          Edited{" "}
                          <ReactTimeAgo
                            date={new Date(row.updatedAt)}
                            locale="en-US"
                            timeStyle="round"
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Grid container justifyContent="flex-end">
                            <BootstrapTooltip
                              title="More Actions"
                              placement="top"
                            >
                              <IconButton
                                aria-label="actions"
                                onClick={handleActionsButtonClick(row)}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </BootstrapTooltip>
                          </Grid>
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))}
              </List>
              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 20,
                    color: "#404dff",
                  }}
                >
                  <CircularProgress size={48} />
                </div>
              ) : null}
              {projectFilters.length > rowsPerPage ? (
                <Grid container justifyContent="center">
                  <Pagination
                    className={classes.pagination}
                    color="primary"
                    count={parseInt(projectFilters.length / rowsPerPage) + 1}
                    page={page}
                    onChange={(e, newPage) => setPage(newPage)}
                  />
                </Grid>
              ) : null}
            </Hidden>
            <Hidden smUp>
              <Grid container spacing={3}>
                {stableSort(
                  projectFilters,
                  getComparator("asc", "project_name")
                ).map((row, index) => (
                  <Grid
                    item
                    xl={2}
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                    key={row.id}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: 330,
                    }}
                  >
                    <Grid
                      container
                      direction="column"
                      className={classes.projectBox}
                    >
                      <Link
                        to={`/Edit/Project/${row.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Avatar
                          src={`${BASE_URL}/images/${row.id}/thumb.jpg`}
                          alt={row.project_name}
                        />
                      </Link>
                      <Grid container style={{ padding: 16 }}>
                        <Grid item xs={10}>
                          <div
                            className={classes.projectName}
                            style={{ marginBottom: 8 }}
                          >
                            {row.project_name}
                          </div>
                          <div
                            className={classes.lastViewed}
                            style={{ fontSize: 12 }}
                          >
                            Edited{" "}
                            <ReactTimeAgo
                              date={new Date(row.updatedAt)}
                              locale="en-US"
                              timeStyle="round"
                            />
                          </div>
                        </Grid>
                        <Grid item xs={2}>
                          <Grid container justifyContent="flex-end">
                            <BootstrapTooltip
                              title="More Actions"
                              placement="bottom"
                            >
                              <IconButton
                                edge="end"
                                aria-label="actions"
                                onClick={handleActionsButtonClick(row)}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </BootstrapTooltip>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 20,
                    color: "#404dff",
                  }}
                >
                  <CircularProgress size={48} />
                </div>
              ) : null}
            </Hidden>
          </>
        )}
      </div>
      <Menu
        id="menuAccount"
        anchorEl={anchorAccountElement}
        keepMounted
        open={Boolean(anchorAccountElement)}
        onClose={() => setAnchorAccountElement(null)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Link to="/Profile" style={{ textDecoration: "none" }}>
          <MenuItem>My Profile</MenuItem>
        </Link>
        <Divider />
        <MenuItem onClick={() => removeToken()}>Logout</MenuItem>
      </Menu>
      <Menu
        id="menuActions"
        anchorEl={anchorActionsElement}
        keepMounted
        open={Boolean(anchorActionsElement)}
        onClose={() => setAnchorActionsElement(null)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Link
          to={project ? `/Edit/Project/${project.id}` : "/"}
          style={{ textDecoration: "none" }}
        >
          <MenuItem>Open</MenuItem>
        </Link>
        <Divider />
        <MenuItem onClick={handleDuplicateProject}>Duplicate</MenuItem>
        {/*<MenuItem onClick={() => handleChangeShare(project.id)}>Share</MenuItem>*/}
        <Divider />
        <MenuItem onClick={handleChangeProjectName}>Rename</MenuItem>
        <MenuItem onClick={handleDeleteProject}>Delete</MenuItem>
      </Menu>
      <Dialog
        className={classes.dialog}
        open={createProjectDialogOpen}
        onClose={() => setCreateProjectDialogOpen(false)}
        onEntered={handleCreateProjectDialogEntered}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle disableTypography={true}>Create a new project</DialogTitle>
        <DialogContent>
          <ValidatorForm
            onSubmit={handleCreateProjectSubmit}
            style={{ width: "100%" }}
          >
            <div className={classes.sectionTitle}>PROJECT INFORMATION</div>
            <TextValidator
              className={classes.textBox}
              label="Name project"
              placeholder="Enter your project name."
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              autoComplete="off"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              validators={["required"]}
              errorMessages={["Name is required"]}
            />
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              style={{ marginBottom: 24 }}
            >
              <div style={{ flex: 1, marginRight: 10 }}>
                <TextValidator
                  className={classes.textBox}
                  style={{ marginBottom: 0 }}
                  id="input-address"
                  name="address"
                  label="Address"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  placeholder="Enter your address."
                  fullWidth
                  autoComplete="off"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  validators={["required"]}
                  errorMessages={["Address is required"]}
                />
              </div>
              <BootstrapTooltip title="View Google Maps" placement="top">
                <IconButton
                  color="primary"
                  aria-label="View Google Map"
                  onClick={handleViewGoogleMapsOpenClick}
                >
                  <MapIcon />
                </IconButton>
              </BootstrapTooltip>
            </Grid>
            <TextField
              className={classes.textBox}
              variant="outlined"
              label="Select type project"
              fullWidth
              InputLabelProps={{ shrink: true }}
              select={true}
              SelectProps={selectMenuProps}
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
            >
              {projectTypes.map((item, index) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            <div className={classes.sectionTitle}>PROPERTY ACCESS</div>
            <InchesFormat
              className={classes.textBox}
              label="Building height"
              value={buildingHeight}
              onChange={(e) => setBuildingHeight(e.target.value)}
            />
            {["", ...roofAccessItems].includes(roofAccessItem) ? (
              <TextField
                className={classes.textBox}
                variant="outlined"
                label="Roof access"
                fullWidth
                InputLabelProps={{ shrink: true }}
                select={true}
                SelectProps={selectMenuProps}
                value={roofAccessItem}
                onChange={(e) => setRoofAccessItem(e.target.value)}
              >
                {[...roofAccessItems, "Other (Add Text)"].map((item, index) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                className={classes.textBox}
                variant="outlined"
                label="Roof access"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={roofAccessItem}
                onChange={(e) => setRoofAccessItem(e.target.value)}
                onFocus={(e) => e.target.select()}
              />
            )}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  color="default"
                  className={classes.cancelButton}
                  onClick={() => setCreateProjectDialogOpen(false)}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submitButton}
                >
                  Create Project
                </Button>
              </Grid>
            </Grid>
          </ValidatorForm>
        </DialogContent>
      </Dialog>
      <Dialog
        className={classes.dialogShare}
        onClose={() => setChangeShareDialogOpen(false)}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        open={changeShareDialogOpen}
      >
        <DialogTitle
          id="scroll-dialog-title"
          onClose={() => setChangeShareDialogOpen(false)}
        >
          Shared
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              className={classes.input}
              variant="outlined"
              placeholder="Email address"
              fullWidth
              value={emailShared}
              onChange={(e) => setEmailShared(e.target.value)}
            />
            <FormControl variant="outlined" className={classes.margin}>
              <Select
                value={sharedAccess}
                onChange={handleSharedAccess}
                fullWidth
              >
                <MenuItem value={true}>owner</MenuItem>
                <MenuItem selected={true} value={false}>
                  guest
                </MenuItem>
              </Select>
            </FormControl>
            <Fab
              size="medium"
              color="secondary"
              aria-label="add"
              onClick={handleUserAdd}
              className={classes.margin}
            >
              <Add />
            </Fab>
          </Grid>
          <List>
            {sharedUsers.length > 0
              ? sharedUsers.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={item.email}
                      style={{ width: "100%" }}
                    />
                    <Select
                      style={{
                        border: 0,
                        boxShadow: "none",
                      }}
                      value={item.owner}
                      onChange={(e) =>
                        updateShared(index, e.target.value, item)
                      }
                    >
                      <MenuItem value={true}>owner</MenuItem>
                      <MenuItem value={false}>guest</MenuItem>
                      <MenuItem style={{ color: "red" }} value={"remove"}>
                        remove
                      </MenuItem>
                    </Select>
                  </ListItem>
                ))
              : ""}
            <Button
              color="primary"
              className={classes.button}
              startIcon={<IconLink />}
              onClick={handleCopyLink}
            >
              Copy link
            </Button>
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSharedSend}
          >
            Send invite
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        className={classes.dialog}
        open={changeProjectNameDialogOpen}
        onClose={() => setChangeProjectNameDialogOpen(false)}
      >
        <DialogTitle disableTypography={true}>Change Project Name</DialogTitle>
        <DialogContent>
          <ValidatorForm
            onSubmit={handleChangeProjectNameSubmit}
            style={{ width: "100%" }}
          >
            <TextValidator
              className={classes.textBox}
              label="Project name"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              placeholder="Enter your project name."
              fullWidth
              autoComplete="off"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              validators={["required"]}
              errorMessages={["Project name is required"]}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  color="default"
                  className={classes.cancelButton}
                  onClick={() => setChangeProjectNameDialogOpen(false)}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submitButton}
                >
                  Apply
                </Button>
              </Grid>
            </Grid>
          </ValidatorForm>
        </DialogContent>
      </Dialog>
      <Dialog
        className={classes.deleteDialog}
        open={deleteProjectDialogOpen}
        onClose={() => setDeleteProjectDialogOpen(false)}
      >
        <DialogTitle disableTypography={true}>Delete Project</DialogTitle>
        <DialogContent>
          <Grid
            container
            justifyContent="center"
            style={{
              marginBottom: 40,
              fontSize: 16,
              color: "#171d29",
              fontStyle: "normal",
              fontWeight: 700,
            }}
          >
            Are you sure you want to delete your selected project ?
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                color="default"
                className={classes.cancelButton}
                onClick={() => setDeleteProjectDialogOpen(false)}
              >
                No
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                variant="contained"
                className={classes.submitButton}
                style={{ backgroundColor: "#f53e3e" }}
                onClick={handleDeleteProjectDialogOk}
              >
                Yes
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Snackbar open={openToast} autoHideDuration={3000} onClose={handleToast}>
        <Alert onClose={handleToast} severity={severity}>
          {messageToast}
        </Alert>
      </Snackbar>
    </Grid>
  );
}

const mapStateToProps = (state) => {
  const { token } = state;
  return { token };
};

const mapDispatchToProps = { removeToken };

Projects.propTypes = {
  classes: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Projects);

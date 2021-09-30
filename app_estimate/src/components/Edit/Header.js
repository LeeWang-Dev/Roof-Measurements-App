import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import { compose } from "recompose";
import { connect } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";

// import material ui dialog
import Dialog from "@material-ui/core/Dialog";
//import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from "@material-ui/core/DialogContent";

import HomeIcon from "@material-ui/icons/Home";
import CreateIcon from "@material-ui/icons/Create";
import LinearScaleIcon from "@material-ui/icons/LinearScale";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import GetAppIcon from "@material-ui/icons/GetApp";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import { PhotoLibrary } from "@material-ui/icons";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";

import BootstrapTooltip from "../customs/BootstrapToolTip";

import { WebMercatorViewport } from "react-map-gl";

import axios from "axios";
import * as turf from "@turf/turf";
import { v4 as uuidv4 } from "uuid";
import { CSVLink } from "react-csv";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Numeral from "numeral";

import { removeToken } from "../../redux/actions/token";

import { BASE_URL, SITE_URL, edges, pitches } from "../../utils/constants";
import { roofPDF } from "../../services/pdf";

import { compress } from "../../utils/util";

import imgLogo from "../../assets/images/logo-512.png";
import imgLogoIcon from "../../assets/images/logo-icon-64.png";

let oldEditTabValue = null;

const styles = (theme) => ({
  headerTop: {
    height: 40,
    color: "#fff",
    fontStyle: "normal",
    backgroundColor: "#5c77ff",
  },
  projectName: {
    paddingLeft: 38,
    paddingRight: 38,
    fontSize: 16,
    fontWeight: 500,
    lineHeight: "40px",
    backgroundColor: "#4661e9",
    userSelect: "none",
  },
  headerBottom: {
    height: 56,
    paddingLeft: 14,
    paddingRight: 14,
    color: "#fff",
    fontStyle: "normal",
    backgroundColor: "#4661e9",
  },
  toggleButtons: {
    "& .MuiToggleButton-root": {
      marginRight: 10,
      padding: "6px 10px",
      border: 0,
      borderRadius: 4,
      justifyContent: "start",
      textTransform: "unset",
      fontSize: 14,
      color: "#fff",
      fontWeight: 500,
      fontStyle: "normal",
      lineHeight: "normal",
      backgroundColor: "#4661e9",
    },
    "& .MuiToggleButton-root:hover, .MuiToggleButton-root.Mui-selected": {
      backgroundColor: "#5873fb",
      border: "1px solid #7f99ff",
    },
  },
  csvLink: {
    textDecoration: "none",
    color: "inherit",
  },
  cancelButton: {
    marginRight: 10,
    width: 106,
    height: 38,
    border: 0,
    backgroundColor: "transparent",
    "& span": {
      fontFamily: "Roboto",
      fontSize: 18,
      fontWeight: 400,
      textAlign: "center",
      color: "#fff",
      fontStyle: "normal",
    },
    "&.MuiButton-root:hover": {
      backgroundColor: "rgb(0,0,0,0.04)",
    },
  },
  saveButton: {
    marginRight: 10,
    width: 106,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#fff",
    "& span": {
      fontFamily: "Roboto",
      fontSize: 18,
      fontWeight: 400,
      textAlign: "center",
      color: "#5c77ff",
      fontStyle: "normal",
    },
    "&.MuiButton-root:hover": {
      backgroundColor: "rgb(255,255,255,0.5)",
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
  dialogMessage: {
    marginTop: 20,
    marginBottom: 40,
    fontSize: 24,
    color: "#171d29",
    fontStyle: "normal",
    fontWeight: 500,
  },
  dlgOkButton: {
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
  dlgCancelButton: {
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
  backdrop: {
    "&.MuiBackdrop-root": {
      backgroundColor: "rgba(0,0,0,0.7)",
      zIndex: 9999,
    },
  },
});
function Header(props) {
  const {
    classes,
    token,
    removeToken,
    mID,
    setMID,
    map,
    drawLayers,
    setDrawLayers,
    viewport,
    setViewport,
    editTabValue,
    setEditTabValue,
    setDrawValue,
    layerValue,
    drawSteps,
    addDrawStep,
    setSelectedEdges,
    setSelectedFacets,
    setPrintValue,
    options,
    uploadFiles,
  } = props;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const history = useHistory();
  const [isSaving, setIsSaving] = useState(false);
  const [anchorExportElement, setAnchoExportElement] = useState(null);
  const [csvData, setCSVData] = useState([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [saveExit, setSaveExit] = useState(false);
  const [exportProgressOpen, setExportProgressOpen] = useState(false);

  const handleSaveClick = async () => {
    setIsSaving(true);
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    let formData = new FormData();
    formData.append(
      "location",
      JSON.stringify([viewport.longitude, viewport.latitude])
    );
    formData.append("zoom", viewport.zoom || 18);
    formData.append("bearing", viewport.bearing || 0);
    formData.append("geodata", JSON.stringify(drawLayers));
    formData.append("options", JSON.stringify(options));
    if (mID === null) {
      axios
        .post(`${BASE_URL}/api/measurement/add`, formData, config)
        .then(function (response) {
          if (response.data.status === "success") {
            var results = response.data.results;
            setMID(results["insertId"]);
          } else {
            console.log(response.data.message);
            if (response.data.status === "failed-token") {
              removeToken();
            }
          }
          setIsSaving(false);
        })
        .catch(function (error) {
          console.log(error);
          setIsSaving(false);
        });
    } else {
      let thumbImageFile = await getMapImageFile();
      formData.append("images", thumbImageFile);
      uploadFiles["generalConditions"]["files"].forEach((file) => {
        if (file) formData.append("images", file);
      });
      uploadFiles["roofDrainage"].forEach((drainageItem) => {
        drainageItem.forEach((item) => {
          item.files.forEach((file) => {
            if (file) formData.append("images", file);
          });
        });
      });
      uploadFiles["wallDetails"].forEach((item) => {
        item.files.forEach((file) => {
          if (file) formData.append("images", file);
        });
      });
      uploadFiles["roofDetails"].forEach((item) => {
        item.files.forEach((file) => {
          if (file) formData.append("images", file);
        });
      });
      axios
        .put(`${BASE_URL}/api/measurement/update/${mID}`, formData, config)
        .then(function (response) {
          if (saveExit) {
            history.push("/Projects");
          }
          setIsSaving(false);
          if (response.data.status === "failed-token") {
            removeToken();
          }
        })
        .catch(function (error) {
          console.log(error);
          setIsSaving(false);
        });
    }
  };

  const handleExportButtonClick = (e) => {
    setAnchoExportElement(e.currentTarget);
  };

  const handleExportMenuClose = () => {
    setAnchoExportElement(null);
  };

  const handleExportCSV = () => {
    var headers = {
      address: "Address",
      totalArea: "Total Area",
      totalFacets: "Total Facets",
    };
    var values = {
      address: options["basicInformation"]["address"],
      totalArea: 0,
      totalFacets: 0,
    };
    for (let key in edges) {
      headers[key] = edges[key].name;
      values[key] = 0;
    }
    for (let key in pitches) {
      headers[key] = key;
      values[key] = 0;
    }
    for (let layerKey in drawLayers) {
      for (let key in drawLayers[layerKey]["facets"]) {
        values["totalFacets"] += 1;
        values["totalArea"] += drawLayers[layerKey]["facets"][key].sqft_pitch;
        var pitch = drawLayers[layerKey]["facets"][key].pitch;
        if (pitch != null) {
          values[pitch] += drawLayers[layerKey]["facets"][key].sqft_pitch;
        }
      }
      for (let key in drawLayers[layerKey]["edges"]) {
        var edgeKey = drawLayers[layerKey]["edges"][key].edgeKey;
        values[edgeKey] += drawLayers[layerKey]["edges"][key].length_ft;
      }
    }
    var newData = [];
    for (var key in headers) {
      var value =
        typeof values[key] === "number" ? values[key].toFixed(2) : values[key];
      newData.push([headers[key], value]);
    }
    setAnchoExportElement(null);
    setCSVData(newData);
  };

  const handleExportPDF = async () => {
    setDrawValue(null);
    setAnchoExportElement(null);
    var values = {
      totalArea: 0,
      totalFacets: 0,
      facets: [],
      edges: [],
    };

    var geojson_facets = {
      type: "FeatureCollection",
      features: [],
    };

    for (let layerKey in drawLayers) {
      for (let key in drawLayers[layerKey]["facets"]) {
        values["totalFacets"] += 1;
        values["totalArea"] += drawLayers[layerKey]["facets"][key].sqft_pitch;
        values["facets"].push({
          name: drawLayers[layerKey]["facets"][key].name,
          sqft: drawLayers[layerKey]["facets"][key].sqft,
          pitch: drawLayers[layerKey]["facets"][key].pitch,
          sqft_pitch: drawLayers[layerKey]["facets"][key].sqft_pitch,
        });
        let feature = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: drawLayers[layerKey]["facets"][key].coordinates,
          },
          properties: {},
        };
        geojson_facets.features.push(feature);
      }
      for (let key in drawLayers[layerKey]["edges"]) {
        var edgeKey = drawLayers[layerKey]["edges"][key].edgeKey;
        if (values["edges"][edgeKey]) {
          values["edges"][edgeKey].count += 1;
          values["edges"][edgeKey].length +=
            drawLayers[layerKey]["edges"][key].length_ft;
        } else {
          values["edges"][edgeKey] = {
            name: edges[edgeKey].name,
            count: 1,
            length: drawLayers[layerKey]["edges"][key].length_ft,
          };
        }
      }
    }

    if (values["totalArea"] === 0) return;

    // unselect selected edges, facets
    setSelectedEdges([]);
    setSelectedFacets([]);

    setExportProgressOpen(true);

    let mapContainer = map.getContainer();
    mapContainer.style.borderRadius = "2%";
    let parentMapContainer = mapContainer.parentNode; // or parentElement
    parentMapContainer.style.margin = "0 auto";
    if (parentMapContainer.clientWidth > parentMapContainer.clientHeight) {
      parentMapContainer.style.width = parentMapContainer.clientHeight + "px";
    } else {
      parentMapContainer.style.height = parentMapContainer.clientWidth + "px";
    }

    // full extent map
    var bbox = turf.bbox(geojson_facets);

    const { longitude, latitude, zoom } = new WebMercatorViewport({
      ...viewport,
      width: map.getCanvas().width,
      height: map.getCanvas().height,
    }).fitBounds(
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
      { padding: 20 }
    );

    setViewport({
      ...viewport,
      longitude: longitude,
      latitude: latitude,
      zoom: zoom,
    });

    var pdf = new jsPDF("p", "pt", "a4");
    //a4 595.28, 841.89

    pdf.setFont("Roboto", "normal");
    var pageWidth = pdf.internal.pageSize.width,
      pageHeight = pdf.internal.pageSize.height;
    var marginLeft = 18,
      marginRight = 18,
      marginTop = 18,
      marginBottom = 18;
    var innerPageWidth = pageWidth - marginLeft - marginRight;
    var y = 0;

    // page-1 roof diagram on satellite map
    /*
    pdf.addImage(imgLogo, "JPEG", pageWidth / 2 - 96, marginTop, 192, 64, "", "FAST");
    var imgWidth = pageWidth - (marginLeft + marginRight);
    //var imgHeight = imgWidth * map.getCanvas().height / map.getCanvas().width;
    var imgHeight = imgWidth;
    var imgALL = await getPrintMapImage("ALL", true);
    y = y + 105;
    pdf.addImage(imgALL, "JPEG", marginLeft, y, imgWidth, imgWidth);

    pdf.setFont("Roboto", "normal", 500);
    pdf.setTextColor("#5c77ff");
    pdf.setFontSize(24);
    y = y + imgHeight + 44;
    pdf.text("Roof Report", marginLeft, y, "left");
    pdf.setFont("Roboto", "normal", 400);
    pdf.setTextColor("#171d29");
    pdf.setFontSize(14);
    y = y + 27;
    pdf.text(options["basicInformation"]["address"], marginLeft, y, "left");
    y = y + 22;
    pdf.text(
      `${Numeral(values["totalArea"]).format("0,0.00")} sqft`,
      marginLeft,
      y,
      "left"
    );
    y = y + 22;
    pdf.text(
      `${values["totalFacets"]} ${
        values["totalFacets"] > 1 ? "facets" : "facet"
      }`,
      marginLeft,
      y,
      "left"
    );
    */

    // page-2 roof diagram
    //pdf.addPage();
    pdf.addImage(imgLogo, "JPEG", marginLeft, marginTop, 192, 64, "", "FAST");

    pdf.setFont("Roboto", "normal", 500);
    pdf.setTextColor("#5c77ff");
    pdf.setFontSize(24);
    y = marginTop + 12;
    pdf.text("Roof Report", pageWidth - marginRight, y, "right");
    pdf.setFont("Roboto", "normal", 400);
    pdf.setTextColor("#767786");
    pdf.setFontSize(10);
    y = y + 21;
    pdf.text(
      options["basicInformation"]["address"],
      pageWidth - marginRight,
      y,
      "right"
    );
    y = y + 17;
    pdf.text(
      [
        options["basicInformation"]["contactName"],
        options["basicInformation"]["contactName"] === "" ? "" : " | ",
        options["basicInformation"]["email"],
        options["basicInformation"]["email"] === "" ? "" : " | ",
        options["basicInformation"]["mobilePhone"],
      ].join(""),
      pageWidth - marginRight,
      y,
      "right"
    );
    y = y + 30;
    //var imgDiagram = await getPrintMapImage("Diagram");
    var imgFacets = await getPrintMapImage("Facets", false);
    pdf.addImage(imgFacets, "JPEG", marginLeft, y, 360, 360);
    var imgEdges = await getPrintMapImage("Edges", false);
    pdf.addImage(
      imgEdges,
      "JPEG",
      marginLeft + 376,
      y,
      innerPageWidth - 376,
      172
    );
    y = y + 172 + 16;
    var imgALL = await getPrintMapImage("ALL", false);
    pdf.addImage(
      imgALL,
      "JPEG",
      marginLeft + 378,
      y,
      innerPageWidth - 376,
      172
    );

    y = y + 172 + 26;
    var tableStyles = {
      cellPadding: 5,
      lineColor: "#b8c5d0",
      lineWidth: 0.1,
      fontSize: 8,
      fontStyle: "normal",
      halign: "center",
      textColor: "#171d29",
      valign: "middle",
      cellWidth: "wrap",
      //rowHeight:20
    };
    var headStyles = {
      fillColor: "#fff",
      fontStyle: "bold",
    };

    if (options["basicInformation"]["projectType"] === "Steep Slope Roofs") {
      pdf.autoTable({
        //html:'#table', element or string
        /*
         columns:[
           {header:'ID',dataKey:'id'},
           {header:'Name',dataKey:'name'},
         ],
         */
        head: [["ID", "Roof Area sqft", "Pitch"]],
        body: values["facets"].map((item, idx) => [
          idx + 1,
          Math.floor(item.sqft_pitch),
          item.pitch,
        ]),
        theme: "grid",
        styles: tableStyles,
        headStyles: headStyles,
        //bodyStyles:{},
        //columnStyles:{}
        //footStyles:{}
        alternateRowStyles: {
          fillColor: "#dee7ee",
        },
        startY: y,
        margin: { left: 18, top: 0, right: 18, bottom: 18 },
        tableWidth: 200,
      });

      pdf.autoTable({
        head: [["Edge Type", "Number of Details", "Length"]],
        body: Object.keys(values["edges"]).map((key) => [
          `${values["edges"][key].name}`,
          `${values["edges"][key].count}`,
          `${Numeral(values["edges"][key].length).format("0,0.00")} ft`,
        ]),
        theme: "grid",
        styles: tableStyles,
        headStyles: headStyles,
        columnStyles: {
          0: {
            halign: "left",
            valign: "middle",
            cellPadding: { left: 40 },
          },
        },
        startY: y,
        margin: {
          left: pageWidth - marginRight - 240,
          top: 0,
          right: 18,
          bottom: 18,
        },
        tableWidth: 240,
        didDrawCell: (data) => {
          if (data.section === "body" && data.column.index === 0) {
            for (let key in edges) {
              if (edges[key].name === data.cell.raw) {
                pdf.setDrawColor(edges[key].color);
                if (edges[key].style === "solid") {
                  pdf.setLineDash([]);
                } else {
                  pdf.setLineDash([4, 2]);
                }
                break;
              }
            }
            pdf.setLineWidth(3);
            pdf.line(
              data.cell.x + 10,
              data.cell.y + 10,
              data.cell.x + 30,
              data.cell.y + 10
            );
            pdf.setLineDash([]);
          }
        },
      });
    } else {
      // Low Slope Roofs
      pdf.autoTable({
        head: [["Area Name", "Roof Area sqft"]],
        body: values["facets"].map((item, idx) => [
          item.name == "" ? `Area-${idx + 1}` : item.name,
          Math.floor(item.sqft),
        ]),
        theme: "grid",
        styles: tableStyles,
        headStyles: headStyles,
        alternateRowStyles: {
          fillColor: "#dee7ee",
        },
        startY: y,
        margin: { left: 18, top: 0, right: 18, bottom: 18 },
        tableWidth: 150,
      });
    }

    pdf.autoTable({
      head:[],
      body: [[
        `Total SQFT:`,
        `${Numeral(values["totalArea"]).format("0,0.00")}`,
        `Number of Areas:`,
        `${values["totalFacets"]}`,
        `Number of Details:`,
        `${Object.keys(values["edges"]).length}`
      ]],
      styles: {
        cellPadding:{top:5,right:2,bottom:5,left:2},
        minCellWidth: 30,
        fillColor:'#f1f1f3',
        fontSize: 12,
        textColor: '#767786',
        fontStyle: "normal"
      },
      columnStyles:{
        0:{halign:'right',fontStyle:'bold'},
        1:{halign:'left'},
        2:{halign:'right',fontStyle:'bold'},
        3:{halign:'left'},
        4:{halign:'right',fontStyle:'bold'},
        5:{halign:'left'}
      },
      startY: pageHeight - 60,
      margin: { left: 18, top: 0, right: 18, bottom:0 },
    });

    // add page footers
    pdf.setFont("Roboto", "normal", 400);
    pdf.setFontSize(8);
    pdf.setTextColor("#767786");
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 0; i < pageCount; i++) {
      pdf.setPage(i + 1);
      pdf.text(
        `Copyright © 2021 ${SITE_URL} | All rights reserved.`,
        marginLeft,
        pageHeight - marginBottom,
        "left"
      );
      pdf.text(
        "Page " + String(i + 1) + " of " + String(pageCount),
        pageWidth - marginRight,
        pageHeight - marginBottom - 4,
        "right"
      );
    }

    setPrintValue("Default");

    pdf.save("Report.pdf");

    mapContainer.style.borderRadius = "0";
    parentMapContainer.style.width = "100%";
    parentMapContainer.style.height = "100%";

    setExportProgressOpen(false);
  };

  const handleExportRoofPDF = () => {
    setDrawValue(null);
    setAnchoExportElement(null);
    roofPDF(map, setPrintValue, drawLayers, options);
  };

  function createPolygons() {
    // create polygons
    let newDrawLayers = { ...drawLayers };
    var features = [];
    for (let key in newDrawLayers[layerValue]["edges"]) {
      // readjust of edge coordinates from vertexes
      var vk1 = newDrawLayers[layerValue]["edges"][key].startVertexKey;
      var vk2 = newDrawLayers[layerValue]["edges"][key].endVertexKey;
      var p1 = newDrawLayers[layerValue]["vertexes"][vk1].coordinates;
      var p2 = newDrawLayers[layerValue]["vertexes"][vk2].coordinates;
      newDrawLayers[layerValue]["edges"][key].coordinates = [p1, p2];

      var line = turf.lineString([p1, p2]);
      features.push(line);
    }
    var featureCollection = turf.featureCollection(features);
    var results = turf.polygonize(featureCollection);
    results.features.forEach((feature) => {
      // check crossing between two polygons
      var exsist = false;
      for (let key in newDrawLayers[layerValue]["facets"]) {
        var polygon = turf.polygon(
          newDrawLayers[layerValue]["facets"][key].coordinates
        );
        var intersection = turf.intersect(feature, polygon);
        if (intersection && intersection.geometry.type === "Polygon") {
          exsist = true;
          break;
        }
      }
      if (!exsist) {
        var newFacetKey = uuidv4();
        var sqm = turf.area(feature);
        var center = turf.centerOfMass(feature);

        let edgeKeys = [];
        for (let key in newDrawLayers[layerValue]["edges"]) {
          var path = newDrawLayers[layerValue]["edges"][key].coordinates;
          var pt1 = turf.point(path[0]);
          var pt2 = turf.point(path[path.length - 1]);
          var flag1 = turf.booleanPointInPolygon(pt1, feature, {
            ignoreBoundary: false,
          });
          var flag2 = turf.booleanPointInPolygon(pt2, feature, {
            ignoreBoundary: false,
          });
          if (flag1 && flag2) {
            edgeKeys.push(key);
          }
        }

        newDrawLayers[layerValue]["facets"][newFacetKey] = {
          coordinates: feature.geometry.coordinates,
          name: "",
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          pitch: null,
          sqm: sqm,
          sqft: sqm * 10.76391041671,
          sqft_pitch: sqm * 10.76391041671,
          center: center.geometry.coordinates,
          edgeKeys: edgeKeys,
        };
      }
    });
    addDrawStep(newDrawLayers);
    setDrawLayers(newDrawLayers);
  }

  function getPrintMapImage(printType, overlays) {
    if (!map) return;
    setPrintValue(printType);
    return new Promise((resolve) => {
      setTimeout(function () {
        //let canvas = map.getCanvas();
        //let image = canvas.toDataURL("image/jpeg", 0.7);
        let mapElement = map.getContainer();
        let parentMapElement = mapElement.parentNode; // or parentElement
        html2canvas(parentMapElement, {
          ignoreElements: (element) => {
            if (overlays === false && element.classList.contains("overlays")) {
              return true;
            }
          },
        }).then(function (canvas) {
          let image = canvas.toDataURL("image/jpeg", 0.7);
          resolve(image);
        });
      }, 1000);
    });
  }

  function getMapImageFile() {
    return new Promise((resolve) => {
      let mapCanvas = map.getCanvas();
      let imageSrc = mapCanvas.toDataURL("image/jpeg", 0.7);
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        var width = img.width;
        var height = img.height;
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 300;
        if (width > height) {
          if (width > MAX_WIDTH) {
            canvas.width = MAX_WIDTH;
            canvas.height = (MAX_WIDTH * height) / width;
          } else {
            canvas.width = width;
            canvas.height = height;
          }
        } else {
          if (height > MAX_HEIGHT) {
            canvas.width = (MAX_HEIGHT * width) / height;
            canvas.height = MAX_HEIGHT;
          } else {
            canvas.width = width;
            canvas.height = height;
          }
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.canvas.toBlob(
          (blob) => {
            const file = new File([blob], "thumb.jpg");
            resolve(file);
          },
          "image/jpeg",
          0.7
        );
      };
    });
  }

  useEffect(() => {
    setDrawValue(null);
    if (editTabValue === "facets" && oldEditTabValue !== "facets")
      createPolygons();
    oldEditTabValue = editTabValue;
  }, [editTabValue]);

  useEffect(() => {
    if (mID && drawSteps.length > 0) {
      handleSaveClick();
    }
  }, [mID]);

  useEffect(() => {
    if (saveExit) {
      setCancelDialogOpen(false);
      handleSaveClick();
    }
  }, [saveExit]);

  return (
    <>
      <Grid
        container
        direction="row"
        alignItems="stretch"
        className={classes.headerTop}
        wrap="nowrap"
      >
        <Link to={`/Projects`} style={{ textDecoration: "none" }}>
          <BootstrapTooltip title="Go to Projects">
            <IconButton
              color="default"
              aria-label="close"
              style={{ padding: "8px 12px", color: "#fff" }}
            >
              <HomeIcon />
            </IconButton>
          </BootstrapTooltip>
        </Link>
        <div className={classes.projectName}>
          {options["basicInformation"]["projectName"]}
        </div>
      </Grid>
      <Grid
        className={classes.headerBottom}
        container
        direction="row"
        alignItems="center"
        wrap="nowrap"
      >
        <Hidden smDown>
          <ToggleButtonGroup
            className={classes.toggleButtons}
            value={editTabValue}
            exclusive
            onChange={(e, newValue) => setEditTabValue(newValue)}
            aria-label="edit toggle button group"
          >
            <ToggleButton value="draw" aria-label="draw">
              <CreateIcon style={{ marginRight: 10 }} />
              Draw
            </ToggleButton>
            <ToggleButton value="edges" aria-label="edges">
              <LinearScaleIcon style={{ marginRight: 10 }} />
              Details
            </ToggleButton>
            <ToggleButton
              value="facets"
              aria-label="facets"
              style={{ marginRight: 0 }}
            >
              <AspectRatioIcon style={{ marginRight: 10 }} />
              Areas
            </ToggleButton>
            <Divider
              orientation="vertical"
              flexItem
              style={{ margin: "8px 16px", backgroundColor: "#7f99ff" }}
            />
            <ToggleButton value="project_information" aria-label="options">
              Project Information
            </ToggleButton>
            <ToggleButton
              value="general_conditions"
              aria-label="General conditions"
            >
              General conditions
            </ToggleButton>
            {/*
              <ToggleButton value="gallery" aria-label="Photo library">
              Photo library
            </ToggleButton>
              */}
          </ToggleButtonGroup>
        </Hidden>
        <Hidden mdUp>
          <ToggleButtonGroup
            className={classes.toggleButtons}
            value={editTabValue}
            exclusive
            onChange={(e, newValue) => setEditTabValue(newValue)}
            aria-label="edit toggle button group"
          >
            <ToggleButton value="draw" aria-label="draw">
              <BootstrapTooltip title="Draw">
                <CreateIcon />
              </BootstrapTooltip>
            </ToggleButton>
            <ToggleButton value="edges" aria-label="edges">
              <BootstrapTooltip title="Details">
                <LinearScaleIcon />
              </BootstrapTooltip>
            </ToggleButton>
            <ToggleButton value="facets" aria-label="facets">
              <BootstrapTooltip title="Areas">
                <AspectRatioIcon />
              </BootstrapTooltip>
            </ToggleButton>
            <ToggleButton value="project_information" aria-label="options">
              <BootstrapTooltip title="Project Information">
                <InfoOutlinedIcon />
              </BootstrapTooltip>
            </ToggleButton>
            <ToggleButton
              value="general_conditions"
              aria-label="General conditions"
            >
              <BootstrapTooltip title="General conditions">
                <AssignmentOutlinedIcon />
              </BootstrapTooltip>
            </ToggleButton>
            {
              /*
              <ToggleButton value="gallery" aria-label="Gallery">
              <BootstrapTooltip title="Gallery">
                <PhotoLibrary />
              </BootstrapTooltip>
            </ToggleButton>
              */
            }
          </ToggleButtonGroup>
        </Hidden>
        <div style={{ flex: 1 }}></div>
        <Hidden smDown>
          <Button
            color="primary"
            className={classes.saveButton}
            disabled={isSaving}
            onClick={handleSaveClick}
          >
            {isSaving ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button
            className={classes.cancelButton}
            onClick={() => setCancelDialogOpen(true)}
          >
            Cancel
          </Button>
        </Hidden>
        <Hidden mdUp>
          <BootstrapTooltip title="Save">
            <IconButton
              color="default"
              aria-label="save"
              style={{ color: "#fff" }}
              onClick={handleSaveClick}
            >
              {isSaving ? (
                <CircularProgress style={{ color: "#fff" }} size={24} />
              ) : (
                <SaveIcon />
              )}
            </IconButton>
          </BootstrapTooltip>
          <BootstrapTooltip title="Cancel">
            <IconButton
              color="default"
              aria-label="close"
              style={{ color: "#fff" }}
              onClick={() => setCancelDialogOpen(true)}
            >
              <CloseIcon />
            </IconButton>
          </BootstrapTooltip>
        </Hidden>
        <BootstrapTooltip title="Export Reports">
          <IconButton
            color="default"
            aria-label="export"
            style={{ color: "#fff" }}
            onClick={handleExportButtonClick}
          >
            <GetAppIcon />
          </IconButton>
        </BootstrapTooltip>
        <Menu
          id="export-menu"
          anchorEl={anchorExportElement}
          keepMounted
          open={Boolean(anchorExportElement)}
          onClose={handleExportMenuClose}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleExportPDF}>Drawing Report</MenuItem>
          <MenuItem onClick={handleExportRoofPDF}>Roof Detail Report</MenuItem>
          <Divider />
          <MenuItem onClick={handleExportCSV}>
            <CSVLink
              data={csvData}
              filename={"Report.csv"}
              className={classes.csvLink}
            >
              Export CSV
            </CSVLink>
          </MenuItem>
        </Menu>
      </Grid>

      <Backdrop className={classes.backdrop} open={exportProgressOpen}>
        <CircularProgress color="primary" />
      </Backdrop>

      <Dialog
        className={classes.dialog}
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogContent>
          <Grid
            container
            direction="column"
            alignItems="center"
            className={classes.dialogMessage}
          >
            <div>You haven't saved the changes yet.</div>
            <div>Are you sure you want to cancel?</div>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Link to={`/Projects`} style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  color="default"
                  className={classes.dlgCancelButton}
                  //onClick={()=>history.push('/Projects')}
                >
                  Do not Save
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.dlgOkButton}
                onClick={() => setSaveExit(true)}
              >
                Save and exit
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}

const mapStateToProps = (state) => {
  const { token } = state;
  return { token };
};

const mapDispatchToProps = { removeToken };
Header.propTypes = {
  classes: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Header);

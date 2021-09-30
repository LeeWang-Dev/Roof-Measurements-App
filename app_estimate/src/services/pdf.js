import { jsPDF } from "jspdf";
import Numeral from "numeral";

import imgLogo from "../assets/images/logo-512.png";
import imgLogoIcon from "../assets/images/logo-icon-64.png";
import { SITE_URL, edges, pitches } from "../utils/constants";
//service
import { getPrintMapImage } from "./images";
import "../utils/fonts/calibri-normal";

let titleColor = "#000000";
let subTitleColor = "#000000";
let headColor = "#575656";
let itemsColor = "#676767";

var font = "AAEAAAAWAQQAAB...==";

const characters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

const subsetData = async (type) => {
  if (
    [
      "Counter Flashing",
      "Edge Metal Termination",
      "Coping",
      "Expansion Joints",
    ].includes(type)
  ) {
    return true;
  } else {
    return false;
  }
};

var callAddFont = function () {
  this.addFileToVFS("calibri-normal.ttf", font);
  this.addFont("calibri-normal.ttf", "calibri", "normal");
};

jsPDF.API.events.push(["addFonts", callAddFont]);

export let roofPDF = async (map, setPrintValue, drawLayers, data) => {
  var inf = {
    address: data["basicInformation"]["address"],
    totalArea: 0,
    totalFacets: 0,
  };
  for (let key in edges) {
    inf[key] = 0;
  }
  for (let key in pitches) {
    inf[key] = 0;
  }
  for (let layerKey in drawLayers) {
    for (let key in drawLayers[layerKey]["facets"]) {
      inf["totalFacets"] += 1;
      inf["totalArea"] += drawLayers[layerKey]["facets"][key].sqft_pitch;
      var pitch = drawLayers[layerKey]["facets"][key].pitch;
      if (pitch != null) {
        inf[pitch] += drawLayers[layerKey]["facets"][key].sqft_pitch;
      }
    }
    for (let key in drawLayers[layerKey]["edges"]) {
      var edgeKey = drawLayers[layerKey]["edges"][key].edgeKey;
      inf[edgeKey] += drawLayers[layerKey]["edges"][key].length_ft;
    }
  }
  if (inf["totalArea"] === 0) return;

  var doc = new jsPDF("p", "pt", "a4");
  //a4 595.28, 841.89
  var pageWidth = doc.internal.pageSize.width,
    pageHeight = doc.internal.pageSize.height;
  var marginLeft = 40,
    marginRight = 40,
    marginTop = 95,
    marginBottom = 30;
  let pageSizeHeight = 670;

  var y1 = 500;
  // page-1 roof diagram on satellite map
  doc.addImage(
    imgLogo,
    "JPEG",
    pageWidth / 2 - 96,
    marginTop - 45,
    192,
    64,
    "",
    "FAST"
  );
  var imgWidth = pageWidth - (marginLeft + marginRight);
  var imgHeight = (imgWidth * map.getCanvas().height) / map.getCanvas().width;
  var img = await getPrintMapImage("ALL", setPrintValue, map);

  doc.setFont("calibri", "normal");
  doc.addImage(img, "JPEG", marginLeft, 200, imgWidth, imgHeight);
  doc.setFontSize(18);
  doc.setTextColor("#404dff");
  doc.text("Roof Report", marginLeft, y1 + 20);

  doc.setTextColor("#555");
  doc.setFontSize(11);
  doc.text(inf["address"], marginLeft, y1 + 40);
  doc.text(
    `${Numeral(inf["totalArea"]).format("0,0.00")} sqft`,
    marginLeft,
    y1 + 60
  );
  doc.text(
    `${inf["totalFacets"]} ${inf["totalFacets"] > 1 ? "facets" : "facet"}`,
    marginLeft,
    y1 + 80
  );

  var y = marginTop;
  var marginLeftItem = marginLeft + 20;
  var conList = data["generalConditions"]["roofComposition"] ?? [];

  if (conList.length > 0) {
    //Roboto
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setTextColor(titleColor);
    doc.setFontSize(18);
    doc.text("General conditions", marginLeft, y);
    doc.setDrawColor("#404dff");
    doc.setLineWidth(2.5);
    doc.line(300, y - 5, 560, y - 5);

    doc.setFont("calibri", "normal");
    await Promise.all(
      conList.map(async (i, index) => {
        if (y > pageSizeHeight) {
          y = marginTop;
          doc.addPage();
        } else {
          y = y + 40;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(subTitleColor);
        doc.text("CORE " + characters[index], marginLeftItem, y);

        doc.setFont("calibri", "normal");
        doc.setFontSize(9);
        var roofN = i["roofNumbers"] ?? [];
        if (roofN.length > 0) {
          await Promise.all(
            roofN.map(async (r, indexItem) => {
              if (y > pageSizeHeight) {
                y = marginTop;
                doc.addPage();
              } else {
                y = y + 15;
              }
              doc.setDrawColor("#D9D9D9");
              doc.setLineWidth(0.4);
              doc.line(marginLeft, y, 560, y);

              y = y + 20;
              doc.setTextColor("#404dff");
              doc.text(
                "ROOFS NUMBER " + (indexItem + 1).toString(),
                marginLeftItem + 400,
                y
              );

              y = y + 20;
              doc.setFillColor("#F3F3F3");
              doc.rect(marginLeft, y - 10, 520, 30, "F");

              y = y + 10;
              doc.setTextColor(headColor);
              doc.text("ROOF TYPE", marginLeftItem, y);
              doc.text("THICKNESS", marginLeftItem + 130, y);
              doc.text("ATTACHMENT", marginLeftItem + 260, y);
              doc.text("INSULATION TYPE", marginLeftItem + 400, y);
              doc.setTextColor(itemsColor);

              y = y + 30;
              var surfacingt = doc.splitTextToSize(
                r["surfacingType"] ?? "",
                125
              );
              doc.text(surfacingt, marginLeftItem, y);
              var thickness = doc.splitTextToSize(
                r["surfacingTypeThickness"] ?? "",
                125
              );
              doc.text(thickness, marginLeftItem + 130, y);
              doc.text(r["attachment"], marginLeftItem + 260, y);
              var insulation = doc.splitTextToSize(r["insulationType_1"], 125);
              doc.text(insulation, marginLeftItem + 400, y);
            })
          );
        }
      })
    );
  }

  var roofSlope = data["roofSlope"] ?? null;
  y = y + 50;

  if (roofSlope != null) {
    if (y > pageSizeHeight) {
      doc.addPage();
      y = marginTop;
    }
    doc.setFont("helvetica", "bold");
    doc.setTextColor(titleColor);
    doc.setFontSize(18);
    doc.text("Roof Slope", marginLeft, y);
    doc.setDrawColor("#404dff");
    doc.setLineWidth(2.5);
    doc.line(300, y - 5, 560, y - 5);

    y = y + 40;

    doc.setFontSize(9);
    doc.setFont("calibri", "normal");

    doc.setFillColor("#F3F3F3");
    doc.rect(marginLeft, y - 10, 520, 30, "F");

    y = y + 10;
    doc.setTextColor(headColor);
    doc.text("SLOPE DEFINITION", marginLeftItem, y);
    doc.text("LOW SLOPE ROOFS SLOPE", marginLeftItem + 260, y);

    y = y + 30;
    doc.setTextColor(itemsColor);
    doc.text(roofSlope["slopeDefinition"], marginLeftItem, y);
    doc.text(roofSlope["slopeValue"], marginLeftItem + 260, y);
  }

  var roofDrainage = data["roofDrainage"]["drainageItems"] ?? [];

  y = y + 50;
  if (roofDrainage.length > 0) {
    //Roboto
    if (y > pageSizeHeight) {
      doc.addPage();
      y = marginTop;
    }
    doc.setFont("helvetica", "bold");
    doc.setTextColor(titleColor);
    doc.setFontSize(18);
    doc.text("Roof Drainage", marginLeft, y);
    doc.setDrawColor("#404dff");
    doc.setLineWidth(2.5);
    doc.line(300, y - 5, 560, y - 5);

    await Promise.all(
      roofDrainage.map(async (i, index) => {
        if (y > pageSizeHeight) {
          doc.addPage();
          y = marginTop;
        } else {
          y = y + 40;
        }
        doc.setFontSize(11);
        doc.setFont("calibri", "normal");
        doc.setTextColor(subTitleColor);
        doc.text(i["drainageType"].toUpperCase() ?? "", marginLeftItem, y);
        doc.text(
          data["roofDrainage"]["drainageRating"].toUpperCase() ?? "",
          500,
          y
        );
        doc.setFontSize(9);

        var roofN = i["items"] ?? [];
        if (roofN.length > 0) {
          await Promise.all(
            roofN.map(async (r, indexItem) => {
              if (y > pageSizeHeight) {
                doc.addPage();
                y = marginTop;
              } else {
                y = y + 15;
              }
              doc.setDrawColor("#D9D9D9");
              doc.setLineWidth(0.4);
              doc.line(marginLeft, y, 560, y);

              y = y + 20;
              doc.setTextColor("#404dff");
              doc.text(
                "INTERNAL DRAINS " + (indexItem + 1).toString(),
                marginLeftItem + 400,
                y
              );

              y = y + 20;
              doc.setFillColor("#F3F3F3");
              doc.rect(marginLeft, y - 10, 520, 30, "F");

              y = y + 10;
              doc.setTextColor(headColor);
              var dimensions =
                r["dimensions"] != null || r["dimensions"] !== undefined
                  ? r["dimensions"]
                  : [];

              const dimensionsKeys = Object.keys(dimensions);
              let marginItem = marginLeftItem + 55;
              let keys = dimensionsKeys.length - 1;

              for (let key = 0; key < dimensionsKeys.length; key++) {
                doc.text(dimensionsKeys[key], marginItem, y);

                if (dimensionsKeys.length > 0 && key < keys) {
                  marginItem = marginItem + dimensionsKeys[key].length + 5;
                  doc.text("-", marginItem, y);
                  marginItem = marginItem + 5;
                }
              }
              doc.text("DIMENSIONS", marginLeftItem, y);
              doc.text("SIZE", marginLeftItem + 130, y);
              doc.text("MATERIAL", marginLeftItem + 260, y);
              doc.text("TYPE", marginLeftItem + 400, y);

              y = y + 30;

              doc.setTextColor(itemsColor);
              var size =
                r["size"] != null || r["size"] !== undefined ? r["size"] : "";
              var material =
                r["material"] != null || r["material"] !== undefined
                  ? r["material"]
                  : "";
              var type =
                r["type"] != null || r["type"] !== undefined ? r["type"] : "";

              const dimensionsValues = Object.values(dimensions);
              let marginValue = marginLeftItem;
              let values = dimensionsValues.length - 1;

              for (let value = 0; value < dimensionsValues.length; value++) {
                doc.text(dimensionsValues[value], marginValue, y);

                if (dimensionsValues.length > 0 && value < values) {
                  marginValue =
                    marginValue + dimensionsValues[value].length + 8;
                  doc.text("-", marginValue, y);
                  marginValue = marginValue + 5;
                }
              }
              doc.text(size, marginLeftItem + 130, y);
              doc.text(material, marginLeftItem + 260, y);
              doc.text(type, marginLeftItem + 400, y);
            })
          );
        }
      })
    );
  }

  var wallDetails = data["wallDetails"]["wallProperties"] ?? [];

  y = y + 50;

  if (wallDetails.length > 0) {
    if (y > pageSizeHeight) {
      doc.addPage();
      y = marginTop;
    }
    //Roboto
    doc.setFont("helvetica", "bold");
    doc.setTextColor(titleColor);
    doc.setFontSize(18);
    doc.text("Wall Details", marginLeft, y);
    doc.setDrawColor("#404dff");
    doc.setLineWidth(2.5);
    doc.line(300, y - 5, 560, y - 5);

    y = y + 40;
    doc.setFontSize(11);
    doc.setTextColor(subTitleColor);
    doc.text("wood".toUpperCase(), marginLeftItem, y);
    doc.text(
      data["wallDetails"]["parapetWallInformation"].toUpperCase() ?? "",
      500,
      y
    );
    doc.setFontSize(9);
    doc.setFont("calibri", "normal");

    await Promise.all(
      wallDetails.map(async (i, index) => {
        if (y > pageSizeHeight) {
          doc.addPage();
          y = marginTop;
        } else {
          y = y + 15;
        }
        doc.setDrawColor("#D9D9D9");
        doc.setLineWidth(0.4);
        doc.line(marginLeft, y, 560, y);

        y = y + 20;
        doc.setTextColor("#404dff");
        doc.text(
          "WALL " + characters[index] + " PROPERTIES",
          marginLeftItem + 400,
          y
        );

        y = y + 20;
        doc.setFillColor("#F3F3F3");
        doc.rect(marginLeft, y - 10, 520, 30, "F");

        y = y + 10;
        doc.setTextColor(headColor);
        doc.text("STUCCO", marginLeftItem, y);
        doc.text("WALL HEIGHT", marginLeftItem + 90, y);
        doc.text("WALL THICKNESS", marginLeftItem + 190, y);
        doc.text("FLASHING HEIGHT", marginLeftItem + 290, y);
        doc.text("WOOD-NAILER", marginLeftItem + 400, y);

        y = y + 30;
        doc.setTextColor(itemsColor);
        var stucco =
          data["wallDetails"]["stucco"] != null ||
          data["wallDetails"]["stucco"] !== undefined
            ? data["wallDetails"]["stucco"]
            : "";
        var wallHeight =
          i["wallHeight"] != null || i["wallHeight"] !== undefined
            ? i["wallHeight"]
            : "";
        var wallThickness =
          i["wallThickness"] != null || i["wallThickness"] !== undefined
            ? i["wallThickness"]
            : "";
        var wallFlashingHeight =
          i["wallFlashingHeight"] != null ||
          i["wallFlashingHeight"] !== undefined
            ? i["wallFlashingHeight"]
            : "";
        var woodNailer =
          i["woodNailer"] != null || i["woodNailer"] !== undefined
            ? i["woodNailer"]
            : "";

        var splisWall = doc.splitTextToSize(stucco, 87);

        doc.text(splisWall, marginLeftItem, y);
        doc.text(wallHeight, marginLeftItem + 90, y);
        doc.text(wallThickness, marginLeftItem + 190, y);
        doc.text(wallFlashingHeight, marginLeftItem + 290, y);
        doc.text(woodNailer, marginLeftItem + 400, y);
      })
    );
  }

  var roofDetails = data["roofDetails"] ?? [];

  y = y + 50;
  if (roofDetails.length > 0) {
    if (y > pageSizeHeight) {
      doc.addPage();
      y = marginTop;
    }
    //Roboto
    doc.setFont("helvetica", "bold");
    doc.setTextColor(titleColor);
    doc.setFontSize(18);
    doc.text("Roof Details", marginLeft, y);
    doc.setDrawColor("#404dff");
    doc.setLineWidth(2.5);
    doc.line(300, y - 5, 560, y - 5);

    doc.setFont("calibri", "normal");

    await Promise.all(
      roofDetails.map(async (i, index) => {
        if (y > pageSizeHeight) {
          doc.addPage();
          y = marginTop;
        } else {
          y = y + 40;
        }
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(subTitleColor);
        doc.text(
          i["metalTerminationFlashingsType"].toUpperCase(),
          marginLeftItem,
          y
        );
        doc.setFontSize(9);
        doc.setFont("calibri", "normal");

        y = y + 20;
        doc.setFillColor("#F3F3F3");
        doc.rect(marginLeft, y - 10, 520, 30, "F");

        var type = doc.splitTextToSize(i["type"] ?? "", 125);
        var material = doc.splitTextToSize(i["materialType"] ?? "", 125);
        var dimensions =
          i["dimensions"] != null || i["dimensions"] !== undefined
            ? i["dimensions"]
            : null;

        const dimensionsValues = Object.values(dimensions);

        switch (i["metalTerminationFlashingsType"]) {
          case "Coping":
            y = y + 10;
            doc.setTextColor(headColor);
            doc.text("SIZE / STRECH OUT", marginLeftItem, y);
            doc.text("MATERIAL TYPE", marginLeftItem + 130, y);

            const dimensionsKeys = Object.keys(dimensions) ?? [];

            if (dimensionsKeys.length > 0) {
              let marginItem = marginLeftItem + 320;
              let keys = dimensionsKeys.length - 1;

              for (let key = 0; key < dimensionsKeys.length; key++) {
                doc.text(dimensionsKeys[key], marginItem, y);

                if (dimensionsKeys.length > 0 && key < keys) {
                  marginItem = marginItem + dimensionsKeys[key].length + 8;
                  doc.text("-", marginItem, y);
                  marginItem = marginItem + 5;
                }
              }
            }
            doc.text("DIMENSIONS ", marginLeftItem + 260, y);

            y = y + 30;
            doc.setTextColor(itemsColor);
            doc.text(i["size"] ?? "", marginLeftItem, y);
            doc.text(material, marginLeftItem + 130, y);

            if (dimensionsValues.length > 0) {
              let marginValue = marginLeftItem + 260;
              let values = dimensionsValues.length - 1;

              for (let value = 0; value < dimensionsValues.length; value++) {
                doc.text(dimensionsValues[value], marginValue, y);

                if (dimensionsValues.length > 0 && value < values) {
                  marginValue =
                    marginValue + dimensionsValues[value].length + 8;
                  doc.text("-", marginValue, y);
                  marginValue = marginValue + 5;
                }
              }
            }
            break;
          default:
            y = y + 10;
            doc.setTextColor(headColor);
            doc.text("SUBSET", marginLeftItem, y);
            doc.text("SIZE", marginLeftItem + 130, y);
            doc.text("MATERIAL TYPE", marginLeftItem + 260, y);

            doc.text("DIMENSIONS", marginLeftItem + 400, y);

            y = y + 30;
            doc.setTextColor(itemsColor);
            doc.text(type, marginLeftItem, y);
            doc.text(i["size"] ?? "", marginLeftItem + 130, y);
            doc.text(material, marginLeftItem + 260, y);
            if (dimensionsValues.length > 0) {
              let marginValue = marginLeftItem + 400;
              let values = dimensionsValues.length - 1;

              for (let value = 0; value < dimensionsValues.length; value++) {
                doc.text(dimensionsValues[value], marginValue, y);

                if (dimensionsValues.length > 0 && value < values) {
                  marginValue =
                    marginValue + dimensionsValues[value].length + 8;
                  doc.text("-", marginValue, y);
                  marginValue = marginValue + 5;
                }
              }
            }
            break;
        }
      })
    );
  }

  // add page header/footers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 0; i < pageCount; i++) {
    doc.setPage(i + 1);
    doc.setTextColor("#555");
    doc.setFontSize(11);

    if (i > 0) {
      doc.addImage(
        imgLogoIcon,
        "JPEG",
        marginLeft,
        marginTop / 2,
        24,
        24,
        "",
        "FAST"
      );
    }
    doc.text(
      `Copyright © 2021 ${SITE_URL} | All rights reserved.`,
      marginLeft,
      pageHeight - marginBottom
    );
    doc.text(
      "Page " + String(i + 1) + " of " + String(pageCount),
      pageWidth - marginRight,
      pageHeight - marginBottom,
      "right"
    );
  }

  setPrintValue("Default");

  doc.save("Report.pdf");
};

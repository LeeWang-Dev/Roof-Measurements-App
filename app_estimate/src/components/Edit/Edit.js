import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { connect } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import axios from "axios";
import { removeToken } from "../../redux/actions/token";
import {
  BASE_URL,
  initialOptions,
  initialUploadFiles,
} from "../../utils/constants";

import Header from "./Header";
import Map from "./Map";
import Legend from "./Legend";
import Layers from "./Layers";
import DrawTools from "./DrawTools";
import EdgeTools from "./EdgeTools";
import FacetTools from "./FacetTools";
import Controls from "./Controls";
import ProjectInformation from "./ProjectInformation";
import GeneralConditions from "./GeneralConditions/Main";
import Gallery from "../gallery/Gallery";

const styles = (theme) => ({
  container: {
    width: "100vw",
    height: "100vh",
    padding: 0,
    boxSizing: "border-box",
    overflowX: "hidden",
    overflowY: "auto",
  },
  content: {
    position: "relative",
    flex: 1,
    padding: 0,
  },
});

function Edit(props) {
  const { classes, token, removeToken, match } = props;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const [mID, setMID] = useState(null);
  const [map, setMap] = useState(null);
  const [viewport, setViewport] = useState(null);
  const [mouseCursor, setMouseCursor] = useState("default");
  const [drawLayers, setDrawLayers] = useState({});
  const [layers, setLayers] = useState([]);
  const [layerValue, setLayerValue] = useState(null);
  const [editTabValue, setEditTabValue] = useState("draw");
  const [drawValue, setDrawValue] = useState(null);
  const [edgeValue, setEdgeValue] = useState(null);
  const [pitchValue, setPitchValue] = useState(null);

  const [selectedEdges, setSelectedEdges] = useState([]);
  const [selectedFacets, setSelectedFacets] = useState([]);

  const [gridSelected, setGridSelected] = useState(false);
  const [crossSelected, setCrossSelected] = useState(true);
  const [snapSelected, setSnapSelected] = useState(true);
  const [showBaseMap, setShowBaseMap] = useState(true);

  const [drawSteps, setDrawSteps] = useState([]);
  const [printValue, setPrintValue] = useState("Default");

  const [options, setOptions] = useState(initialOptions);
  const [uploadFiles, setUploadFiles] = useState(initialUploadFiles);

  const addDrawStep = (data) => {
    const UNDOMAXCOUNT = 20;
    if (drawSteps.length >= UNDOMAXCOUNT) {
      drawSteps.shift();
    }
    setDrawSteps([
      ...drawSteps,
      {
        drawLayers: JSON.parse(JSON.stringify(data)),
        layer: layerValue,
        viewport: {
          logitude: viewport.longitude,
          latitude: viewport.latitude,
          zoom: viewport.zoom,
          bearing: viewport.bearing,
        },
      },
    ]);
  };

  useEffect(() => {
    if (
      match.params["name"] &&
      match.params["address"] &&
      match.params["type"]
    ) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      // let newOptions = {...options};
      let newOptions = JSON.parse(JSON.stringify(initialOptions));
      if (urlParams.has("lat") && urlParams.has("lng")) {
        setViewport({
          latitude: parseFloat(urlParams.get("lat")),
          longitude: parseFloat(urlParams.get("lng")),
          zoom: 18,
        });
        newOptions["basicInformation"]["location"] = {
          lat: parseFloat(urlParams.get("lat")),
          lng: parseFloat(urlParams.get("lng")),
        };
      }
      newOptions["basicInformation"]["projectName"] = decodeURIComponent(
        match.params["name"]
      );
      newOptions["basicInformation"]["address"] = decodeURIComponent(
        match.params["address"]
      );
      newOptions["basicInformation"]["projectType"] = decodeURIComponent(
        match.params["type"]
      );
      if (urlParams.has("city")) {
        newOptions["basicInformation"]["city"] = decodeURIComponent(
          urlParams.get("city")
        );
      }
      if (urlParams.has("state")) {
        newOptions["basicInformation"]["state"] = decodeURIComponent(
          urlParams.get("state")
        );
      }
      if (urlParams.has("zipCode")) {
        newOptions["basicInformation"]["zipCode"] = decodeURIComponent(
          urlParams.get("zipCode")
        );
      }
      setOptions(newOptions);
      setUploadFiles(JSON.parse(JSON.stringify(initialUploadFiles)));
      setDrawLayers({ A: { edges: {}, facets: {}, vertexes: {} } });
      setLayers(["A"]);
      setLayerValue("A");
    } else if (match.params["id"]) {
      axios
        .get(`${BASE_URL}/api/measurement/${match.params["id"]}`)
        .then(function (response) {
          if (response.data.status === "success") {
            var results = response.data.results[0];
            var location = JSON.parse(results["location"]);
            var geodata = JSON.parse(results["geodata"]);
            var responseOptions = JSON.parse(results["options"]);
            setViewport({
              longitude: location[0],
              latitude: location[1],
              zoom: results["zoom"],
              bearing: results["bearing"],
            });
            setDrawLayers(geodata);
            setLayers(Object.keys(geodata));
            setLayerValue(Object.keys(geodata)[0]);
            setMID(match.params["id"]);
            setDrawSteps([
              ...drawSteps,
              {
                drawLayers: geodata,
                layer: Object.keys(geodata)[0],
                viewport: {
                  longitude: location[0],
                  latitude: location[1],
                  zoom: results["zoom"],
                  bearing: results["bearing"],
                },
              },
            ]);
            responseOptions["basicInformation"]["projectName"] =
              results["project_name"];
            setOptions(responseOptions);
            var newUploadFiles = {
              generalConditions: {
                files: responseOptions["generalConditions"].images.map(
                  (filename) => null
                ),
                images: responseOptions["generalConditions"].images.map(
                  (filename) => {
                    //var timestamp = new Date().getTime();
                    //return `${BASE_URL}/images/${match.params["id"]}/${filename}?${timestamp}`;
                    return `${BASE_URL}/images/${match.params["id"]}/${filename}`;
                  }
                ),
              },
              roofDrainage: responseOptions["roofDrainage"][
                "drainageItems"
              ].map((drainageItem, index) => {
                return drainageItem.items.map((item, idx) => {
                  return {
                    files: item["images"].map((filename) => null),
                    images: item["images"].map((filename) => {
                      return `${BASE_URL}/images/${match.params["id"]}/${filename}`;
                    }),
                  };
                });
              }),
              wallDetails: responseOptions["wallDetails"]["wallProperties"].map(
                (item, index) => {
                  return {
                    files: item["images"].map((filename) => null),
                    images: item["images"].map((filename) => {
                      return `${BASE_URL}/images/${match.params["id"]}/${filename}`;
                    }),
                  };
                }
              ),
              roofDetails: responseOptions["roofDetails"].map((item, index) => {
                return {
                  files: item["images"].map((filename) => null),
                  images: item["images"].map((filename) => {
                    return `${BASE_URL}/images/${match.params["id"]}/${filename}`;
                  }),
                };
              }),
            };
            setUploadFiles(newUploadFiles);
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
    }
  }, []);

  return (
    <Grid
      className={classes.container}
      container
      direction="column"
      wrap="nowrap"
    >
      <Header
        mID={mID}
        setMID={setMID}
        map={map}
        viewport={viewport}
        setViewport={setViewport}
        drawLayers={drawLayers}
        setDrawLayers={setDrawLayers}
        editTabValue={editTabValue}
        setEditTabValue={setEditTabValue}
        setDrawValue={setDrawValue}
        layerValue={layerValue}
        drawSteps={drawSteps}
        addDrawStep={addDrawStep}
        setSelectedEdges={setSelectedEdges}
        setSelectedFacets={setSelectedFacets}
        setPrintValue={setPrintValue}
        options={options}
        uploadFiles={uploadFiles}
      />
      <div className={classes.content}>
          <Map
            setMap={setMap}
            viewport={viewport}
            setViewport={setViewport}
            projectType={options["basicInformation"]["projectType"]}
            location={options["basicInformation"]["location"]}
            address={options["basicInformation"]["address"]}
            drawLayers={drawLayers}
            setDrawLayers={setDrawLayers}
            layerValue={layerValue}
            mouseCursor={mouseCursor}
            setMouseCursor={setMouseCursor}
            editTabValue={editTabValue}
            drawValue={drawValue}
            edgeValue={edgeValue}
            pitchValue={pitchValue}
            gridSelected={gridSelected}
            crossSelected={crossSelected}
            snapSelected={snapSelected}
            showBaseMap={showBaseMap}
            addDrawStep={addDrawStep}
            printValue={printValue}
            selectedEdges={selectedEdges}
            setSelectedEdges={setSelectedEdges}
            selectedFacets={selectedFacets}
            setSelectedFacets={setSelectedFacets}
          />
          {options["basicInformation"]["projectType"] === "Low Slope Roofs" && (
            <Legend drawLayers={drawLayers} layerValue={layerValue} />
          )}
          <Layers
            projectType={options["basicInformation"]["projectType"]}
            drawLayers={drawLayers}
            setDrawLayers={setDrawLayers}
            layers={layers}
            setLayers={setLayers}
            layerValue={layerValue}
            setLayerValue={setLayerValue}
          />
          <Controls
            viewport={viewport}
            setViewport={setViewport}
            gridSelected={gridSelected}
            setGridSelected={setGridSelected}
            crossSelected={crossSelected}
            setCrossSelected={setCrossSelected}
            snapSelected={snapSelected}
            setSnapSelected={setSnapSelected}
            showBaseMap={showBaseMap}
            setShowBaseMap={setShowBaseMap}
            drawLayers={drawLayers}
            setDrawLayers={setDrawLayers}
            setLayers={setLayers}
            setLayerValue={setLayerValue}
            setDrawValue={setDrawValue}
            drawSteps={drawSteps}
          />
          {editTabValue === "draw" && (
            <DrawTools
              drawLayers={drawLayers}
              setDrawLayers={setDrawLayers}
              layerValue={layerValue}
              drawValue={drawValue}
              setDrawValue={setDrawValue}
              setMouseCursor={setMouseCursor}
              selectedEdges={selectedEdges}
              setSelectedEdges={setSelectedEdges}
              addDrawStep={addDrawStep}
            />
          )}
          {editTabValue === "edges" && (
            <EdgeTools
              projectType={options["basicInformation"]["projectType"]}
              drawLayers={drawLayers}
              setDrawLayers={setDrawLayers}
              layerValue={layerValue}
              edgeValue={edgeValue}
              setEdgeValue={setEdgeValue}
              setMouseCursor={setMouseCursor}
              selectedEdges={selectedEdges}
              setSelectedEdges={setSelectedEdges}
              addDrawStep={addDrawStep}
            />
          )}
          {editTabValue === "facets" && (
            <FacetTools
              projectType={options["basicInformation"]["projectType"]}
              drawLayers={drawLayers}
              setDrawLayers={setDrawLayers}
              layerValue={layerValue}
              pitchValue={pitchValue}
              setPitchValue={setPitchValue}
              selectedFacets={selectedFacets}
              setSelectedFacets={setSelectedFacets}
              setMouseCursor={setMouseCursor}
              addDrawStep={addDrawStep}
            />
          )}
          {editTabValue === "project_information" && (
            <ProjectInformation
              options={options}
              setOptions={setOptions}
              viewport={viewport}
              setViewport={setViewport}
            />
          )}
          {editTabValue === "general_conditions" && (
            <GeneralConditions
              options={options}
              setOptions={setOptions}
              uploadFiles={uploadFiles}
              setUploadFiles={setUploadFiles}
            />
          )}
          {editTabValue === "gallery" && (
            <Gallery
              options={options}
              setOptions={setOptions}
              projectId={mID}
            />
          )}
        </div>
    </Grid>
  );
}

const mapStateToProps = (state) => {
  const { token } = state;
  return { token };
};

const mapDispatchToProps = { removeToken };

Edit.propTypes = {
  classes: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Edit);

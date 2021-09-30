import React, { useState, useEffect, useRef, useMemo } from 'react';

import ReactMapGL, {NavigationControl, Source, Layer, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from "mapbox-gl";

import { withStyles } from '@material-ui/core/styles';
// import images
import imgRemoveCursor from '../../assets/images/remove.png';
import imgApplyCursor from '../../assets/images/apply.png';
import imgCancelCursor from '../../assets/images/cancel.png';
import imgMarker from '../../assets/images/marker.png';

import * as turf from '@turf/turf';
import { v4 as uuidv4 } from 'uuid';
import { MAPBOX_ACCESS_TOKEN, blankStyle, edges, selectedColor } from "../../utils/constants";
import { metersToFeetLabel } from "../../utils/util"

mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const styles = (theme) => ({
    mapContainer: {
        '& .mapboxgl-ctrl-logo': {
            display: 'none'
        }
    },
    markerLabel:{
       display:'flex',
       alignItems:'center',
       color:'#fff',
       fontSize:14,
       width:240,
       height:60,
       lineHeight:'14px'
    },
    compass:{
       bottom:80,
       left:24,
       '& .mapboxgl-ctrl-group':{
          borderRadius:'50%',
          border:'1px solid #dee7ee',
          boxShadow:'none'
       },
       '& .mapboxgl-ctrl-group button':{
          width:60,
          height:60,
       },
       '& .mapboxgl-ctrl button.mapboxgl-ctrl-compass .mapboxgl-ctrl-icon':{
           backgroundImage:`url("data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 29 29' xmlns='http://www.w3.org/2000/svg' fill='%23${'5c77ff'}'%3E%3Cpath d='M10.5 14l4-8 4 8h-8z'/%3E%3Cpath d='M10.5 16l4 8 4-8h-8z' fill='%23ccc'/%3E%3C/svg%3E")`,
           backgroundSize:'cover'
       },
       [theme.breakpoints.down('md')]: {
          bottom:60,
          left:10,
          '& .mapboxgl-ctrl-group button':{
            width:40,
            height:40
          }
        }
    },
    grid: {
        width: '100%',
        height: '100%',
        backgroundSize: '30px 30px',
        backgroundImage: 'linear-gradient(to right, grey 1px, transparent 1px),linear-gradient(to bottom, grey 1px, transparent 1px)'
    }
});

let newEdgeId = null, dragVertexId = null, dragStartPoint = null, dragEdgeIds = [], dragFacetIndexes = [];
const tolerance = 0.2 // meters

function Map(props) {
    const { classes, setMap, viewport, setViewport, projectType, location, address,
            drawLayers, setDrawLayers, layerValue, mouseCursor, setMouseCursor, 
            editTabValue, drawValue, edgeValue, pitchValue,
            gridSelected, crossSelected, snapSelected, showBaseMap,
            selectedEdges, setSelectedEdges, selectedFacets, setSelectedFacets,
            addDrawStep, printValue
          } = props;
    const mapRef = useRef();
    const [cursorPoint, setCursorPoint] = useState([0, 0]);
    const [dragPan, setDragPan] = useState(true);
    
    const [snapVertex, setSnapVertex] = useState(false);
    const [snapHorizontal, setSnapHorizontal] = useState(false);
    const [snapVertical, setSnapVertical] = useState(false);
    
    const [newEdgeDataSource, setNewEdgeDataSource] = useState(null);

    const handleMouseMove = (e) => {
        if (editTabValue === 'draw') {
            if (drawValue === 'draw') {
                //setMouseCursor('none');
                onMouseMoveDraw(e);
            } else if (drawValue === 'move_vertex') {
                //setMouseCursor('none');
                onMouseMoveVertex(e);
            } else if (drawValue === 'select_edges') {
                let findFeatures = mapRef.current.queryRenderedFeatures([[e.point[0] - 5, e.point[1] - 5], [e.point[0] + 5, e.point[1] + 5]]);
                let edgeFeatures = findFeatures.filter(feature => {
                    return feature.properties['layer'] === layerValue && feature.properties['type'] === 'edge';
                });
                if (edgeFeatures.length > 0) {
                    setMouseCursor('pointer');
                } else {
                    setMouseCursor('default');
                }
            } else if (drawValue === 'delete_edge') {
                let findFeatures = mapRef.current.queryRenderedFeatures([[e.point[0] - 5, e.point[1] - 5], [e.point[0] + 5, e.point[1] + 5]]);
                let edgeFeatures = findFeatures.filter(feature => {
                    return feature.properties['layer'] === layerValue && feature.properties['type'] === 'edge';
                });
                if (edgeFeatures.length > 0) {
                    setMouseCursor(`url(${imgRemoveCursor}) 12 12, auto`);
                } else {
                    setMouseCursor('default');
                }
            }
        } else if (editTabValue === 'edges') {
            if (edgeValue === null) {
                setMouseCursor('default');
            } else {
                let findFeatures = mapRef.current.queryRenderedFeatures([[e.point[0] - 5, e.point[1] - 5], [e.point[0] + 5, e.point[1] + 5]]);
                let edgeFeatures = findFeatures.filter(feature => {
                    return feature.properties['layer'] === layerValue && feature.properties['type'] === 'edge';
                });
                if (edgeFeatures.length > 0) {
                    if (edgeValue === 'select_edges'){
                        setMouseCursor('pointer');
                    } else if (edgeValue === 'delete_edge') {
                        setMouseCursor(`url(${imgRemoveCursor}) 12 12, auto`);
                    } else {
                        setMouseCursor(`url(${imgApplyCursor}) 12 12, auto`);
                    }
                } else {
                    setMouseCursor('default');
                }
            }
        } else if (editTabValue === 'facets') {
            if (pitchValue === null) {
                setMouseCursor('default');
            } else {
                let findFeatures = mapRef.current.queryRenderedFeatures(e.point, { layers: ['facets'] });
                let facetFeatures = findFeatures.filter(feature => {
                    return feature.properties['layer'] === layerValue;
                });
                if (facetFeatures.length > 0) {
                    if(pitchValue === 'select_facets'){
                        setMouseCursor('pointer');
                    } else if (pitchValue === 'delete_facet') {
                        setMouseCursor(`url(${imgRemoveCursor}) 12 12, auto`);
                    } else if (pitchValue === 'delete_pitch') {
                        setMouseCursor(`url(${imgCancelCursor}) 12 12, auto`);
                    } else {
                        setMouseCursor(`url(${imgApplyCursor}) 12 12, auto`);
                    }
                } else {
                    setMouseCursor('default');
                }
            }
        }
    };

    function onMouseMoveDraw(e) {
        let moveLngLat = e.lngLat;
        let cursor = getSnapCuror(e);
        // set cursor positions
        if (snapSelected) {
            moveLngLat = cursor.lngLat;
            // new snapping point
            setCursorPoint(cursor.point);
        } else {
            setCursorPoint(e.point);
        }
        if (newEdgeId && drawLayers[layerValue]['edges'][newEdgeId]) {
            var pt0 = drawLayers[layerValue]['edges'][newEdgeId].coordinates[0];
            var line = turf.lineString([pt0, moveLngLat]);
            var dist = turf.length(line, { units: 'kilometers' }) * 1000;
            setNewEdgeDataSource({
                "type": "FeatureCollection",
                "features": [{
                    'type':'Feature',
                    'geometry':{
                        'type':'LineString',
                        'coordinates':[pt0, moveLngLat]
                    },
                    'properties':{
                        'label': metersToFeetLabel(dist),
                    }
                }]
            });
        }else{
            setNewEdgeDataSource(null);
        }
    }

    function onMouseMoveVertex(e) {
        let moveLngLat = e.lngLat;
        let cursor = getSnapCuror(e);
        if (snapSelected) {
            moveLngLat = cursor.lngLat;
            setCursorPoint(cursor.point);
        } else {
            setCursorPoint(e.point);
        }
        updateDragVertex(moveLngLat);
    }

    function getSnapCuror(e) {
        let map = mapRef.current.getMap();
        let canvas = map.getCanvas();
        let w = canvas.width;
        let h = canvas.height;
        let newLngLat = e.lngLat;
        let newPoint = map.project(e.lngLat);
        if (crossSelected) {
            var findHorizontal = false, findVertical = false;
            setSnapVertex(false);
            setSnapHorizontal(false);
            setSnapVertical(false);
            //check vertex snapping
            // check center
            let findFeatures = mapRef.current.queryRenderedFeatures([[e.point[0] - 5, e.point[1] - 5], [e.point[0] + 5, e.point[1] + 5]], { layers: ['vertexes'] });
            let vertexFeatures = findFeatures.filter(feature => {
                return feature.properties['layer'] === layerValue;
            });
            if (vertexFeatures.length > 0) {
                newLngLat = vertexFeatures[0].geometry.coordinates;
                newPoint = map.project(newLngLat);
                setSnapVertex(true);
            } else {
                // check horizontal
                findFeatures = mapRef.current.queryRenderedFeatures([[0, e.point[1] - 5], [w, e.point[1] + 5]], { layers: ['vertexes'] });
                vertexFeatures = findFeatures.filter(feature => {
                    return feature.properties['layer'] === layerValue;
                });
                if (vertexFeatures.length > 0) {
                    let vertexPoint = map.project(vertexFeatures[0].geometry.coordinates);
                    newPoint = { x: e.point[0], y: vertexPoint.y };
                    newLngLat = map.unproject(newPoint).toArray();
                    findHorizontal = true;
                    setSnapHorizontal(true);
                }
                // check vertical
                findFeatures = mapRef.current.queryRenderedFeatures([[newPoint.x - 5, h], [newPoint.x + 5, 0]], { layers: ['vertexes'] });
                vertexFeatures = findFeatures.filter(feature => {
                    return feature.properties['layer'] === layerValue;
                });
                if (vertexFeatures.length > 0) {
                    let vertexPoint = map.project(vertexFeatures[0].geometry.coordinates);
                    newPoint = { x: vertexPoint.x, y: newPoint.y };
                    newLngLat = map.unproject(newPoint).toArray();
                    findVertical = true;
                    setSnapVertical(true);
                }
                //check edges snapping
                if (snapSelected) {
                    var pt = turf.point(newLngLat);
                    findFeatures = mapRef.current.queryRenderedFeatures([[newPoint.x - 5, newPoint.y - 5], [newPoint.x + 5, newPoint.y + 5]]);
                    let edgeFeatures = findFeatures.filter(feature => {
                        return feature.properties['layer'] === layerValue && feature.properties['type'] === 'edge';
                    });
                    if (edgeFeatures.length > 0) {
                        let line = turf.lineString(edgeFeatures[0].geometry.coordinates);
                        if (findHorizontal) {
                            let pt1 = map.unproject([0, newPoint.y]).toArray();
                            let pt2 = map.unproject([w, newPoint.y]).toArray();
                            let line1 = turf.lineString([pt1, pt2]);
                            let intersect = turf.lineIntersect(line, line1);
                            if (intersect.features.length > 0) {
                                let to = turf.point(intersect.features[0].geometry.coordinates);
                                let d = turf.distance(pt, to, { units: 'kilometers' }) * 1000;
                                if (d < tolerance) {
                                    newLngLat = intersect.features[0].geometry.coordinates;
                                    newPoint = map.project(newLngLat);
                                }
                            }
                        } else if (findVertical) {
                            let pt1 = map.unproject([newPoint.x, 0]).toArray();
                            let pt2 = map.unproject([newPoint.x, h]).toArray();
                            let line1 = turf.lineString([pt1, pt2]);
                            let intersect = turf.lineIntersect(line, line1);
                            if (intersect.features.length > 0) {
                                let to = turf.point(intersect.features[0].geometry.coordinates);
                                let d = turf.distance(pt, to, { units: 'kilometers' }) * 1000;
                                if (d < tolerance) {
                                    newLngLat = intersect.features[0].geometry.coordinates;
                                    newPoint = map.project(newLngLat);
                                }
                            }
                        } else {
                            let nearestPoint = turf.nearestPointOnLine(line, pt);
                            newLngLat = nearestPoint.geometry.coordinates;
                            newPoint = map.project(newLngLat);
                        }
                    }
                }
            }
        } else {
            if (snapSelected) {
                //check vertex snapping
                let findFeatures = mapRef.current.queryRenderedFeatures([[e.point[0] - 5, e.point[1] - 5], [e.point[0] + 5, e.point[1] + 5]], { layers: ['vertexes'] });
                let vertexFeatures = findFeatures.filter(feature => {
                    return feature.properties['layer'] === layerValue;
                });
                if (vertexFeatures.length > 0) {
                    newLngLat = vertexFeatures[0].geometry.coordinates;
                    newPoint = map.project(newLngLat);
                } else {
                    //check edges snapping
                    findFeatures = mapRef.current.queryRenderedFeatures([[e.point[0] - 5, e.point[1] - 5], [e.point[0] + 5, e.point[1] + 5]]);
                    let edgeFeatures = findFeatures.filter(feature => {
                        return feature.properties['layer'] === layerValue && feature.properties['type'] === 'edge';
                    });
                    if (edgeFeatures.length > 0) {
                        let pt = turf.point(e.lngLat);
                        let line = turf.lineString(edgeFeatures[0].geometry.coordinates)
                        let nearestPoint = turf.nearestPointOnLine(line, pt);
                        newLngLat = nearestPoint.geometry.coordinates;
                        newPoint = map.project(newLngLat);
                    }
                }
            }
        }
        let result = {
            lngLat: newLngLat,
            point: [newPoint.x, newPoint.y]
        };
        return result;
    }

    function updateDragVertex(moveLngLat) {
        if (dragVertexId && drawLayers[layerValue]['vertexes'][dragVertexId]) {
            let newDrawLayers = {...drawLayers};
            newDrawLayers[layerValue]['vertexes'][dragVertexId].coordinates = moveLngLat;
            dragEdgeIds.forEach(edgeId => {
                let path = newDrawLayers[layerValue]["edges"][edgeId].coordinates;
                if (newDrawLayers[layerValue]["edges"][edgeId].startVertexKey === dragVertexId) {
                    newDrawLayers[layerValue]["edges"][edgeId].coordinates = [moveLngLat, path[1]];
                } else {
                    drawLayers[layerValue]["edges"][edgeId].coordinates = [path[0], moveLngLat];
                }
                var line = turf.lineString(drawLayers[layerValue]["edges"][edgeId].coordinates);
                var dist = turf.length(line, { units: 'kilometers' }) * 1000;
                newDrawLayers[layerValue]["edges"][edgeId] = {
                    ...newDrawLayers[layerValue]["edges"][edgeId],
                    length_m: dist,
                    length_ft: dist * 100 / 2.54 / 12
                }
            });
            dragFacetIndexes.forEach(item => {
                let path = newDrawLayers[layerValue]["facets"][item.key].coordinates[0];
                var newPath = [];
                for (let i = 0; i < path.length; i++) {
                    if (i === item.index) {
                        newPath.push(moveLngLat);
                    } else {
                        newPath.push(path[i]);
                    }
                }
                newPath[newPath.length - 1] = newPath[0];
                var polygon = turf.polygon([newPath]);
                var center = turf.centerOfMass(polygon);
                var sqm = turf.area(polygon);
                var sqft = sqm * 10.76391041671; //sqft
                var sqft_pitch = sqft;
                var pv = newDrawLayers[layerValue]["facets"][item.key]['pitch'];
                if (pv) {
                    var pitchArray = pv.split("/");
                    sqft_pitch = sqft / Math.cos(Math.atan(parseInt(pitchArray[0]) / parseInt(pitchArray[1])));
                }
                newDrawLayers[layerValue]["facets"][item.key] = {
                    ...newDrawLayers[layerValue]["facets"][item.key],
                    coordinates: [newPath],
                    center: center.geometry.coordinates,
                    sqm: sqm,
                    sqft: sqft,
                    sqft_pitch: sqft_pitch,
                }
            });
            setDrawLayers(newDrawLayers);
        }
    }

    const handleMouseClick = (e) => {
        if (e.rightButton) {
            setSelectedEdges([]);
            setSelectedFacets([]);
            drawCancel();
            return;
        }
        if (editTabValue === 'draw' && drawValue != null) {
            if (drawValue === 'draw') {
                onMouseClickDraw(e);
            } else if (drawValue === 'select_edges') {
                let findFeatures = mapRef.current.queryRenderedFeatures([[e.point[0] - 5, e.point[1] - 5], [e.point[0] + 5, e.point[1] + 5]]);
                let edgeFeatures = findFeatures.filter(feature => {
                    return feature.properties['layer'] === layerValue && feature.properties['type'] === 'edge';
                });
                if (edgeFeatures.length > 0) {
                    let edgeKey = edgeFeatures[0].properties['id'];
                    if(selectedEdges.includes(edgeKey)){
                       let newSelectedEdges = selectedEdges.filter(item=>item !== edgeKey);
                       setSelectedEdges(newSelectedEdges);
                    }else{
                       setSelectedEdges([ ...selectedEdges, edgeKey ]);
                    }
                }else{
                    setSelectedEdges([]);
                }
            } else if (drawValue === 'delete_edge') {
                let findFeatures = mapRef.current.queryRenderedFeatures([[e.point[0] - 5, e.point[1] - 5], [e.point[0] + 5, e.point[1] + 5]]);
                let edgeFeatures = findFeatures.filter(feature => {
                    return feature.properties['layer'] === layerValue && feature.properties['type'] === 'edge';
                });
                if (edgeFeatures.length > 0) {
                    let edgeKey = edgeFeatures[0].properties['id'];
                    deleteEdge(edgeKey);
                }
            }
        } else if (editTabValue === 'edges' && edgeValue != null) {
            let findFeatures = mapRef.current.queryRenderedFeatures([[e.point[0] - 5, e.point[1] - 5], [e.point[0] + 5, e.point[1] + 5]]);
            let edgeFeatures = findFeatures.filter(feature => {
                return feature.properties['layer'] === layerValue && feature.properties['type'] === 'edge';
            });
            if (edgeFeatures.length > 0) {
                let edgeId = edgeFeatures[0].properties['id'];
                if(edgeValue === 'select_edges'){
                    if(selectedEdges.includes(edgeId)){
                       let newSelectedEdges = selectedEdges.filter(item=>item !== edgeId);
                       setSelectedEdges(newSelectedEdges);
                    }else{
                       setSelectedEdges([ ...selectedEdges, edgeId ]);
                    }
                }else if(edgeValue === 'edge_name' || edgeValue === 'adjust_length') {
                   setSelectedEdges([edgeId]);
                }else if (edgeValue === 'delete_edge') {
                   deleteEdge(edgeId);
                } else {
                   changeStyleEdge(edgeId, edgeValue);
                }
            }else{
                setSelectedEdges([]);
            }
        } else if (editTabValue === 'facets' && pitchValue != null) {
            let findFeatures = mapRef.current.queryRenderedFeatures(e.point, { layers: ['facets'] });
            let facetFeatures = findFeatures.filter(feature => {
                return feature.properties['layer'] === layerValue;
            });
            if (facetFeatures.length > 0) {
                var facetKey = facetFeatures[0].properties['id'];
                if(pitchValue === 'select_facets'){
                    if(selectedFacets.includes(facetKey)){
                        let newSelectedFacets = selectedFacets.filter(item=>item !== facetKey);
                        setSelectedFacets(newSelectedFacets);
                    }else{
                        setSelectedFacets([ ...selectedFacets, facetKey ]);
                    }
                } else if(pitchValue === 'facet_name'){
                    setSelectedFacets([facetKey]);
                }else{
                    onMouseClickFacet(facetKey, pitchValue);
                }
            }else{
                setSelectedFacets([]);
            }
        }
    }

    function onMouseClickDraw(e) {
        let point = e.point;
        let clickLngLat = e.lngLat;
        if (snapSelected) {
            let cursor = getSnapCuror(e);
            point = cursor.point;
            clickLngLat = cursor.lngLat;
        }
        let findFeatures = mapRef.current.queryRenderedFeatures([[point[0] - 5, point[1] - 5], [point[0] + 5, point[1] + 5]]);
        let vertexFeatures = findFeatures.filter(feature => {
            return feature.properties['layer'] === layerValue && feature.properties['type'] === 'vertex';
        });
        let edgeFeatures = findFeatures.filter(feature => {
            return feature.properties['layer'] === layerValue && feature.properties['type'] === 'edge' && feature.properties['id'] !== newEdgeId;
        });
        let newDrawLayers = {...drawLayers};
        if (newEdgeId) {
            newDrawLayers[layerValue]['edges'][newEdgeId].coordinates = [
                newDrawLayers[layerValue]['edges'][newEdgeId].coordinates[0],
                clickLngLat
            ];
             // check distance
            let path = newDrawLayers[layerValue]['edges'][newEdgeId].coordinates;
            var line = turf.lineString(path);
            var dist = turf.length(line, { units: 'kilometers' }) * 1000;
            if (dist < tolerance) return;
            newDrawLayers[layerValue]['edges'][newEdgeId] = {
                ...newDrawLayers[layerValue]['edges'][newEdgeId],
                'length_m': dist,
                'length_ft': dist * 100 / 2.54 / 12
            }
            // check overlapping, crossing
            for (let key in newDrawLayers[layerValue]["edges"]) {
                if (key === newEdgeId) continue;
                var polylinePath = newDrawLayers[layerValue]["edges"][key].coordinates;
                if (checkCrossing(path, polylinePath)) return;
            }

            // delete facets
            var pt1 = turf.point(path[0]);
            var pt2 = turf.point(path[path.length - 1]);
            for (let key in newDrawLayers[layerValue]["facets"]) {
                var polygon = turf.polygon(newDrawLayers[layerValue]["facets"][key].coordinates);
                var flag1 = turf.booleanPointInPolygon(pt1, polygon, { ignoreBoundary: false });
                var flag2 = turf.booleanPointInPolygon(pt2, polygon, { ignoreBoundary: false });
                if (flag1 && flag2) {
                    delete newDrawLayers[layerValue]["facets"][key];
                }
            }

            if (snapSelected && vertexFeatures.length > 0) {
                newDrawLayers[layerValue]['edges'][newEdgeId].coordinates = [path[0], vertexFeatures[0].geometry.coordinates];
                newDrawLayers[layerValue]["edges"][newEdgeId].endVertexKey = vertexFeatures[0].properties.id;
                newEdgeId = null;
                addDrawStep(newDrawLayers);
            } else {
                let newVertexKey = uuidv4();
                newDrawLayers[layerValue]['vertexes'][newVertexKey] = {
                    coordinates: clickLngLat
                };
                newDrawLayers[layerValue]["edges"][newEdgeId].endVertexKey = newVertexKey;
                addDrawStep(newDrawLayers);
                if (snapSelected && edgeFeatures.length > 0) {
                    newEdgeId = null;
                    // split polyline
                    let edgeId = edgeFeatures[0].properties.id;
                    splitEdge(edgeId, newVertexKey);
                } else {
                    newEdgeId = uuidv4();
                    newDrawLayers[layerValue]['edges'][newEdgeId] = {
                        coordinates: [clickLngLat, clickLngLat],
                        name: '',
                        length_m: 0,
                        length_ft: 0,
                        edgeKey: 'unspecified',
                        style: edges['unspecified'].style,
                        color: edges['unspecified'].color,
                        startVertexKey: newVertexKey,
                        endVertexKey: null
                    }
                }
            }
        } else {
            newEdgeId = uuidv4();
            newDrawLayers[layerValue]['edges'][newEdgeId] = {
                coordinates: [clickLngLat],
                name: '',
                length_m: 0,
                length_ft: 0,
                edgeKey: 'unspecified',
                style: edges['unspecified'].style,
                color: edges['unspecified'].color,
                startVertexKey: null,
                endVertexKey: null
            }
            if (snapSelected && vertexFeatures.length > 0) {
                var vertexKey = vertexFeatures[0].properties.id;
                newDrawLayers[layerValue]['edges'][newEdgeId].coordinates = [vertexFeatures[0].geometry.coordinates];
                newDrawLayers[layerValue]['edges'][newEdgeId].startVertexKey = vertexKey;
            } else {
                let newVertexKey = uuidv4();
                newDrawLayers[layerValue]['vertexes'][newVertexKey] = {
                    coordinates: clickLngLat
                };
                newDrawLayers[layerValue]['edges'][newEdgeId].startVertexKey = newVertexKey;
                if (snapSelected && edgeFeatures.length > 0) {
                    // split edge
                    let edgeId = edgeFeatures[0].properties.id;
                    splitEdge(edgeId, newVertexKey);
                }
            }
        }

        setDrawLayers(newDrawLayers);
    }

    function splitEdge(edgeId, vertexKey) {
        let newDrawLayers = {...drawLayers};
        var edgeName = newDrawLayers[layerValue]['edges'][edgeId].name;
        var startVertexKey = newDrawLayers[layerValue]['edges'][edgeId].startVertexKey;
        var endVertexKey = newDrawLayers[layerValue]['edges'][edgeId].endVertexKey;
        var edgeKey = newDrawLayers[layerValue]['edges'][edgeId].edgeKey;

        var p = newDrawLayers[layerValue]['vertexes'][vertexKey].coordinates;
        var p1 = newDrawLayers[layerValue]['vertexes'][startVertexKey].coordinates;
        var p2 = newDrawLayers[layerValue]['vertexes'][endVertexKey].coordinates;
        var path = newDrawLayers[layerValue]['edges'][edgeId].coordinates;
        var path1 = [p1, p];
        var path2 = [p, p2];

        // delete facets with split line
        var pt1 = turf.point(path[0]);
        var pt2 = turf.point(path[path.length - 1]);
        for (let key in newDrawLayers[layerValue]["facets"]) {
            var polygon = turf.polygon(newDrawLayers[layerValue]["facets"][key].coordinates);
            var flag1 = turf.booleanPointInPolygon(pt1, polygon, { ignoreBoundary: false });
            var flag2 = turf.booleanPointInPolygon(pt2, polygon, { ignoreBoundary: false });
            if (flag1 && flag2) {
                delete newDrawLayers[layerValue]["facets"][key];
            }
        }

        // delete old edge
        delete newDrawLayers[layerValue]['edges'][edgeId];

        var newEdgeId1 = uuidv4();
        var line1 = turf.lineString(path1);
        var dist1 = turf.length(line1, { units: 'kilometers' }) * 1000;
        newDrawLayers[layerValue]['edges'][newEdgeId1] = {
            coordinates: path1,
            name: edgeName,
            edgeKey: edgeKey,
            style: edges[edgeKey].style,
            color: edges[edgeKey].color,
            length_m: dist1,
            length_ft: dist1 * 100 / 2.54 / 12,
            startVertexKey: startVertexKey,
            endVertexKey: vertexKey
        }

        var newEdgeId2 = uuidv4();
        var line2 = turf.lineString(path2);
        var dist2 = turf.length(line2, { units: 'kilometers' }) * 1000;
        newDrawLayers[layerValue]['edges'][newEdgeId2] = {
            coordinates: path2,
            name: edgeName,
            edgeKey: edgeKey,
            style: edges[edgeKey].style,
            color: edges[edgeKey].color,
            length_m: dist2,
            length_ft: dist2 * 100 / 2.54 / 12,
            startVertexKey: vertexKey,
            endVertexKey: endVertexKey
        }
        setDrawLayers(newDrawLayers);
    }

    function deleteEdge(k) { // k = selectedEdgeKey
        let newDrawLayers = {...drawLayers};
        // delete facets
        var path = drawLayers[layerValue]["edges"][k].coordinates;
        var pt1 = turf.point(path[0]);
        var pt2 = turf.point(path[path.length - 1]);
        for (let key in newDrawLayers[layerValue]["facets"]) {
            var polygon = turf.polygon(newDrawLayers[layerValue]["facets"][key].coordinates);
            var flag1 = turf.booleanPointInPolygon(pt1, polygon, { ignoreBoundary: false });
            var flag2 = turf.booleanPointInPolygon(pt2, polygon, { ignoreBoundary: false });
            if (flag1 && flag2) {
                delete newDrawLayers[layerValue]["facets"][key];
            }
        }
        // delete vertexes
        var exsist = false;
        var key1 = newDrawLayers[layerValue]["edges"][k].startVertexKey;
        var key2 = newDrawLayers[layerValue]["edges"][k].endVertexKey;
        for (let key in newDrawLayers[layerValue]["edges"]) {
            if (key === k) continue;
            if (newDrawLayers[layerValue]["edges"][key].startVertexKey === key1 || newDrawLayers[layerValue]["edges"][key].endVertexKey === key1) {
                exsist = true;
                break;
            }
        }
        if (!exsist) {
            delete newDrawLayers[layerValue]["vertexes"][key1];
        }
        exsist = false;
        for (let key in newDrawLayers[layerValue]["edges"]) {
            if (key === k) continue;
            if (newDrawLayers[layerValue]["edges"][key].startVertexKey === key2 || newDrawLayers[layerValue]["edges"][key].endVertexKey === key2) {
                exsist = true;
                break;
            }
        }
        if (!exsist) {
            delete newDrawLayers[layerValue]["vertexes"][key2];
        }
        delete newDrawLayers[layerValue]["edges"][k];
        addDrawStep(newDrawLayers);
        setDrawLayers(newDrawLayers);
    }

    function changeStyleEdge(k, newValue) {
        let newDrawLayers = {...drawLayers};
        newDrawLayers[layerValue]["edges"][k]["edgeKey"] = newValue;
        newDrawLayers[layerValue]["edges"][k]["style"] = edges[newValue].style;
        newDrawLayers[layerValue]["edges"][k]["color"] = edges[newValue].color;

        addDrawStep(newDrawLayers);
        setDrawLayers(newDrawLayers);
    }

    function onMouseClickFacet(k, pv) {
        let newDrawLayers = {...drawLayers};
        var sqft = newDrawLayers[layerValue]["facets"][k]["sqft"];
        if (pv === 'delete_facet') {
            delete newDrawLayers[layerValue]["facets"][k];
        } else if (pv === 'delete_pitch') {
            newDrawLayers[layerValue]["facets"][k]["pitch"] = null;
            newDrawLayers[layerValue]["facets"][k]["sqft_pitch"] = sqft;
        } else {
            var pitchArray = pv.split("/");
            var sqft_pitch = sqft / Math.cos(Math.atan(parseInt(pitchArray[0]) / parseInt(pitchArray[1])));
            newDrawLayers[layerValue]["facets"][k]["pitch"] = pv;
            newDrawLayers[layerValue]["facets"][k]["sqft_pitch"] = sqft_pitch;
        }
        addDrawStep(newDrawLayers);
        setDrawLayers(newDrawLayers);
    }

    function handleMouseDown(e) {
        e.preventDefault();
        if (editTabValue !== 'draw' || drawValue !== 'move_vertex') return;
        var findFeatures = mapRef.current.queryRenderedFeatures([[e.point[0] - 5, e.point[1] - 5], [e.point[0] + 5, e.point[1] + 5]], { layers: ['vertexes'] });
        var vertexFeatures = findFeatures.filter(feature => {
            return feature.properties['layer'] === layerValue;
        });
        if (vertexFeatures.length === 0) return;
        // find edge features, find facet features from bound  not working correctly
        setDragPan(false);
        dragVertexId = vertexFeatures[0].properties.id;
        dragStartPoint = vertexFeatures[0].geometry.coordinates;
        dragEdgeIds = [];
        for (let key in drawLayers[layerValue]["edges"]) {
            if (drawLayers[layerValue]["edges"][key].startVertexKey === dragVertexId ||
                drawLayers[layerValue]["edges"][key].endVertexKey === dragVertexId) {
                dragEdgeIds.push(key);
            }
        }
        dragFacetIndexes = [];
        var pt = turf.point(vertexFeatures[0].geometry.coordinates);
        for (let key in drawLayers[layerValue]["facets"]) {
            let path = drawLayers[layerValue]["facets"][key].coordinates[0];
            for (let i = 0; i < path.length; i++) {
                var to = turf.point(path[i]);
                var d = turf.distance(pt, to, { units: 'kilometers' }) * 1000;
                if (d < tolerance) {
                    dragFacetIndexes.push({ key: key, index: i });
                    break;
                }
            }
        }
    }

    function handleMouseUp(e) {
        setDragPan(true);
        if (editTabValue === 'draw' && drawValue === 'move_vertex') {
            var flag = false;
            for (var i = 0; i < dragEdgeIds.length; i++) {
                var key1 = dragEdgeIds[i];
                if (drawLayers[layerValue]["edges"][key1].length_m < tolerance) {
                    flag = true;
                    break;
                }
                // check operlapping, crossing
                var path1 = drawLayers[layerValue]["edges"][key1].coordinates;
                for (var key2 in drawLayers[layerValue]["edges"]) {
                    if (key1 === key2) continue;
                    var path2 = drawLayers[layerValue]["edges"][key2].coordinates;
                    flag = checkCrossing(path1, path2);
                    if (flag) break;
                }
                if (flag) break;
            }
            if (flag) {
                updateDragVertex(dragStartPoint);
            } else {
                if (snapSelected) {
                    // check snapping other vertex
                    var findFeatures = mapRef.current.queryRenderedFeatures([[e.point[0] - 5, e.point[1] - 5], [e.point[0] + 5, e.point[1] + 5]], { layers: ['vertexes'] });
                    var vertexFeatures = findFeatures.filter(feature => {
                        return feature.properties['layer'] === layerValue && feature.properties['id'] !== dragVertexId;
                    });

                    if (vertexFeatures.length > 0) {
                        let newDrawLayers = {...drawLayers};
                        dragEdgeIds.forEach(id => {
                            if (newDrawLayers[layerValue]['edges'][id].startVertexKey === dragVertexId) {
                                newDrawLayers[layerValue]['edges'][id].startVertexKey = vertexFeatures[0].properties.id;
                            }
                            if (newDrawLayers[layerValue]['edges'][id].endVertexKey === dragVertexId) {
                                newDrawLayers[layerValue]['edges'][id].endVertexKey = vertexFeatures[0].properties.id;
                            }
                        });
                        delete newDrawLayers[layerValue]['vertexes'][dragVertexId];
                        addDrawStep(newDrawLayers);
                        setDrawLayers(newDrawLayers);
                    } else {
                        // check snapping other edge
                        addDrawStep(drawLayers);
                        findFeatures = mapRef.current.queryRenderedFeatures([[e.point[0] - 5, e.point[1] - 5], [e.point[0] + 5, e.point[1] + 5]]);
                        var edgeFeatures = findFeatures.filter(feature => {
                            return feature.properties['layer'] === layerValue && feature.properties['type'] === 'edge';
                        });
                        //can not use dragVertexId, search instead of dragVertexId
                        findFeatures = mapRef.current.queryRenderedFeatures([[e.point[0] - 5, e.point[1] - 5], [e.point[0] + 5, e.point[1] + 5]], { layers: ['vertexes'] });
                        vertexFeatures = findFeatures.filter(feature => {
                            return feature.properties['layer'] === layerValue;
                        });
                        if (edgeFeatures.length > 0 && vertexFeatures.length > 0) {
                            if (dragEdgeIds.indexOf(edgeFeatures[0].properties.id) === -1) {
                                // split edge
                                splitEdge(edgeFeatures[0].properties.id, vertexFeatures[0].properties.id);
                            }
                        }
                    }
                }
            }
            dragVertexId = null;
            dragEdgeIds = [];
            dragFacetIndexes = [];
        }
    }

    function drawCancel() {
        if (newEdgeId && drawLayers[layerValue]["edges"][newEdgeId]) {
            var exsist = false;
            let newDrawLayers = {...drawLayers};
            var vertexKey = newDrawLayers[layerValue]["edges"][newEdgeId].startVertexKey;
            for (let key in newDrawLayers[layerValue]["edges"]) {
                if (key === newEdgeId) continue;
                if (newDrawLayers[layerValue]["edges"][key].startVertexKey === vertexKey ||
                    newDrawLayers[layerValue]["edges"][key].endVertexKey === vertexKey) {
                    exsist = true;
                    break;
                }
            }
            if (!exsist) {
                delete newDrawLayers[layerValue]["vertexes"][vertexKey];
            }
            delete newDrawLayers[layerValue]["edges"][newEdgeId];
            newEdgeId = null;
            setDrawLayers(newDrawLayers);
        }
    }

    const drawDataSource = useMemo(()=>{
        var result = {
            "type": "FeatureCollection",
            "features": []
        }
        for (let layerKey in drawLayers) {
            for (let key in drawLayers[layerKey]['facets']) {
                var pitch = drawLayers[layerKey]['facets'][key].pitch;
                var sqft_pitch = drawLayers[layerKey]['facets'][key].sqft_pitch;
                var feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": drawLayers[layerKey]['facets'][key].coordinates
                    },
                    "properties": {
                        id: key,
                        layer: layerKey,
                        type: 'facet',
                        selected: selectedFacets.includes(key)?true:false,
                        pitch: pitch,
                        color: drawLayers[layerKey]['facets'][key].color,
                        sqm: drawLayers[layerKey]['facets'][key].sqm,
                        sqft: drawLayers[layerKey]['facets'][key].sqft,
                        sqft_pitch: sqft_pitch
                    }
                }
                result.features.push(feature);
                let label = pitch === null ? `${Math.floor(drawLayers[layerKey]['facets'][key].sqft)} sqft`
                                           : `${pitch}\n${Math.floor(sqft_pitch)} sqft`;
                
                if(projectType === 'Low Slope Roofs'){
                    label = `${Math.floor(drawLayers[layerKey]['facets'][key].sqft)} sqft`;
                    if(drawLayers[layerKey]['facets'][key].name!==''){
                        label = drawLayers[layerKey]['facets'][key].name + '\n' + label;
                    }else{
                        label = `Area-${Object.keys(drawLayers[layerKey]['facets']).indexOf(key)+1}\n${label}`;
                    }
                }

                var labelFeature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": drawLayers[layerKey]['facets'][key].center
                    },
                    "properties": {
                        id: key,
                        layer: layerKey,
                        type: 'label',
                        label: label,
                    }
                }
                result.features.push(labelFeature);
            }
            for (let key in drawLayers[layerKey]['edges']) {
                let label = metersToFeetLabel(drawLayers[layerKey]['edges'][key].length_m);
                if(projectType === 'Low Slope Roofs'){
                    if(drawLayers[layerKey]['edges'][key].name!==''){
                        label = drawLayers[layerKey]['edges'][key].name + ' ' + label;
                    }else{
                        label = `Length-${Object.keys(drawLayers[layerKey]['edges']).indexOf(key)+1} ${label}`;
                    }
                }
                let feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": drawLayers[layerKey]['edges'][key].coordinates
                    },
                    "properties": {
                        id: key,
                        layer: layerKey,
                        type: 'edge',
                        edgeKey: drawLayers[layerKey]['edges'][key].edgeKey,
                        style: drawLayers[layerKey]['edges'][key].style,
                        color: drawLayers[layerKey]['edges'][key].color,
                        label:label,
                        startVertexKey: drawLayers[layerKey]['edges'][key].startVertexKey,
                        endVertexKey: drawLayers[layerKey]['edges'][key].endVertexKey,
                        length_m: drawLayers[layerKey]['edges'][key].length_m,
                        selected: selectedEdges.includes(key)?true:false
                    }
                }
                result.features.push(feature);
            }
            for (let key in drawLayers[layerKey]['vertexes']) {
                let feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": drawLayers[layerKey]['vertexes'][key].coordinates
                    },
                    "properties": {
                        id: key,
                        layer: layerKey,
                        type: 'vertex'
                    }
                }
                result.features.push(feature);
            }
        }

        return result;

    }, [projectType, drawLayers, selectedEdges, selectedFacets]);
    
    useEffect(()=>{

       drawCancel();

    },[drawValue]);
    
    useEffect(()=>{
       
       setMap(mapRef.current.getMap());

    },[]);

    return (
        <ReactMapGL className={classes.mapContainer}
            {...viewport}    
            width="100%"
            height="100%"
            mapStyle={blankStyle}
            mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            ref={mapRef}
            attributionControl={false}
            maxZoom={24}
            minZoom={16}
            maxPitch={0}
            dragPan={dragPan}
            preserveDrawingBuffer={true}
            //dragRotate={false}
            //transitionDuration={100}
            onViewportChange={setViewport}
            getCursor={() => mouseCursor}
            onMouseMove={handleMouseMove}
            onClick={handleMouseClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
        >
            <Layer id="satellite-base-layer" type="raster" 
                   source={{"type": "raster",  "url": "mapbox://mapbox.satellite", "tileSize": 256}}
                   layout={{"visibility":((showBaseMap===true && printValue==='Default') || printValue==='ALL')?'visible':'none'}}
            />
            {(drawLayers && layerValue && Object.keys(drawLayers[layerValue]['edges']).length===0) && (
                <>
                <Marker longitude={location.lng} latitude={location.lat} offsetLeft={-16} offsetTop={-32}>
                    <img src={imgMarker} alt="marker" />
                </Marker>
                <Marker longitude={location.lng} latitude={location.lat} offsetLeft={16} offsetTop={-46}>
                    <div className={classes.markerLabel}>{address}</div>
                </Marker>
                </>
            )}
            {(drawLayers && layerValue) && (
                <Source id="measurements" type="geojson" data={drawDataSource}>
                    <Layer id="facets" type="fill" filter={['==', '$type', 'Polygon']}
                        paint={{
                            'fill-outline-color': 'transparent',
                            'fill-color': [
                                'case',
                                ['==', ['get', "selected"], false], ['get','color'],
                                selectedColor
                            ],
                            'fill-opacity': [
                                'case',
                                ['==', printValue, 'ALL'], 0,
                                ['==', printValue, 'Diagram'], 0.5,
                                ['==', printValue, 'Edges'], 0,
                                ['==', printValue, 'Facets'], 0.5,
                                ['==', ['get', "selected"], true], 1,
                                ['==', ['get', "layer"], layerValue], 0.5,
                                0.2
                            ]
                        }}
                    />
                    <Layer id="edges" type="line"
                        filter={['all',['==', '$type', 'LineString'],['==', 'style', 'solid']]}
                        paint={{
                            'line-width': 2,
                            'line-color': [
                                'case',
                                ['==', ['get', "selected"], false], ['get','color'],
                                selectedColor
                            ],
                            'line-opacity': [
                                'case',
                                ['==', printValue, 'ALL'], 1,
                                ['==', printValue, 'Diagram'], 1,
                                ['==', printValue, 'Edges'], 1,
                                ['==', printValue, 'Facets'], 1,
                                ['==', ['get', "layer"], layerValue], 1,
                                0.35
                            ]
                        }}
                    />
                    <Layer id="edges-dasharray" type="line"
                        filter={['all', ['==', '$type', 'LineString'], ['==', 'style', 'dashed']]}
                        paint={{
                            'line-width': 2,
                            'line-color': [
                                'case',
                                ['==', ['get', "selected"], false], ['get','color'],
                                selectedColor
                            ],
                            'line-dasharray': [3, 2],
                            'line-opacity': [
                                'case',
                                ['==', printValue, 'ALL'], 1,
                                ['==', printValue, 'Diagram'], 1,
                                ['==', printValue, 'Edges'], 1,
                                ['==', printValue, 'Facets'], 1,
                                ['==', ['get', "layer"], layerValue], 1,
                                0.35
                            ]
                        }}
                    />
                    <Layer id="vertexes" type="circle"
                        filter={['all', ['==', '$type', 'Point'], ['==', 'type', 'vertex']]}
                        paint={{
                            'circle-radius': 3,
                            'circle-color': '#fff',
                            'circle-opacity':[
                                'case',
                                ['==', printValue, 'ALL'], 0,
                                ['==', printValue, 'Diagram'], 0,
                                ['==', printValue, 'Edges'], 0,
                                ['==', printValue, 'Facets'], 0,
                                ['==', ['get', "layer"], layerValue], 1,
                                0
                            ]
                        }}
                    />
                    <Layer id="edge-labels" type="symbol"
                        filter={['all', ['==', '$type', 'LineString']]}
                        layout={{
                            'symbol-placement': 'line-center',
                            'text-allow-overlap': true,
                            //'text-font': ['Open Sans Regular'],
                            'text-field':'{label}',
                            'text-size': [
                                'case',
                                ['==', printValue, 'ALL'], 16,
                                ['==', printValue, 'Default'], 16,
                                ['>', ['get', "length_m"], 5], 12,
                                8
                            ],
                            'symbol-spacing': 1
                        }}
                        paint={{
                            'text-translate': [0, -12],
                            'text-color': '#fff',
                            'text-opacity':[
                                'case',
                                ['==', printValue, 'ALL'], 1,
                                ['==', printValue, 'Diagram'], 1,
                                ['==', printValue, 'Edges'], 1,
                                ['==', printValue, 'Facets'], 0,
                                ['==', ['get', "layer"], layerValue], 1,
                                0
                            ]
                        }}
                    />
                    <Layer id="facet-labels" type="symbol"
                        filter={['all', ['==', '$type', 'Point'], ['==', 'type', 'label']]}
                        layout={{
                            'text-allow-overlap': [
                                'case',
                                ['==', printValue, 'Default'], false,
                                true
                            ],
                            'text-field': '{label}',
                            'text-size':  [
                                'case',
                                ['==', printValue, 'ALL'], 16,
                                ['==', printValue, 'Default'], 16,
                                20
                            ],
                            'symbol-spacing': 1
                        }}
                        paint={{
                            'text-color': '#fff',
                            'text-opacity':[
                                'case',
                                ['==', printValue, 'ALL'], 1,
                                ['==', printValue, 'Diagram'], 1,
                                ['==', printValue, 'Edges'], 0,
                                ['==', printValue, 'Facets'], 1,
                                ['==', ['get', "layer"], layerValue], 1,
                                0
                            ]
                        }}
                    />
                </Source>
            )}
            {newEdgeDataSource && (
               <Source id="newEdgeDataSource" type="geojson" data={newEdgeDataSource}>
                  <Layer id="newEdge" type="line" beforeId='vertexes'
                         paint={{
                            'line-width': 2,
                            'line-color': 'rgb(85, 211, 252)'
                         }}
                  />
                  <Layer id="newEdgeLabel" type="symbol"
                        layout={{
                            'symbol-placement': 'line-center',
                            //'text-font': ['Open Sans Regular'],
                            'text-field': '{label}',
                            'text-size': 16,
                            'symbol-spacing': 1,
                        }}
                        paint={{
                            'text-translate': [0, -12],
                            'text-color':'white',
                        }}
                    />
               </Source>
            )}
            {gridSelected && <div className={classes.grid}></div>}
            {(drawValue === 'draw' || drawValue === 'move_vertex') && (
                crossSelected?
                    <>
                    <div style={{
                        position: 'absolute', top: cursorPoint[1] - 15, left: cursorPoint[0] - 15, width: 30, height: 30,
                        border: `3px solid ${snapVertex ? 'white' : 'red'}`, boxSizing:'border-box'
                    }}></div>
                    <div style={{
                        position: 'absolute', top: 0, left: cursorPoint[0] - 1, width: 2, height: '100%',
                        backgroundColor: `${snapVertical ? 'white' : 'red'}`
                    }}></div>
                    <div style={{
                        position: 'absolute', top: cursorPoint[1] - 1, left: 0, width: '100%', height: 2,
                        backgroundColor: `${snapHorizontal ? 'white' : 'red'}`
                    }}></div>
                    <div style={{ position: 'absolute', top: cursorPoint[1] - 3, left: cursorPoint[0] - 3,
                             width: 6, height: 6, borderRadius: '50%', backgroundColor: 'white'
                    }}></div>
                    </>
                    :<div style={{ position: 'absolute', top: cursorPoint[1] - 3, left: cursorPoint[0] - 3, width: 6, height: 6, borderRadius: '50%', backgroundColor: 'red' }}></div>
            )}
            <NavigationControl showZoom={false} className={classes.compass} />
        </ReactMapGL>
    );
}

function checkCrossing(path1, path2) {
    var line1 = turf.lineString(path1);
    var line2 = turf.lineString(path2);
    var overlapping = turf.lineOverlap(line1, line2, { tolerance: tolerance * 0.001 });
    if (overlapping.features.length > 0) {
        return true;
    }
    var intersect = turf.lineIntersect(line1, line2);
    if (intersect.features.length > 0) {
        var crossPoint = turf.point(intersect.features[0].geometry.coordinates);

        var point11 = turf.point(path1[0]);
        var point12 = turf.point(path1[1]);
        var point21 = turf.point(path2[0]);
        var point22 = turf.point(path2[1]);

        var dist1 = turf.distance(crossPoint, point11, { units: 'kilometers' }) * 1000;
        var dist2 = turf.distance(crossPoint, point12, { units: 'kilometers' }) * 1000;
        var dist3 = turf.distance(crossPoint, point21, { units: 'kilometers' }) * 1000;
        var dist4 = turf.distance(crossPoint, point22, { units: 'kilometers' }) * 1000;

        if (dist1 > tolerance && dist2 > tolerance && dist3 > tolerance && dist4 > tolerance) {
            return true;
        }
    }
    return false;
}

export default withStyles(styles)(Map);
import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';

// import material ui dialog
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

// import material ui icons
import DoneAllIcon from '@material-ui/icons/DoneAll';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import StraightenIcon from '@material-ui/icons/Straighten';
import TextFieldsIcon from '@material-ui/icons/TextFields';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { ColorPicker, createColor } from "material-ui-color";

import * as turf from '@turf/turf';

import { edges } from "../../utils/constants";

const styles = (theme) => ({
    edgeToolsPanel: {
        position: 'absolute',
        top: 24,
        right: 24,
        maxHeight: 400,
        zIndex: 100,
        borderRadius: 8,
        //border:'1px solid #b8c5d0',
        backgroundColor: 'white',
        overflow: 'auto',
        '& .MuiToggleButton-root': {
            padding:10,
            border: 0,
            borderRadius: 0,
            justifyContent: 'start',
            textTransform: 'unset',
            fontSize:14,
            color: '#767786',
            fontWeight: 500,
            fontStyle:'normal'
        },
        '& .MuiToggleButton-root.Mui-selected': {
            borderTop:'1px solid #b8c5d0',
            borderBottom:'1px solid #b8c5d0',
            color: '#5c77ff',
            backgroundColor:'#dee7ee'
        },
        '& .MuiToggleButton-root.Mui-selected:last-child': {
            borderBottomLeftRadius:8,
            borderBottomRightRadius:8,
            borderBottom:'none'
        },
        '& .MuiToggleButton-root:hover': {
            color: '#5c77ff',
        },
        [theme.breakpoints.down('md')]: {
            top: 10,
            right: 10
        }
    },
    panelHeader: {
        padding: 10,
        fontFamily: 'Roboto',
        color: '#5c77ff',
        fontSize: 16,
        fontWeight:700,
        textAlign: 'center'
    },
    edges: {
        marginRight: 10,
        width: 24,
        height: 3,
        boxSizing:'border-box'
    },
    textBox:{
        minWidth:200,
        marginBottom:24,
        '& .MuiInputBase-root':{
           width: 'auto',
           height: 56,
           borderRadius: 6,
           backgroundColor: '#fff'
        },
        '& .MuiOutlinedInput-input':{
           padding: '19px 16px',
           fontFamily: 'Roboto',
           fontSize: 16,
           color: '#171d29',
           fontWeight: 400,
           fontStyle: 'normal'
        },
        '& .MuiOutlinedInput-notchedOutline':{
           borderColor:'#767786'
        },
        '& .MuiInputAdornment-positionEnd':{
            marginRight:10
        }
    },
    dialog:{
        '& .MuiBackdrop-root':{
            backgroundColor:'#171d29e6'
        },
        '& .MuiDialog-paperWidthSm':{
            maxWidth:684
        },
        '& .MuiDialog-paper':{
            width:684
        },
        '& .MuiDialogTitle-root':{
            padding:32,
            borderBottom:'1px solid #76778633',
            fontSize:24,
            fontWeight:500,
            fontStyle:'normal',
            color:'#171d29'
        },
        '& .MuiDialogContent-root':{
            padding:'24px 80px'
        },
        [theme.breakpoints.down('xs')]: {
            '& .MuiDialog-paperWidthSm':{
                width:'100%'
            },
            '& .MuiDialogContent-root':{
                padding:20
            },
         }
    },
    submitButton:{
        width: '100%',
        height: 56,
        borderRadius: 16,
        '& span':{
            fontFamily: 'Roboto',
            fontSize: 18,
            fontWeight: 500,
            textAlign: 'center',
            color: '#fff',
            fontStyle: 'normal'
        }
    },
    cancelButton:{
        width: '100%',
        height: 56,
        borderRadius: 16,
        border:'1px solid #767786',
        '& span':{
            fontFamily: 'Roboto',
            fontSize: 18,
            fontWeight: 500,
            textAlign: 'center',
            color: '#767786',
            fontStyle: 'normal'
        }
    }
});

function EdgeTools(props) {
    const { 
        classes, projectType, drawLayers, setDrawLayers, layerValue,
        edgeValue, setEdgeValue, setMouseCursor,
        selectedEdges, setSelectedEdges, addDrawStep
    } = props;
    const [edgeName, setEdgeName] = useState('');
    const [edgeColor, setEdgeColor] = useState(createColor('#fff'));
    const [changeEdgeNameDialogOpen, setChangeEdgeNameDialogOpen] = useState(false);
    const [deleteSelectedEdgesDialogOpen, setDeleteSelectedEdgesDialogOpen] = useState(false);
    const [deleteAllEdgesDialogOpen, setDeleteAllEdgesDialogOpen] = useState(false);
    const [adjustLengthDialogOpen, setAdjustLengthDialogOpen] = useState(false);
    const [inputFeetValue, setInputFeetValue] = useState(null);
    const [inputInchesValue, setInputInchesValue] = useState(null);

    const handleEdgeChange = (event, value) => {
        if (value != null) {
            setEdgeValue(value);
        }
    };

    const handleDeleteSelectedEdgesDialogClose = () => {
        setDeleteSelectedEdgesDialogOpen(false);
        setSelectedEdges([]);
    }

    const handleDeleteSelectedEdgesDialogOk = () => {
        setDeleteSelectedEdgesDialogOpen(false);
        deleteSelectedEdges();
    }

    const handleDeleteAllEdgesDialogClose = () => {
        setDeleteAllEdgesDialogOpen(false);
        setEdgeValue(null);
    };

    const handleDeleteAllEdgesDialogOk = () => {
        setDeleteAllEdgesDialogOpen(false);
        setEdgeValue(null);
        let newDrawLayers = JSON.parse(JSON.stringify(drawLayers));
        newDrawLayers[layerValue] = {
            //...newDrawLayers[layerValue],
            'facets': {},
            'edges': {},
            'vertexes': {}
        };
        addDrawStep(newDrawLayers);
        setDrawLayers(newDrawLayers);
    };
    
    const handleChangeEdgeNameDialogClose = () => {
        setChangeEdgeNameDialogOpen(false);
        setSelectedEdges([]);
    }
    
    const handleChangeEdgeNameDialogOk = () => {
       setChangeEdgeNameDialogOpen(false);
       let newDrawLayers = JSON.parse(JSON.stringify(drawLayers));
       selectedEdges.forEach(edgeKey=>{
          newDrawLayers[layerValue]['edges'][edgeKey].name = edgeName;
          newDrawLayers[layerValue]['edges'][edgeKey].color = `#${edgeColor.hex}`;
       });
       addDrawStep(newDrawLayers);
       setDrawLayers(newDrawLayers);
       setSelectedEdges([]);
    }

    const handleAdjustLengthDialogClose = () => {
        setAdjustLengthDialogOpen(false);
        setSelectedEdges([]);
    }

    const handleAdjustLengthDialogOk = () => {
        setAdjustLengthDialogOpen(false);
        let edgeKey = selectedEdges[0];
        var new_meters = 2.54 * 12 / 100 * parseInt(inputFeetValue) + 2.54 / 100 * parseInt(inputInchesValue);
        var factor = new_meters / drawLayers[layerValue]['edges'][edgeKey].length_m;
        let newDrawLayers = JSON.parse(JSON.stringify(drawLayers));
        for (let layerKey in newDrawLayers) {
            for (let key in newDrawLayers[layerKey]['edges']) {
                newDrawLayers[layerKey]['edges'][key] = {
                    ...newDrawLayers[layerKey]['edges'][key],
                    length_m: factor * newDrawLayers[layerKey]['edges'][key].length_m,
                    length_ft: factor * newDrawLayers[layerKey]['edges'][key].length_ft,
                }
            }
            for (let key in newDrawLayers[layerKey]['facets']) {
                newDrawLayers[layerKey]['facets'][key] = {
                    ...newDrawLayers[layerKey]['facets'][key],
                    sqm: factor * factor * newDrawLayers[layerKey]['facets'][key].sqm,
                    sqft: factor * factor * newDrawLayers[layerKey]['facets'][key].sqft,
                    sqft_pitch: factor * factor * newDrawLayers[layerKey]['facets'][key].sqft_pitch,
                }
            }
        }
        addDrawStep(newDrawLayers);
        setDrawLayers(newDrawLayers);
        setSelectedEdges([]);
    }

    function deleteSelectedEdges() { // k = selectedEdgeKey
        let newDrawLayers = JSON.parse(JSON.stringify(drawLayers));
        selectedEdges.forEach(k=>{
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
        });
        addDrawStep(newDrawLayers);
        setSelectedEdges([]);
        setDrawLayers(newDrawLayers);
    }

    useEffect(() => {
        setMouseCursor('default');
        if(edges[edgeValue]){
            if(selectedEdges.length>0){
               let newDrawLayers = JSON.parse(JSON.stringify(drawLayers));
               selectedEdges.forEach(edgeKey=>{
                    newDrawLayers[layerValue]["edges"][edgeKey]["edgeKey"] = edgeValue;
                    newDrawLayers[layerValue]["edges"][edgeKey]["style"] = edges[edgeValue].style;
                    newDrawLayers[layerValue]["edges"][edgeKey]["color"] = edges[edgeValue].color;
               });
               addDrawStep(newDrawLayers);
               setDrawLayers(newDrawLayers);
               setSelectedEdges([]);
            }
        }else{
            switch (edgeValue) {
                case 'edge_name':
                    if(selectedEdges.length>0){
                        setEdgeName('');
                        setEdgeColor(createColor('#fff'));
                        setChangeEdgeNameDialogOpen(true);
                    }
                    break;
                case 'delete_edge':
                    if(selectedEdges.length>0){
                        setDeleteSelectedEdgesDialogOpen(true);
                    }
                    break;
                case 'delete_all_edges':
                    if (Object.keys(drawLayers[layerValue]["edges"]).length > 0) {
                       setDeleteAllEdgesDialogOpen(true);
                    } else {
                       setEdgeValue(null);
                    }
                    break;
                default:
                    break;
            }        
        }
    }, [edgeValue]);

    useEffect(() => {
       if(selectedEdges.length>0){
            let edgeKey = selectedEdges[0];
            switch (edgeValue) {
                case 'adjust_length':
                    var meters = drawLayers[layerValue]['edges'][edgeKey].length_m;
                    var totalInch = meters * 100 / 2.54;
                    var feet = Math.floor(totalInch / 12);
                    var inches = Math.floor(totalInch - 12 * feet);
                    setInputFeetValue(feet);
                    setInputInchesValue(inches);
                    setAdjustLengthDialogOpen(true);
                    break;
                case 'edge_name':
                    setEdgeName(drawLayers[layerValue]['edges'][edgeKey].name);
                    setEdgeColor(createColor(drawLayers[layerValue]['edges'][edgeKey].color));
                    setChangeEdgeNameDialogOpen(true);
                    break;
                default:
                    break;
            }
       }
    }, [selectedEdges]);

    return (
        <>
        <div className={classes.edgeToolsPanel}>
            <div className={classes.panelHeader}>Details</div>
            <ToggleButtonGroup orientation="vertical" value={edgeValue} exclusive onChange={handleEdgeChange}>
                <ToggleButton value="select_edges" aria-label="select_edges">
                    <DoneAllIcon style={{ marginRight: 10 }} />Select Edges
                </ToggleButton>
                {projectType==='Steep Slope Roofs' && (
                    Object.keys(edges).map((key, index) => (
                        <ToggleButton key={key} value={key} aria-label={edges[key].name}>
                            <i className={classes.edges} style={{ border: `2px ${edges[key].style} ${edges[key].color}` }}></i>{edges[key].name}
                        </ToggleButton>
                    ))
                )}
                {projectType==='Low Slope Roofs' && (
                    <ToggleButton value="edge_name" aria-label="edge_name">
                        <TextFieldsIcon style={{ marginRight: 10 }} />Length Name
                    </ToggleButton>
                )}
                <ToggleButton value="adjust_length" aria-label="adjust_length">
                    <StraightenIcon style={{ marginRight: 10 }} />Adjust Length
                </ToggleButton>
                <ToggleButton value="delete_edge" aria-label="delete_edge">
                    <HighlightOffIcon style={{ marginRight: 10 }} />Delete Selection
                </ToggleButton>
                <ToggleButton value="delete_all_edges" aria-label="delete_all_edges">
                    <DeleteForeverIcon style={{ marginRight: 10 }} />Delete All Edges
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
        <Dialog className={classes.dialog}
                open={deleteSelectedEdgesDialogOpen} onClose={handleDeleteSelectedEdgesDialogClose}>
            <DialogTitle disableTypography={true}>Delete Selected Edges</DialogTitle>
            <DialogContent>
                <Grid container justifyContent="center" style={{marginBottom:40,fontSize:16,color:'#171d29',fontStyle:'normal',fontWeight:700}}>
                    Are you sure you want to delete selected edges ?
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Button variant="outlined" color="default" 
                                className={classes.cancelButton}
                                onClick={handleDeleteSelectedEdgesDialogClose}
                        >No</Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button type="submit" variant="contained" 
                                className={classes.submitButton} style={{backgroundColor:'#f53e3e'}}
                                onClick={handleDeleteSelectedEdgesDialogOk}
                        >Yes</Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
        <Dialog className={classes.dialog}
                open={deleteAllEdgesDialogOpen} onClose={handleDeleteAllEdgesDialogClose}>
            <DialogTitle disableTypography={true}>Delete All Edges</DialogTitle>
            <DialogContent>
                <Grid container justifyContent="center" style={{marginBottom:40,fontSize:16,color:'#171d29',fontStyle:'normal',fontWeight:700}}>
                    Are you sure you want to delete all edges ?
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Button variant="outlined" color="default" 
                                className={classes.cancelButton}
                                onClick={handleDeleteAllEdgesDialogClose}
                        >No</Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button type="submit" variant="contained" 
                                className={classes.submitButton} style={{backgroundColor:'#f53e3e'}}
                                onClick={handleDeleteAllEdgesDialogOk}
                        >Yes</Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
        <Dialog className={classes.dialog}
            open={changeEdgeNameDialogOpen} onClose={handleChangeEdgeNameDialogClose}
            aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle>Change Length Name</DialogTitle>
            <DialogContent>
                <TextField className={classes.textBox}
                    name="edgeName" label="Length Name"
                    InputLabelProps={{shrink: true}}
                    value={edgeName} onChange={(e) => setEdgeName(e.target.value)}
                    variant="outlined" fullWidth autoComplete="off"
                />
                <ColorPicker
                    value={edgeColor}
                    onChange={color => setEdgeColor(color)}
                />
                <Grid container spacing={3} style={{marginTop:24}}>
                    <Grid item xs={12} sm={6}>
                        <Button variant="outlined" color="default" 
                                className={classes.cancelButton}
                                onClick={handleChangeEdgeNameDialogClose}
                        >Cancel</Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button type="submit" variant="contained" color="primary"
                                className={classes.submitButton}
                                onClick={handleChangeEdgeNameDialogOk}
                        >OK</Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
        <Dialog className={classes.dialog}
            open={adjustLengthDialogOpen} onClose={handleAdjustLengthDialogClose}
            aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle>{"Adjust Measurements"}</DialogTitle>
            <DialogContent>
                <ValidatorForm onSubmit={handleAdjustLengthDialogOk} style={{width:'100%'}}>
                    <TextValidator className={classes.textBox}
                        name="feet" label="Feet"
                        InputLabelProps={{shrink: true}}
                        value={inputFeetValue} onChange={(e) => setInputFeetValue(e.target.value)}
                        validators={['required', 'isNumber', 'isPositive']} errorMessages={['Feet is required', 'Feet must be integer', 'Feet must be positive.']}
                        variant="outlined" fullWidth autoComplete="off"
                    />
                    <TextValidator className={classes.textBox}
                        name="inches" label="Inches"
                        InputLabelProps={{shrink: true}}
                        value={inputInchesValue} onChange={(e) => setInputInchesValue(e.target.value)}
                        validators={['required', 'isNumber', 'isPositive']} errorMessages={['Inches is required', 'Inches must be integer', 'Inches must be positive.']}
                        variant="outlined" fullWidth autoComplete="off"
                    />
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Button variant="outlined" color="default" 
                                    className={classes.cancelButton}
                                    onClick={handleAdjustLengthDialogClose}
                            >Cancel</Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button type="submit" variant="contained" color="primary"
                                    className={classes.submitButton} 
                                    onClick={handleAdjustLengthDialogOk}
                            >OK</Button>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </DialogContent>
        </Dialog>
        </>
    );
}

export default withStyles(styles)(EdgeTools);
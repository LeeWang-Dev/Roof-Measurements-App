import React, {useState, useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Slide from '@material-ui/core/Slide';
// import material ui dialog
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
// import material ui icons
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import Forward10Icon from '@material-ui/icons/Forward10';
import Replay10Icon from '@material-ui/icons/Replay10';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import FilterCenterFocusOutlinedIcon from '@material-ui/icons/FilterCenterFocusOutlined';
import GridOnOutlinedIcon from '@material-ui/icons/GridOnOutlined';
import MapOutlinedIcon from '@material-ui/icons/MapOutlined';
import FilterHdrOutlinedIcon from '@material-ui/icons/FilterHdrOutlined';
import CloseIcon from '@material-ui/icons/Close';
import LayersOutlinedIcon from '@material-ui/icons/LayersOutlined';

// import images
import imgPitch from '../../assets/images/pitch-gauge.png';

import BootstrapTooltip from '../customs/BootstrapToolTip';

import { google } from "../../utils/constants";

const styles = (theme) => ({
    controlsPanel: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap:'wrap',
        backgroundColor: 'white',
        borderRadius:8,
        //border:'1px solid #dee7ee',
        '& .MuiButtonBase-root': {
            minWidth: 'unset',
            height: 40,
            borderRadius: 0,
            padding: 8,
            color: '#767786',
            fontWeight: 'normal',
            backgroundColor: 'white',
            boxShadow:'none'
        },
        '& .MuiButtonBase-root:first-child': {
            borderTopLeftRadius:8,
            borderBottomLeftRadius:8
        },
        '& .MuiButtonBase-root:last-child ': {
            borderTopRightRadius:8,
            borderBottomRightRadius:8
        },
        '& .MuiButtonBase-root:hover': {
            color: '#5c77ff'
        },
        '& .MuiToggleButton-root': {
            border: 0,
            borderRadius: 0,
            textTransform: 'unset',
            color: '#555',
            lineHeight: 'inherit'
        },
        '& .MuiToggleButton-root.Mui-selected': {
            color: '#5c77ff',
            backgroundColor: '#dee7ee'
        },
        [theme.breakpoints.down('md')]: {
            bottom: 10,
            left: 10,
        },
        [theme.breakpoints.down('xs')]: {
            bottom: 0,
            left: 0,
            borderRadius:0,
            '& .MuiButtonBase-root:first-child': {
               border:0
            },
            '& .MuiButtonBase-root:last-child ': {
               border:0
            },
        }
    },
    streetViewContainer: {
        flex: 1,
        backgroundColor: 'black'
    },
    imgPitch: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        maxWidth: '100%',
        maxHeight: '100%',
        transform: 'translateX(-50%) translateY(-50%)',
        pointerEvents: 'none',
        zIndex: 100
    }
});

const TransitionUp = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Controls(props){
   const {classes, viewport, setViewport, 
          gridSelected, setGridSelected, 
          crossSelected, setCrossSelected, 
          snapSelected, setSnapSelected, 
          showBaseMap, setShowBaseMap,
          setDrawValue, setDrawLayers, 
          setLayers, setLayerValue, drawSteps
        } = props;
   const [viewPitchDialogOpen, setViewPitchDialogOpen] = useState(false);
   const [drawStepIndex, setDrawStepIndex] = useState(null);

   const handleUndoClick = () => {
       if (drawStepIndex === null && drawSteps.length > 0) {
           setDrawStepIndex(drawSteps.length - 1);
       } else if (drawStepIndex > 0) {
           setDrawStepIndex(drawStepIndex => drawStepIndex - 1);
       }
   };

   const handleRedoClick = () => {
       if (drawStepIndex === null && drawSteps.length > 0) {
           setDrawStepIndex(drawSteps.length - 1);
       } else if (drawSteps.length > 0 && drawStepIndex < drawSteps.length - 1) {
           setDrawStepIndex(drawStepIndex => drawStepIndex + 1);
       }
   }

   const handleZoomClick = (value) => {
        var newValue = value > 0 ? Math.min(viewport.zoom + value, 24) : Math.max(viewport.zoom + value, 18);
        setViewport({
            ...viewport,
            zoom: newValue
        });
   };

   const handleRotateClick = (angle) => {
        setViewport({
            ...viewport,
            bearing: viewport.bearing + angle
        });
   }

   const handleViewGoogleMapsOpenClick = () => {
        var toUrl = [
            'https://www.google.com/maps/@?api=1&map_action=map',
            `zoom=${Math.min(parseInt(viewport.zoom), 20)}`,
            `basemap=satellite`,
            `center=${viewport.latitude},${viewport.longitude}`
        ].join('&');
        window.open(toUrl, '_blank');
    }

   const handleViewPitchDialogEntered = () => {
        const panorama = new google.maps.StreetViewPanorama(document.getElementById("street-view"), {
            zoomControl: true,
            addressControl: true,
            enableCloseButton: false,
            fullscreenControl: false,
            navigationControl: true,
            panControl: true,
            scrollwheel: true,
            motionTracking: true,
            motionTrackingControl: true,
            zoom: 0
        });
        var sv = new google.maps.StreetViewService();
        sv.getPanorama({
            location: new google.maps.LatLng(viewport.latitude, viewport.longitude),
            preference: 'nearest',
            radius: 500,
            source: 'outdoor'
        }, function (data, status) {
            if (status === 'OK') {
                var pano_id = data.location.pano;
                panorama.setPano(pano_id);
                panorama.setVisible(true);
            }
        });
   };

   useEffect(() => {
        if (drawStepIndex === null) return;
        setDrawValue(null);
        setViewport({
            ...viewport,
            ...drawSteps[drawStepIndex].viewport
        });
        setDrawLayers(drawSteps[drawStepIndex].drawLayers);
        setLayers(Object.keys(drawSteps[drawStepIndex].drawLayers));
        setLayerValue(drawSteps[drawStepIndex].layer);
    }, [drawStepIndex]);

   return(
        <>
        <div className={classes.controlsPanel}>
            <BootstrapTooltip title="Undo">
                <Button variant="contained" onClick={() => handleUndoClick()}><UndoIcon /></Button>
            </BootstrapTooltip>
            <BootstrapTooltip title="Redo">
                <Button variant="contained" onClick={() => handleRedoClick()}><RedoIcon /></Button>
            </BootstrapTooltip>
            <Divider orientation="vertical" flexItem style={{margin:'8px 0',backgroundColor:'#dee7ee'}}/>
            <BootstrapTooltip title="Zoom In">
                <Button variant="contained" onClick={() => handleZoomClick(0.2)}><ZoomInIcon /></Button>
            </BootstrapTooltip>
            <BootstrapTooltip title="Zoom Out">
                <Button variant="contained" onClick={() => handleZoomClick(-0.2)}><ZoomOutIcon /></Button>
            </BootstrapTooltip>
            <Divider orientation="vertical" flexItem style={{margin:'8px 0',backgroundColor:'#dee7ee'}}/>
            <BootstrapTooltip title="Rotate Left (1 degree)">
                <Button variant="contained" onClick={() => handleRotateClick(1)}><RotateLeftIcon /></Button>
            </BootstrapTooltip>
            <BootstrapTooltip title="Rotate Left (10 degrees)">
                <Button variant="contained" onClick={() => handleRotateClick(10)}><Replay10Icon /></Button>
            </BootstrapTooltip>
            <BootstrapTooltip title="Rotate Right (1 degree)">
                <Button variant="contained" onClick={() => handleRotateClick(-1)}><RotateRightIcon /></Button>
            </BootstrapTooltip>
            <BootstrapTooltip title="Rotate Right (10 degrees)">
                <Button variant="contained" onClick={() => handleRotateClick(-10)}><Forward10Icon /></Button>
            </BootstrapTooltip>
            <BootstrapTooltip title="Show Base Map">
                <ToggleButton value="showmap" selected={showBaseMap} onChange={() => setShowBaseMap(!showBaseMap)}>
                    <LayersOutlinedIcon />
                </ToggleButton>
            </BootstrapTooltip>
            <BootstrapTooltip title="Show Grid">
                <ToggleButton value="grid" selected={gridSelected} onChange={() => setGridSelected(!gridSelected)}>
                    <GridOnOutlinedIcon />
                </ToggleButton>
            </BootstrapTooltip>
            <BootstrapTooltip title="Toggle Snapping">
                <ToggleButton value="snap" selected={snapSelected} onChange={() => setSnapSelected(!snapSelected)}>
                    <FilterCenterFocusOutlinedIcon />
                </ToggleButton>
            </BootstrapTooltip>
            <BootstrapTooltip title="Toggle Cursor">
                <ToggleButton value="cross" selected={crossSelected} onChange={() => setCrossSelected(!crossSelected)}>
                    <AddBoxOutlinedIcon />
                </ToggleButton>
            </BootstrapTooltip>
            <BootstrapTooltip title="View Google Maps">
                <Button variant="contained" onClick={handleViewGoogleMapsOpenClick}>
                    <MapOutlinedIcon />
                </Button>
            </BootstrapTooltip>
        </div>
        <Dialog fullScreen open={viewPitchDialogOpen} onClose={() => setViewPitchDialogOpen(false)}
                onEntered={handleViewPitchDialogEntered} TransitionComponent={TransitionUp} transitionDuration={500}>
            <AppBar style={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => setViewPitchDialogOpen(false)} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6">View Pictch</Typography>
                </Toolbar>
            </AppBar>
            <div className={classes.streetViewContainer} id="street-view">
                <img src={imgPitch} className={classes.imgPitch} alt="View Pitch"/>
            </div>
        </Dialog>
        </>
   );
}

export default withStyles(styles)(Controls);
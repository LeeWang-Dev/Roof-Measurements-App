import React, {useState, useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
// import material ui dialog
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

// import material ui icons
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ControlCameraIcon from '@material-ui/icons/ControlCamera'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import BorderColorOutlinedIcon from '@material-ui/icons/BorderColorOutlined';

import * as turf from '@turf/turf';

const styles = (theme) => ({
    drawingToolsPanel: {
        position: 'absolute',
        top: 24,
        right: 24,
        maxHeight: 600,
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
        '& .MuiToggleButton-root:hover': {
            color: '#5c77ff',
        },
        '& .MuiToggleButton-root.Mui-selected': {
            borderTop:'1px solid #b8c5d0',
            borderBottom:'1px solid #b8c5d0',
            color: '#5c77ff',
            backgroundColor:'#dee7ee'
        },
        '& .MuiToggleButton-root.Mui-disabled': {
            color: 'rgba(0, 0, 0, 0.12)'
        },
        '& .MuiToggleButton-root.Mui-selected:last-child': {
            borderBottomLeftRadius:8,
            borderBottomRightRadius:8,
            borderBottom:'none'
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

function DrawTools(props){
   const {
       classes, drawLayers, setDrawLayers,
       layerValue, drawValue, setDrawValue, setMouseCursor,
       selectedEdges, setSelectedEdges, addDrawStep
    } = props;
   
   const [deleteSelectedEdgesDialogOpen, setDeleteSelectedEdgesDialogOpen] = useState(false); 
   const [deleteAllEdgesDialogOpen, setDeleteAllEdgesDialogOpen] = useState(false);

   const handleDrawChange = (event, value) => {
        if (value != null) {
            setDrawValue(value);
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
      setDrawValue(null);
   };

   const handleDeleteAllEdgesDialogOk = () => {
        setDeleteAllEdgesDialogOpen(false);
        setDrawValue(null);
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

    function deleteSelectedEdges() { // k = selectedEdgeKey
        let newDrawLayers = {...drawLayers};
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
        setDrawLayers(newDrawLayers);
        setSelectedEdges([]);
   }

   useEffect(() => {
        switch (drawValue) {
            case 'draw':
                setMouseCursor('none');
                break;
            case 'move_vertex':
                setMouseCursor('none');
                break;
            case 'select_edges':
                setMouseCursor('default');
                break;
            case 'delete_edge':
                setMouseCursor('default');
                if(selectedEdges.length>0){
                    setDeleteSelectedEdgesDialogOpen(true);
                }
                break;
            case 'delete_all_edges':
                setMouseCursor('default');
                if (Object.keys(drawLayers[layerValue]["edges"]).length > 0) {
                    setDeleteAllEdgesDialogOpen(true);
                } else {
                    setDrawValue(null);
                }
                break;
            default:
                setMouseCursor('default');
                break;
        }
    }, [drawValue]);

   return(
        <>
        <div className={classes.drawingToolsPanel}>
            <div className={classes.panelHeader}>Drawing Tools</div>
            <ToggleButtonGroup orientation="vertical" value={drawValue} exclusive onChange={handleDrawChange}>
                <ToggleButton value="draw" aria-label="draw">
                    <BorderColorOutlinedIcon style={{ marginRight: 10 }} /> Draw
                </ToggleButton>
                <ToggleButton value="move_vertex" aria-label="move_vertex">
                    <ControlCameraIcon style={{ marginRight: 10 }} />Move Vertex
                </ToggleButton>
                <ToggleButton value="select_edges" aria-label="move_vertex">
                    <DoneAllIcon style={{ marginRight: 10 }} />Select Edges
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
            <DialogTitle disableTypography={true}>Delete Selected Edges</DialogTitle>
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
        </>
   );
}

export default withStyles(styles)(DrawTools);
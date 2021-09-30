
import React, {useState, useEffect} from 'react';
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
import SignalCellularNullIcon from '@material-ui/icons/SignalCellularNull';
import TextFieldsIcon from '@material-ui/icons/TextFields';

import { ColorPicker, createColor } from "material-ui-color";

import { pitches } from "../../utils/constants";

const styles = (theme) => ({
    facetToolsPanel: {
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
            minWidth:160,
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
        height: 3
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

function FacetTools(props){
   const {
      classes, projectType, drawLayers, setDrawLayers, layerValue, pitchValue, setPitchValue,
      setMouseCursor, addDrawStep, selectedFacets, setSelectedFacets
   } = props;
   const [deleteSelectedFacetsDialogOpen, setDeleteSelectedFacetsDialogOpen] = useState(false);
   const [deleteAllPitchesDialogOpen, setDeleteAllPitchesDialogOpen] = useState(false);
   const [facetName, setFacetName] = useState('');
   const [facetColor, setFacetColor] = useState(createColor('#000'));
   const [changeFacetNameDialogOpen, setChangeFacetNameDialogOpen] = useState(false);
   

   const handlePitchChange = (event, value) => {
      if (value != null) {
          setPitchValue(value);
      }
   };
   
   const handleDeleteSelectedFacetsDialogClose = () => {
    setDeleteSelectedFacetsDialogOpen(false);
    setSelectedFacets([]);
}

   const handleDeleteSelectedFacetsDialogOk = () => {
       setDeleteSelectedFacetsDialogOpen(false);
       let newDrawLayers = JSON.parse(JSON.stringify(drawLayers));
       selectedFacets.forEach(facetKey => {
           delete newDrawLayers[layerValue]["facets"][facetKey];
       });
       addDrawStep(newDrawLayers);
       setDrawLayers(newDrawLayers);
       setSelectedFacets([]);
   }

   const handleChangeFacetNameDialogClose = () => {
       setChangeFacetNameDialogOpen(false);
       setSelectedFacets([]);
   }
   
   const handleChangeFacetNameDialogOk = () => {
        setChangeFacetNameDialogOpen(false);
        let newDrawLayers = JSON.parse(JSON.stringify(drawLayers));
        selectedFacets.forEach(facetKey => {
           newDrawLayers[layerValue]['facets'][facetKey].name = facetName;
           newDrawLayers[layerValue]['facets'][facetKey].color = `#${facetColor.hex}`;
        });
        addDrawStep(newDrawLayers);
        setDrawLayers(newDrawLayers);
        setSelectedFacets([]);
   }

   const handleDeleteAllPitchesDialogClose = () => {
      setDeleteAllPitchesDialogOpen(false);
      setPitchValue(null);
   };

   const handleDeleteAllPitchesDialogOk = () => {
        setDeleteAllPitchesDialogOpen(false);
        setPitchValue(null);
        let newDrawLayers = JSON.parse(JSON.stringify(drawLayers));
        for (let key in newDrawLayers[layerValue]["facets"]) {
            var sqft = newDrawLayers[layerValue]["facets"][key].sqft; //sqft
            newDrawLayers[layerValue]["facets"][key]["pitch"] = null;
            newDrawLayers[layerValue]["facets"][key]["sqft_pitch"] = sqft;
        }
        addDrawStep(newDrawLayers);
        setDrawLayers(newDrawLayers);
   };

   useEffect(() => {
        setMouseCursor('default');
        if(pitches[pitchValue]){
            if(selectedFacets.length>0){
               let newDrawLayers = JSON.parse(JSON.stringify(drawLayers));
               selectedFacets.forEach(facetKey=>{
                  var pitchArray = pitchValue.split("/");
                  var sqft = newDrawLayers[layerValue]["facets"][facetKey]["sqft"];
                  var sqft_pitch = sqft / Math.cos(Math.atan(parseInt(pitchArray[0]) / parseInt(pitchArray[1])));
                  newDrawLayers[layerValue]["facets"][facetKey]["pitch"] = pitchValue;
                  newDrawLayers[layerValue]["facets"][facetKey]["sqft_pitch"] = sqft_pitch;
               });
               addDrawStep(newDrawLayers);
               setDrawLayers(newDrawLayers);
               //setSelectedFacets([]);
            }
        }else{
            switch (pitchValue) {
                case 'delete_pitch':
                    if(selectedFacets.length>0){
                        let newDrawLayers = JSON.parse(JSON.stringify(drawLayers));
                        selectedFacets.forEach(facetKey=>{
                            var sqft = newDrawLayers[layerValue]["facets"][facetKey].sqft; //sqft
                            newDrawLayers[layerValue]["facets"][facetKey]["pitch"] = null;
                            newDrawLayers[layerValue]["facets"][facetKey]["sqft_pitch"] = sqft;
                        });
                        addDrawStep(newDrawLayers);
                        setDrawLayers(newDrawLayers);
                        setSelectedFacets([]);
                    }
                    break;
                case 'facet_name':
                    if(selectedFacets.length>0){
                        setFacetName('');
                        setFacetColor(createColor('#fff'));
                        setChangeFacetNameDialogOpen(true);
                    }
                    break;
                case 'delete_facet':
                    if(selectedFacets.length>0){
                        setDeleteSelectedFacetsDialogOpen(true);
                    }
                    break;
                case 'delete_all_pitches':
                    if (Object.keys(drawLayers[layerValue]["facets"]).length > 0) {
                        setDeleteAllPitchesDialogOpen(true);
                    } else {
                        setPitchValue(null);
                    }
                    break;
                default:
                    break;
            }
        }
    }, [pitchValue]);

    useEffect(() => {
        if(selectedFacets.length > 0 && pitchValue === 'facet_name'){
            let facetKey = selectedFacets[0];
            setFacetName(drawLayers[layerValue]['facets'][facetKey].name);
            setFacetColor(createColor(drawLayers[layerValue]['facets'][facetKey].color));
            setChangeFacetNameDialogOpen(true);
        }
    }, [selectedFacets]);

   return(
        <>
        <div className={classes.facetToolsPanel}>
            <div className={classes.panelHeader}>Areas</div>
            {projectType==='Steep Slope Roofs'?
                <ToggleButtonGroup orientation="vertical" value={pitchValue} exclusive onChange={handlePitchChange}>
                    <ToggleButton value="select_facets" aria-label="select_facets">
                        <DoneAllIcon style={{ marginRight: 10 }} />Select Area
                    </ToggleButton>
                    <ToggleButton value="delete_facet" aria-label="delete_facet">
                        <HighlightOffIcon style={{ marginRight: 10, color: '#ff0000' }} />Delete Area
                    </ToggleButton>
                    <ToggleButton value="delete_pitch" aria-label="delete_pitch">
                        <HighlightOffIcon style={{ marginRight: 10 }} />Delete Pitch
                    </ToggleButton>
                    <ToggleButton value="delete_all_pitches" aria-label="delete_all_pitches">
                        <DeleteForeverIcon style={{ marginRight: 10 }} />Delete All Pitches
                    </ToggleButton>
                    {Object.keys(pitches).map((key, index) => (
                        <ToggleButton key={index} value={key} aria-label={pitches[key]}>
                            <SignalCellularNullIcon style={{ marginRight: 10 }} />{pitches[key]}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            :
                <ToggleButtonGroup orientation="vertical" value={pitchValue} exclusive onChange={handlePitchChange}>
                    <ToggleButton value="select_facets" aria-label="select_facets">
                        <DoneAllIcon style={{ marginRight: 10 }} />Select Area
                    </ToggleButton>
                    <ToggleButton value="facet_name" aria-label="facet_name">
                        <TextFieldsIcon style={{ marginRight: 10 }} />Area Name
                    </ToggleButton>
                    <ToggleButton value="delete_facet" aria-label="delete_facet">
                        <HighlightOffIcon style={{ marginRight: 10, color: '#ff0000' }} />Delete Area
                    </ToggleButton>
                </ToggleButtonGroup>
            }
        </div>
        <Dialog className={classes.dialog}
                open={changeFacetNameDialogOpen} onClose={handleChangeFacetNameDialogClose}
                aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle>Change Area Name</DialogTitle>
            <DialogContent>
                <TextField className={classes.textBox}
                    name="facetName" label="Area Name"
                    InputLabelProps={{shrink: true}}
                    value={facetName} onChange={(e) => setFacetName(e.target.value)}
                    variant="outlined" fullWidth autoComplete="off"
                />
                <ColorPicker
                    value={facetColor}
                    onChange={color => setFacetColor(color)}
                />
                <Grid container spacing={3} style={{marginTop:24}}>
                    <Grid item xs={12} sm={6}>
                        <Button variant="outlined" color="default" 
                                className={classes.cancelButton}
                                onClick={handleChangeFacetNameDialogClose}
                        >Cancel</Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button type="submit" variant="contained" color="primary"
                                className={classes.submitButton}
                                onClick={handleChangeFacetNameDialogOk}
                        >OK</Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
        <Dialog className={classes.dialog}
                open={deleteSelectedFacetsDialogOpen} onClose={handleDeleteSelectedFacetsDialogClose}>
            <DialogTitle disableTypography={true}>Delete Selected Edges</DialogTitle>
            <DialogContent>
                <Grid container justifyContent="center" style={{marginBottom:40,fontSize:16,color:'#171d29',fontStyle:'normal',fontWeight:700}}>
                    Are you sure you want to delete selected areas ?
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Button variant="outlined" color="default" 
                                className={classes.cancelButton}
                                onClick={handleDeleteSelectedFacetsDialogClose}
                        >No</Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button type="submit" variant="contained" 
                                className={classes.submitButton} style={{backgroundColor:'#f53e3e'}}
                                onClick={handleDeleteSelectedFacetsDialogOk}
                        >Yes</Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
        <Dialog className={classes.dialog}
                open={deleteAllPitchesDialogOpen} onClose={handleDeleteAllPitchesDialogClose}>
            <DialogTitle disableTypography={true}>Delete All Pitches</DialogTitle>
            <DialogContent>
                <Grid container justifyContent="center" style={{marginBottom:40,fontSize:16,color:'#171d29',fontStyle:'normal',fontWeight:700}}>
                   Are you sure you want to delete all pitches ?
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Button variant="outlined" color="default" 
                                className={classes.cancelButton}
                                onClick={handleDeleteAllPitchesDialogClose}
                        >No</Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button type="submit" variant="contained" 
                                className={classes.submitButton} style={{backgroundColor:'#f53e3e'}}
                                onClick={handleDeleteAllPitchesDialogOk}
                        >Yes</Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
        </>
   );
}

export default withStyles(styles)(FacetTools);
import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import CropIcon from '@material-ui/icons/Crop';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import LinearScaleIcon from '@material-ui/icons/LinearScale';

import { metersToFeetLabel } from "../../utils/util"

const styles = (theme) => ({
    legendPanel: {
        position: 'absolute',
        top: 24,
        left: 24,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        minWidth:200,
        maxWidth:280,
        maxHeight:600,
        borderRadius: 8,
        //border:'1px solid #b8c5d0',
        backgroundColor: 'white',
        overflowY:'auto',
        [theme.breakpoints.down('md')]: {
            top: 10,
            left: 10
        }
    },
    accordion:{
        //marginBottom:8,
        padding:8,
        paddingBottom:0,
        boxShadow:'none',
        '&:before': {
          display: 'none',
        },
        '&.MuiAccordion-root.Mui-expanded':{
            margin:0
        },
        '& .MuiAccordionSummary-root':{
           padding:0,
           paddingBottom:8,
           minHeight:'auto',
           borderRadius:0,
           borderBottom:'1px solid #76778633',
           backgroundColor:'transparent'
        },
        '& .MuiAccordionSummary-expandIcon':{
            margin:0,
            width:16,
            height:16,
            borderRadius:8,
            //backgroundColor:'#f5f5f5',
        },
        '& .MuiAccordionSummary-content':{
           margin:0,
           color:'#767786',
           fontSize:14,
           fontWeight:700,
           //textTransform:'uppercase',
        },
        '& .MuiAccordionSummary-content.Mui-expanded':{
           margin:0
        },
        '& .MuiAccordionDetails-root':{
            padding:0,
            color:'#767786',
            fontSize:14,
            fontWeight:400
        }
    }
});

function Legend(props) {

    const { classes, drawLayers, layerValue } = props;
    const [accordionExpanded, setAccordionExpanded] = useState(null);

    const handleAccordionChange = (key) => (e, newExpanded) => {
        setAccordionExpanded(newExpanded ? key : false);
    }

    return (
        <div className={classes.legendPanel}>
           {(drawLayers && layerValue) && (
              Object.keys(drawLayers[layerValue]['facets']).map((key,index)=>(
                <Accordion key={key} 
                           className={classes.accordion} 
                           expanded={accordionExpanded===key}
                           onChange={handleAccordionChange(key)}
                >
                    <AccordionSummary>
                        <Grid container direction="row" justifyContent="center" alignItems="center">
                            <Grid item xs={2}>
                               <Grid container alignItems="center">
                                 <CropIcon color={accordionExpanded===key?'primary':'inherit'} style={{width:16,height:16}} />
                               </Grid>
                            </Grid>
                            <Grid item xs={2}>
                                <Grid container alignItems="center">
                                    {
                                        accordionExpanded===key?
                                        <RemoveIcon color="primary" style={{width:16,height:16}} />
                                        :
                                        <AddIcon color="inherit" style={{width:16,height:16}} />
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={8}>
                                <Grid container justifyContent="flex-end">
                                   {
                                     drawLayers[layerValue]['facets'][key].name===''?
                                        <span style={{color:accordionExpanded===key?'#5c77ff':'#767786'}}>{`Area-${index+1}`}</span>
                                     :
                                        <span style={{color:accordionExpanded===key?'#5c77ff':'#767786'}}>{`${drawLayers[layerValue]['facets'][key].name}`}</span>
                                   }
                                </Grid>
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container direction="column">
                            <Grid container justifyContent="space-between" style={{paddingTop:8,paddingBottom:8}}>
                              <span>Area Size</span>
                              <span>{Math.floor(drawLayers[layerValue]['facets'][key]['sqft'])} sqft</span>
                            </Grid>
                            <Grid container alignItems="center" style={{marginBottom:8}}>
                               <LinearScaleIcon style={{marginRight:4,color:'#f29c38'}} />
                               <div style={{fontWeight:700}}>Length</div>
                            </Grid>
                            
                            {drawLayers[layerValue]['facets'][key]['edgeKeys'].map((edgeKey,index)=>(
                                <Grid key={edgeKey} container justifyContent="space-between" style={{marginBottom:8}}>
                                   {
                                       drawLayers[layerValue]['edges'][edgeKey].name===''?
                                        <span>
                                           {`Length-${Object.keys(drawLayers[layerValue]['edges']).indexOf(edgeKey)+1}`}
                                        </span>
                                       :
                                        <span>{drawLayers[layerValue]['edges'][edgeKey].name}</span>
                                   }
                                   <span>
                                      { metersToFeetLabel(drawLayers[layerValue]['edges'][edgeKey].length_m) }
                                   </span>
                                </Grid>
                            ))}
                        </Grid>
                    </AccordionDetails>
                </Accordion>    
           )))}
        </div>
    );
}

export default withStyles(styles)(Legend);
import React from 'react';
import clsx from  'clsx';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';

import AddIcon from '@material-ui/icons/Add';

import BootstrapTooltip from '../customs/BootstrapToolTip';

const styles = (theme) => ({
    layersPanelPosition_1:{
        top: 24,
        left: 24,
        [theme.breakpoints.down('md')]: {
            top: 10,
            left: 10
        }
    },
    layersPanelPosition_2:{
        bottom: 24,
        right: 24,
        [theme.breakpoints.down('md')]: {
            bottom: 10,
            right: 10
        }
    },
    layersPanel: {
        position: 'absolute',
        //bottom: 24,
        //right: 24,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 8,
        //border:'1px solid #b8c5d0',
        backgroundColor: 'white',
        '& .MuiToggleButton-root': {
            padding: 8,
            border:0,
            borderRadius:0,
            textTransform: 'unset',
            color: '#767786',
            //fontWeight:'normal'
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
        '& .MuiButton-root': {
            minWidth: 'unset',
            padding: 8,
            borderRadius: 0,
            color: '#767786',
            fontWeight: 'normal'
        },
        '& .MuiButtonBase-root:hover': {
            color: '#5c77ff'
        }
    },
    panelHeader: {
        padding: 10,
        fontFamily: 'Roboto',
        color: '#5c77ff',
        fontSize: 16,
        textAlign: 'center'
    }
});

function Layers(props) {

    const { classes, projectType, drawLayers, setDrawLayers, layers, setLayers, layerValue, setLayerValue } = props;
    
    const handleAddLayer = () => {
        const layerKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        if (layers.length >= 3) {
            return;
        } else {
            let layerKey = layerKeys[layers.length];
            let newDrawLayers = JSON.parse(JSON.stringify(drawLayers));
            newDrawLayers[layerKey] = {
                'vertexes':{},
                'edges':{},
                'facets':{}
            }
            setDrawLayers(newDrawLayers);
            setLayers([...layers, layerKey]);
        }
    };

    const handleLayerChange = (event, value) => {
        if (value != null) {
            setLayerValue(value);
        }
    };

    return (
        <div className={clsx(projectType==='Steep Slope Roofs'?classes.layersPanelPosition_1:classes.layersPanelPosition_2,classes.layersPanel)}>
            <div className={classes.panelHeader}>Layers</div>
            <BootstrapTooltip title="Add Layer" placement="right">
                <Button onClick={handleAddLayer}><AddIcon /></Button>
            </BootstrapTooltip>
            <ToggleButtonGroup orientation="vertical" value={layerValue} exclusive onChange={(handleLayerChange)}>
                {
                    layers.map((key, index) => (
                        <ToggleButton key={key} value={key} aria-label={key}>{key}</ToggleButton>
                    ))
                }
            </ToggleButtonGroup>
        </div>
    );
}

export default withStyles(styles)(Layers);
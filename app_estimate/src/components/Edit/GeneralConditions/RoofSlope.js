import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import {slopeDefinitionItems, slopeValueItems, selectMenuProps } from '../../../utils/constants';

const styles = (theme) => ({
    sectionTitle:{
        padding:'24px 0',
        fontFamily:'Roboto',
        fontSize:14,
        fontWeight:500,
        fontStyle:'normal',
        color:'#767786',
        textTransform:'uppercase'
    },
    paper:{
        padding:24,
        paddingBottom:0,
        boxShadow:'none',
        borderRadius:8,
        border:'1px solid #76778633'
    },
    textBox:{
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
    }
}); 

function RoofSlope(props){
    const {classes, options, setOptions} = props;
    const handleChangeOptions = (key1, key2) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        newOptions[key1][key2] = e.target.value;
        setOptions(newOptions);
    }
    return(
        <Paper className={classes.paper}>
            <TextField 
                className={classes.textBox}
                variant="outlined"
                label="Slope definition"
                fullWidth
                InputLabelProps={{shrink: true}}
                select={true}
                SelectProps={selectMenuProps}
                value={options['roofSlope']['slopeDefinition']}
                onChange={handleChangeOptions('roofSlope','slopeDefinition')}
            >{slopeDefinitionItems.map((item,index)=><MenuItem key={item} value={item}>{item}</MenuItem>)}
            </TextField>
            <TextField 
                className={classes.textBox}
                variant="outlined"
                label="Low Slope Roofs Slope"
                fullWidth
                InputLabelProps={{shrink: true}}
                select={true}
                SelectProps={selectMenuProps}
                value={options['roofSlope']['slopeValue']}
                onChange={handleChangeOptions('roofSlope','slopeValue')}
            >{slopeValueItems.map((item,index)=><MenuItem key={item} value={item}>{item}</MenuItem>)}
            </TextField>
        </Paper>
    )
}

export default withStyles(styles)(RoofSlope);

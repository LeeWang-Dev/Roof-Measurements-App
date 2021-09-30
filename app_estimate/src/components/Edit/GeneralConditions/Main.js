import React, {useState, useRef} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';

import GeneralConditions from './GeneralConditions';
import RoofSlope from './RoofSlope';
import RoofDrainage from './RoofDrainage';
import WallDetails from './WallDetails';
import RoofDetails from './RoofDetails';

const styles = (theme) => ({
    container:{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        padding: 20,
        boxSizing:'border-box',
        zIndex: 100,
        backgroundColor: '#fafafa',
        overflowX: 'hidden',
        overflowY: 'auto'
   },
   header:{
     //width:'100%',
     //maxWidth:719
     paddingTop:20,
     paddingBottom:20,
     marginBottom:40
   },
   content:{
     width:'100%',
     maxWidth:684
   },
   toggleButtons:{
        '& .MuiToggleButton-root': {
            padding: 16,
            border: '1px solid #767786',
            justifyContent: 'start',
            textTransform: 'uppercase',
            fontSize:14,
            color: '#767786',
            fontWeight: 500,
            fontStyle:'normal',
            backgroundColor:'#fff',
            [theme.breakpoints.down('xs')]: {
               padding:4,
               fontSize:12,
            }
        },
        '& .MuiToggleButton-root:hover': {
            backgroundColor:'#f8f8f8',
        },
        '& .MuiToggleButton-root.Mui-selected': {
            backgroundColor:'#5c77ff',
            border:'1px solid #5c77ff',
            color:'#fff',
            fontWeight:700
        }
    },
}); 

function Main(props){
  const {
      classes, options, setOptions,
      uploadFiles, setUploadFiles
  } = props;
  const scrollRef = useRef(null)
  const [toggleValue, setToggleValue] = useState('general_conditions');

  return(
     <Grid container className={classes.container} direction="column" alignItems="center" wrap="nowrap" ref={scrollRef}>
        <div className={classes.header}>
            <ToggleButtonGroup className={classes.toggleButtons} 
                value={toggleValue} exclusive
                onChange={(e, newValue) => setToggleValue(newValue)} aria-label="general conditions button group"
            >
                <ToggleButton value="general_conditions" aria-label="General Conditions">
                   GENERAL CONDITIONS
                </ToggleButton>
                <ToggleButton value="roof_slope" aria-label="Roof Slope">
                    ROOF SLOPE
                </ToggleButton>
                <ToggleButton value="roof_drainage" aria-label="Roof Drainage">
                    ROOF DRAINAGE
                </ToggleButton>
                <ToggleButton value="wall_details" aria-label="Wall Details">
                    WALL DETAILS
                </ToggleButton>
                <ToggleButton value="roof_details" aria-label="Roof Details">
                    ROOF DETAILS
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
        <div className={classes.content}>
          {toggleValue==='general_conditions' &&
              <GeneralConditions
                 options={options}
                 setOptions={setOptions} 
                 uploadFiles={uploadFiles}
                 setUploadFiles={setUploadFiles}
               />
          }
          {toggleValue==='roof_slope' && <RoofSlope options={options} setOptions={setOptions} />}
          {toggleValue==='roof_drainage' && 
              <RoofDrainage
                 options={options}
                 setOptions={setOptions}
                 uploadFiles={uploadFiles}
                 setUploadFiles={setUploadFiles}
                 scrollRef={scrollRef}
              />
          }
          {toggleValue==='wall_details' &&
             <WallDetails 
                 options={options}
                 setOptions={setOptions}
                 uploadFiles={uploadFiles}
                 setUploadFiles={setUploadFiles}
             />
          }
          {toggleValue==='roof_details' && 
              <RoofDetails
                 options={options}
                 setOptions={setOptions}
                 uploadFiles={uploadFiles}
                 setUploadFiles={setUploadFiles}
                 scrollRef={scrollRef}
              />
          }
        </div>
     </Grid>
  );
}

export default withStyles(styles)(Main);
import React, {useState,useEffect} from 'react';
import clsx from  'clsx';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';

import MapIcon from '@material-ui/icons/Map';

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import BootstrapTooltip from '../customs/BootstrapToolTip';
import InchesFormat from '../customs/InchesFormat';
import {google,projectTypes,roofAccessItems,selectMenuProps} from '../../utils/constants';

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
        backgroundColor: '#fff',
        overflowX: 'hidden',
        overflowY: 'auto'
   },
   content:{
      width:'100%',
      maxWidth:684
   },
   title:{
        padding:'24px 0',
        borderBottom:'1px solid #76778633',
        fontSize:24,
        fontWeight:500,
        fontStyle:'normal',
        color:'#171d29'
   },
   sectionTitle:{
        padding:'24px 0',
        fontFamily:'Roboto',
        fontSize:14,
        fontWeight:500,
        fontStyle:'normal',
        color:'#767786',
        textTransform:'uppercase'
   },
   textBox:{
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
    },
    spacious:{
        marginBottom:24
    }
}); 

function ProjectInformation(props){

  const {classes, options, setOptions, viewport, setViewport } = props;

  const [location, setLocation] = useState(null);
  
  const handleChangeOptions = (key1, key2) => (e) => {
      let newOptions = JSON.parse(JSON.stringify(options));
      newOptions[key1][key2] = e.target.value;
      setOptions(newOptions);
  }

  const handleViewGoogleMapsOpenClick = () => {
        if(location){
            var toUrl = [
                'https://www.google.com/maps/@?api=1&map_action=map',
                `zoom=20`,
                `basemap=satellite`,
                `center=${location.lat},${location.lng}`
            ].join('&');
            window.open(toUrl, '_blank');
        }
  }

  useEffect(() => {
    var input = document.getElementById("input-address");
    const autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        var searchLocation = place.geometry.location.toJSON();
        let newOptions = JSON.parse(JSON.stringify(options));
        newOptions['basicInformation']['location'] = searchLocation;
        newOptions['basicInformation']['address'] = place.formatted_address;
        var address_components = place.address_components;
        for(let i=0;i<address_components.length;i++){
            var component = address_components[i];
            var type = component.types[0];
            if(type === 'administrative_area_level_1'){
                newOptions['basicInformation']['state'] = component.long_name;
            }else if(type === 'locality'){
                newOptions['basicInformation']['city'] = component.long_name;
            }else if(type === 'postal_code'){
                newOptions['basicInformation']['zipCode'] = component.long_name;
            }
        }
        setOptions(newOptions);
        setLocation(place.geometry.location.toJSON());
        setViewport({
            ...viewport,
            longitude:searchLocation.lng,
            latitude:searchLocation.lat
        })
    });
        
  },[]);
 
  return(
     <Grid container className={classes.container} justifyContent="center">
         <div className={classes.content}>
            <div className={classes.title}>Project Information</div>
            <ValidatorForm onSubmit={(e)=>e.preventDefault()} style={{ width: '100%' }}>
                <div className={classes.sectionTitle}>Basic Information</div>
                <TextField 
                    className={clsx(classes.textBox,classes.spacious)}
                    label="Name project"
                    placeholder="Enter your project name."
                    variant="outlined"
                    InputLabelProps={{shrink: true}} 
                    fullWidth
                    autoComplete="off"
                    value={options['basicInformation']['projectName']}
                    onChange={handleChangeOptions('basicInformation','projectName')}
                />
                <TextField 
                    className={clsx(classes.textBox,classes.spacious)}
                    variant="outlined"
                    label="Select type project"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    select={true}
                    SelectProps={selectMenuProps}
                    value={options['basicInformation']['projectType']}
                    onChange={handleChangeOptions('basicInformation','projectType')}
                >{projectTypes.map((item,index)=><MenuItem key={item} value={item}>{item}</MenuItem>)}
                </TextField>
                <Grid container justifyContent="space-between" alignItems="center" style={{marginBottom:24}}>
                    <div style={{flex:1,marginRight:10}}>
                        <TextField 
                            className={classes.textBox}
                            id="input-address"
                            label="Address"
                            variant="outlined"
                            InputLabelProps={{shrink: true}}
                            placeholder="Enter your address."
                            fullWidth
                            autoComplete="off"
                            value={options['basicInformation']['address']}
                            onChange={handleChangeOptions('basicInformation','address')}
                        />
                    </div>
                    <BootstrapTooltip  title="View Google Maps" placement="top">
                        <IconButton color="primary" aria-label="View Google Map" onClick={handleViewGoogleMapsOpenClick}>
                            <MapIcon />
                        </IconButton>
                    </BootstrapTooltip>
                </Grid>
                <Grid container spacing={3} style={{marginBottom:16}}>
                    <Grid item xs={12} sm={4}>
                        <TextField 
                            className={classes.textBox} 
                            label="City"
                            variant="outlined"
                            InputLabelProps={{shrink: true}} 
                            fullWidth
                            autoComplete="off"
                            value={options['basicInformation']['city']}
                            onChange={handleChangeOptions('basicInformation','city')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField 
                            className={classes.textBox} 
                            label="State"
                            variant="outlined"
                            InputLabelProps={{shrink: true}} 
                            fullWidth
                            autoComplete="off"
                            value={options['basicInformation']['state']}
                            onChange={handleChangeOptions('basicInformation','state')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField 
                            className={classes.textBox} 
                            label="Zip"
                            variant="outlined"
                            InputLabelProps={{shrink: true}} 
                            fullWidth
                            autoComplete="off"
                            value={options['basicInformation']['zipCode']}
                            onChange={handleChangeOptions('basicInformation','zipCode')}
                        />
                    </Grid>
                </Grid>
                <TextField 
                    className={clsx(classes.textBox,classes.spacious)}
                    label="Contact name"
                    variant="outlined"
                    InputLabelProps={{shrink: true}} 
                    fullWidth
                    autoComplete="off"
                    value={options['basicInformation']['contactName']}
                    onChange={handleChangeOptions('basicInformation','contactName')}
                />
                <TextValidator 
                        className={clsx(classes.textBox,classes.spacious)}
                        label="Email" 
                        placeholder="sergio@example.com"
                        variant="outlined"
                        InputLabelProps={{shrink: true}}
                        fullWidth
                        autoComplete="off"
                        value={options['basicInformation']['email']}
                        onChange={handleChangeOptions('basicInformation','email')}
                        validators={['isEmail']} errorMessages={['Email is not valid']}
                />
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <TextField 
                            className={classes.textBox} 
                            label="Phone"
                            variant="outlined"
                            InputLabelProps={{shrink: true}} 
                            fullWidth
                            autoComplete="off"
                            value={options['basicInformation']['phone']}
                            onChange={handleChangeOptions('basicInformation','phone')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                       <TextField 
                            className={classes.textBox} 
                            label="Mobile Phone"
                            variant="outlined"
                            InputLabelProps={{shrink: true}} 
                            fullWidth
                            autoComplete="off"
                            value={options['basicInformation']['mobilePhone']}
                            onChange={handleChangeOptions('basicInformation','mobilePhone')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                       <TextField 
                            className={classes.textBox} 
                            label="Fax"
                            variant="outlined"
                            InputLabelProps={{shrink: true}} 
                            fullWidth
                            autoComplete="off"
                            value={options['basicInformation']['fax']}
                            onChange={handleChangeOptions('basicInformation','fax')}
                        />
                    </Grid>
                </Grid>
                <div className={classes.sectionTitle}>Property Access</div>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <InchesFormat
                            className={classes.textBox} 
                            label="Building height"
                            value={options['propertyAccess']['buildingHeight']}
                            onChange={handleChangeOptions('propertyAccess','buildingHeight')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {['',...roofAccessItems].includes(options['propertyAccess']['roofAccess'])?
                            <TextField 
                                className={classes.textBox}
                                variant="outlined"
                                label="Roof access"
                                fullWidth
                                InputLabelProps={{shrink: true}}
                                select={true}
                                SelectProps={selectMenuProps}
                                value={options['propertyAccess']['roofAccess']}
                                onChange={handleChangeOptions('propertyAccess','roofAccess')}
                            >{[...roofAccessItems,'Other (Add Text)'].map((item,index)=><MenuItem key={item} value={item}>{item}</MenuItem>)}
                            </TextField>
                          :
                            <TextField 
                                className={classes.textBox}
                                variant="outlined"
                                label="Roof access"
                                fullWidth
                                InputLabelProps={{shrink: true}}
                                value={options['propertyAccess']['roofAccess']}
                                onChange={handleChangeOptions('propertyAccess','roofAccess')}
                                onFocus={e=>e.target.select()}
                            />
                        }
                    </Grid>
                </Grid>
                
                <div className={classes.sectionTitle}>Miscellaneous Information</div>
                <TextField 
                    className={clsx(classes.textBox,classes.spacious)} 
                    label="Sales status"
                    variant="outlined"
                    InputLabelProps={{shrink: true}} 
                    fullWidth
                    autoComplete="off"
                    value={options['miscellaneousInformation']['salesStatus']}
                    onChange={handleChangeOptions('miscellaneousInformation','salesStatus')}
                />
                 <TextField 
                    className={clsx(classes.textBox,classes.spacious)} 
                    label="Marketing status"
                    variant="outlined"
                    InputLabelProps={{shrink: true}} 
                    fullWidth
                    autoComplete="off"
                    value={options['miscellaneousInformation']['marketingStatus']}
                    onChange={handleChangeOptions('miscellaneousInformation','marketingStatus')}
                />
                <TextField 
                    className={clsx(classes.textBox,classes.spacious)}
                    type="date"
                    label="Bid Date"
                    variant="outlined"
                    InputLabelProps={{shrink: true}} 
                    fullWidth
                    autoComplete="off"
                    value={options['miscellaneousInformation']['bidDate']}
                    onChange={handleChangeOptions('miscellaneousInformation','bidDate')}
                />
                <TextField 
                    className={clsx(classes.textBox,classes.spacious)} 
                    label="Lead Form"
                    variant="outlined"
                    InputLabelProps={{shrink: true}} 
                    fullWidth
                    autoComplete="off"
                    value={options['miscellaneousInformation']['leadForm']}
                    onChange={handleChangeOptions('miscellaneousInformation','leadForm')}
                />
                <TextField 
                    className={clsx(classes.textBox,classes.spacious)}
                    label="Estimator"
                    variant="outlined"
                    InputLabelProps={{shrink: true}} 
                    fullWidth
                    autoComplete="off"
                    value={options['miscellaneousInformation']['estimator']}
                    onChange={handleChangeOptions('miscellaneousInformation','estimator')}
                />
                <TextField 
                    className={clsx(classes.textBox,classes.spacious)} 
                    label="Account manager"
                    variant="outlined"
                    InputLabelProps={{shrink: true}} 
                    fullWidth
                    autoComplete="off"
                    value={options['miscellaneousInformation']['accountManager']}
                    onChange={handleChangeOptions('miscellaneousInformation','accountManager')}
                />
                <TextField 
                    className={clsx(classes.textBox,classes.spacious)}
                    label="Take off person"
                    variant="outlined"
                    InputLabelProps={{shrink: true}} 
                    fullWidth
                    autoComplete="off"
                    value={options['miscellaneousInformation']['takeOffPerson']}
                    onChange={handleChangeOptions('miscellaneousInformation','takeOffPerson')}
                />
                <TextField 
                    className={clsx(classes.textBox,classes.spacious)} 
                    label={`Products & Services`}
                    variant="outlined"
                    InputLabelProps={{shrink: true}} 
                    fullWidth
                    autoComplete="off"
                    value={options['miscellaneousInformation']['productsServices']}
                    onChange={handleChangeOptions('miscellaneousInformation','productsServices')}
                />
                <TextField 
                    className={clsx(classes.textBox,classes.spacious)} 
                    label="Client Profile"
                    variant="outlined"
                    InputLabelProps={{shrink: true}} 
                    fullWidth
                    autoComplete="off"
                    value={options['miscellaneousInformation']['clientProfile']}
                    onChange={handleChangeOptions('miscellaneousInformation','clientProfile')}
                />
                <TextField 
                    className={clsx(classes.textBox,classes.spacious)} 
                    label="Contract Type"
                    variant="outlined"
                    InputLabelProps={{shrink: true}} 
                    fullWidth
                    autoComplete="off"
                    value={options['miscellaneousInformation']['contractType']}
                    onChange={handleChangeOptions('miscellaneousInformation','contractType')}
                />
                <TextField 
                    className={clsx(classes.textBox,classes.spacious)} 
                    label="BDM"
                    variant="outlined"
                    InputLabelProps={{shrink: true}} 
                    fullWidth
                    autoComplete="off"
                    value={options['miscellaneousInformation']['bdm']}
                    onChange={handleChangeOptions('miscellaneousInformation','bdm')}
                />
                <TextField 
                    className={clsx(classes.textBox,classes.spacious)}
                    label="Hard bid"
                    variant="outlined"
                    InputLabelProps={{shrink: true}} 
                    fullWidth
                    autoComplete="off"
                    value={options['miscellaneousInformation']['hardBid']}
                    onChange={handleChangeOptions('miscellaneousInformation','hardBid')}
                />
            </ValidatorForm>
         </div>
     </Grid>
  );
}

export default withStyles(styles)(ProjectInformation);
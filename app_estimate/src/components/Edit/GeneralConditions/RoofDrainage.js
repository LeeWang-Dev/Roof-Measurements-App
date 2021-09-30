import React, {useState} from 'react';
import clsx from  'clsx';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Link from '@material-ui/core/Link';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { v4 as uuidv4 } from 'uuid';
import Carousel, { Modal, ModalGateway } from 'react-images'

import InchesFormat from '../../customs/InchesFormat';
import { 
    drainageTypes, materialTypes,
    customModalStyles, customCarouselStyles, selectMenuProps
} from '../../../utils/constants';

import imgEOS from '../../../assets/images/eos.png';
import imgPrimaryScuppers from '../../../assets/images/primary-scuppers.png';
import imgGutters from '../../../assets/images/gutters.png';
import imgDownspout from '../../../assets/images/downspout.png';
import imgLeaderheads from '../../../assets/images/leaderheads.png';

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
        marginBottom:24,
        boxShadow:'none',
        borderRadius:8,
        border:'1px solid #76778633'
    },
    accordion:{
        marginBottom:8,
        boxShadow:'none',
        '&:before': {
          display: 'none',
        },
        '&.MuiAccordion-root.Mui-expanded':{
            margin:0
        },
        '& .MuiAccordionSummary-root':{
           padding:0,
           minHeight:56,
           borderRadius:0,
           borderTop:'1px solid #76778633',
           backgroundColor:'transparent'
        },
        '& .MuiAccordionSummary-content':{
           margin:0,
           color:'#767786',
           fontSize:14,
           fontWeight:700,
           textTransform:'uppercase',
        },
        '& .MuiAccordionSummary-content.Mui-expanded':{
           margin:0
        },
        '& .MuiAccordionSummary-expandIcon':{
           margin:0,
           width:20,
           height:20,
           borderRadius:8,
           backgroundColor:'#f5f5f5',
        },
        '& .MuiAccordionDetails-root':{
            padding:0
        }
    },
    formControl:{
        width:'100%',
        paddingLeft:24,
        //marginBottom:32,
        '& .MuiFormLabel-root':{
            marginBottom:6,
            fontSize:12,
            fontWeight:400,
            color:'#767786',
            opacity:0.8
        },
        '& .MuiFormControlLabel-label':{
            color:'#171d29',
            fontSize:14,
            fontWeight:500
        }
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
    },
    itemLabel:{
        marginBottom:10,
        fontSize:12,
        fontWeight:400,
        color:'#767786',
        opacity:0.8
    },
    buttonPrimary:{
        height:40,
        padding:'12px 16px',
        border:0,
        borderRadius:8,
        backgroundColor:'#5c77ff',
        '& span':{
           fontSize:14,
           fontWeight:700,
           color:'#fff'
        }
    },
    buttonDefault:{
        height:40,
        padding:'12px 16px',
        borderRadius:8,
        border:'1px solid #767786',
        backgroundColor:'transparent',
        '& span':{
           fontSize:14,
           fontWeight:700,
           color:'#767786'
        }
    },
    addButton:{
        '& .MuiButton-root':{
           lineHeight:'normal'
        },
       '&:hover':{
           border:0,
           backgroundColor:'transparent'
       },
       '& span':{
           fontSize:14,
           fontWeight:500,
           textTransform:'uppercase'
       }
    },
    removeButton:{
        color:'#767786',
        '&:hover':{
            border:0,
            backgroundColor:'transparent'
        },
        '& span':{
            fontSize:14,
            fontWeight:500,
            textTransform:'uppercase'
        }
    },
    uploadPicture:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height:140,
        borderRadius:8,
        border:'2px dashed #767786',
        fontSize:12,
        fontWeight:500,
        color:'#5c77ff',
        fontStyle:'normal',
        cursor:'pointer',
        '& .MuiSvgIcon-root':{
            marginBottom:4
        }
    },
    imageBox:{
        position:'relative',
        cursor:'pointer',
        '& .MuiAvatar-root':{
            width:'100%',
            height: 140,
            borderRadius:8,
        },
        '& button':{
            display:'none',
            position:'absolute',
            top:0,
            right:0,
            color:'#fff',
            zIndex:9999
        },
        '&:hover':{
            '& button':{
                display:'block'
            }
        }
    }
}); 

function RoofDrainage(props){
    const {
        classes, options, setOptions,
        uploadFiles, setUploadFiles,
        scrollRef
    } = props;
    
    const [helpDialogOpen, setHelpDialogOpen] = useState(false);
    const [helpImage, setHelpImage] = useState('');
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [accordionExpanded, setAccordionExpanded] = useState(null);

    const handleHelpDialogOpen = (drainageType,subType) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        switch (drainageType) {
            case 'Internal Drains':
                setHelpImage(imgEOS);
                break;
            case 'Primary Scuppers':
                if(subType==='EOS'){
                  setHelpImage(imgEOS);
                }else{
                  setHelpImage(imgPrimaryScuppers);
                }
                break;
            case 'Gutter':
                setHelpImage(imgGutters);
                break;
            case 'Downspout':
                setHelpImage(imgDownspout);
                break;    
            case 'Leaderheads':
                setHelpImage(imgLeaderheads);
                break;       
            default:
                setHelpImage('');
                break;
        }
        setHelpDialogOpen(true);
    }

    const handleImageDialogOpen = (drainageIndex, index,imgIndex) => (e) => {
        var newImages = uploadFiles['roofDrainage'][drainageIndex][index]['images'].map(imgSrc=>{
            return {source:imgSrc}
        });
        setImages(newImages);
        setCurrentImage(imgIndex);
        setImageDialogOpen(true);
    }

    const handleChangeOptions = (key) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        newOptions['roofDrainage'][key] = e.target.value;
        setOptions(newOptions);
    }

    const handleAddRoofDrainageItem = () => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var types = drainageTypes[Object.keys(drainageTypes)[0]]['types'];
        var dimensions = drainageTypes[Object.keys(drainageTypes)[0]]['dimensions'];
        newOptions['roofDrainage']['drainageItems'] = [
            ...newOptions['roofDrainage']['drainageItems'],
            {
                drainageType: Object.keys(drainageTypes)[0],
                items:[{
                    overflowsPresents:'yes',
                    size:'',
                    type: types.length>0?types[0]:'',
                    material: materialTypes[0],
                    dimensions: { ...dimensions },
                    images:[]
                }]
            }
        ];
        setOptions(newOptions);

        let newUploadFiles = {...uploadFiles};
        newUploadFiles['roofDrainage'].push([{ files:[], images:[] }]);
        setUploadFiles(newUploadFiles);

        setTimeout(() => {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }, 500);
    }

    const handleRemoveRoofDrainageItem = (removeIndex) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var drainageItems = newOptions['roofDrainage']['drainageItems'];
        var newItems = drainageItems.filter((item,index) => index !== removeIndex);
        newOptions['roofDrainage']['drainageItems'] = newItems;
        setOptions(newOptions);

        let newUploadFiles = {...uploadFiles};
        var newImageItems = newUploadFiles['roofDrainage'].filter((item,index) => index !== removeIndex);
        newUploadFiles['roofDrainage'] = newImageItems
        setUploadFiles(newUploadFiles);
    }

    const handleChangeRoofDrainageItem = (updateIndex, key) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        if(key==='drainageType'){
            let drainageType = e.target.value;
            if(['Internal Drains','Primary Scuppers'].includes(drainageType)){
                let types = drainageTypes[drainageType]['types'];
                let dimensions = drainageTypes[drainageType]['dimensions'];
                newOptions['roofDrainage']['drainageItems'][updateIndex] = {
                    drainageType: drainageType,
                    items:[{
                        overflowsPresents:'yes',
                        size:'',
                        type: types.length>0?types[0]:'',
                        material: materialTypes[0],
                        dimensions: { ...dimensions },
                        images:[]
                    }]
                };
            }else if(['Gutter','Downspout','Leaderheads'].includes(drainageType)){
                let types = drainageTypes[drainageType]['types'];
                let dimensions = drainageTypes[drainageType]['dimensions'];
                newOptions['roofDrainage']['drainageItems'][updateIndex] = {
                    drainageType: drainageType,
                    items:[{
                        size:'',
                        type: types.length>0?types[0]:'',
                        material: materialTypes[0],
                        dimensions: { ...dimensions },
                        images:[]
                    }]
                };
            }else{
                newOptions['roofDrainage']['drainageItems'][updateIndex] = {
                    drainageType: drainageType,
                    items:[{
                        images:[]
                    }]
                };
            }
            let newUploadFiles = {...uploadFiles};
            newUploadFiles['roofDrainage'][updateIndex] = [{
                files:[],
                images:[]
            }]
            setUploadFiles(newUploadFiles);
        }else{
            newOptions['roofDrainage']['drainageItems'][updateIndex][key] = e.target.value;
        }
        setOptions(newOptions);
    }
    
    const handleAddRoofDrainageSubItem = (drainageIndex) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var drainageType = newOptions['roofDrainage']['drainageItems'][drainageIndex].drainageType;
        var types = drainageTypes[drainageType]['types'];
        var dimensions = drainageTypes[drainageType]['dimensions'];
        newOptions['roofDrainage']['drainageItems'][drainageIndex]['items'] = [
            ...newOptions['roofDrainage']['drainageItems'][drainageIndex]['items'],
            {
                overflowsPresents:'yes',
                size:'',
                type: types.length>0?types[0]:'',
                material: materialTypes[0],
                dimensions: { ...dimensions },
                images:[]
            }
        ];
        setOptions(newOptions);
        setAccordionExpanded(`drainageItem-${drainageIndex}-${newOptions['roofDrainage']['drainageItems'][drainageIndex]['items'].length-1}`);

        let newUploadFiles = {...uploadFiles};
        newUploadFiles['roofDrainage'][drainageIndex].push({ files:[], images:[] });
        setUploadFiles(newUploadFiles);
    }

    const handleChangeRoofDrainageSubItem = (updateIndex,index,key1,key2) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        
        var newItem = newOptions['roofDrainage']['drainageItems'][updateIndex]['items'][index];
        if(key1==='overflowsPresents'){
            newItem[key1] = key2;
        }else if(key1==='dimensions'){
            newItem['dimensions'][key2] = e.target.value;
        }else{
            newItem[key1] = e.target.value;
        }
        newOptions['roofDrainage']['drainageItems'][updateIndex]['items'][index] = newItem;
         
        setOptions(newOptions);
    }

    const handleRemoveRoofDrainageSubItem = (drainageIndex, removeIndex) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var items = newOptions['roofDrainage']['drainageItems'][drainageIndex]['items'];
        var newItems = items.filter((item,index) => index !== removeIndex);
        newOptions['roofDrainage']['drainageItems'][drainageIndex]['items'] = newItems;
        setOptions(newOptions);

        let newUploadFiles = {...uploadFiles};
        var newImageItems = newUploadFiles['roofDrainage'][drainageIndex].filter((item,index) => index !== removeIndex);
        newUploadFiles['roofDrainage'][drainageIndex] = newImageItems
        setUploadFiles(newUploadFiles);
    }

    const handleUploadImages = (drainageIndex, index) => async (e) => {
        var files = [...e.target.files];
        
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
        const MIME_TYPE_MAP = {
            'image/png': 'png',
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg'
        }
        var count = uploadFiles['roofDrainage'][drainageIndex][index]['images'].length;
        var newFiles = files.filter((file, index) => index < 4 - count).map((file, index) => {
            return new File([file], `${uuidv4()}.${MIME_TYPE_MAP[file.type]}`, {
                type: file.type,
                lastModified: file.lastModified,
            });
        });
        let newOptions = JSON.parse(JSON.stringify(options));
        newFiles.forEach(file => {
            newOptions['roofDrainage']['drainageItems'][drainageIndex]['items'][index]['images'].push(file.name);
        });
        setOptions(newOptions);

        var newImages = [];
        for (var i = 0; i < newFiles.length; i++) {
            var imgSrc = await toBase64(newFiles[i]);
            newImages.push(imgSrc);
        }
        let newUploadFiles = {...uploadFiles};
        newUploadFiles['roofDrainage'][drainageIndex][index]['files'] = [
            ...newUploadFiles['roofDrainage'][drainageIndex][index]['files'],
            ...newFiles
        ];
        newUploadFiles['roofDrainage'][drainageIndex][index]['images'] = [
            ...newUploadFiles['roofDrainage'][drainageIndex][index]['images'],
            ...newImages
        ];
        setUploadFiles(newUploadFiles);
    }

    const handleRemoveImage = (drainageIndex, index, removeIndex) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var newImageItems = newOptions['roofDrainage']['drainageItems'][drainageIndex]['items'][index]['images'].filter((item, index) => index !== removeIndex);
        newOptions['roofDrainage']['drainageItems'][drainageIndex]['items'][index]['images'] = newImageItems;
        setOptions(newOptions);

        var newFiles = uploadFiles['roofDrainage'][drainageIndex][index]['files'].filter((item, index) => index !== removeIndex);
        var newImages = uploadFiles['roofDrainage'][drainageIndex][index]['images'].filter((item, index) => index !== removeIndex);
        
        let newUploadFiles = {...uploadFiles};
        newUploadFiles['roofDrainage'][drainageIndex][index]['files'] = newFiles;
        newUploadFiles['roofDrainage'][drainageIndex][index]['images'] = newImages;
        setUploadFiles(newUploadFiles);
    }

    const handleAccordionChange = (key) => (e, newExpanded) => {
        setAccordionExpanded(newExpanded ? key : false);
    }

    return(
        <>
        <Grid container spacing={3} alignItems="flex-end" style={{marginBottom:24}}>
            <Grid item xs={6}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">Select a choice</FormLabel>
                    <RadioGroup 
                        row={true}
                        aria-label="drainageRating"
                        name="drainage-drainageRating" 
                        value={options['roofDrainage']['drainageRating']}
                        onChange={handleChangeOptions('drainageRating')}
                    >
                        <FormControlLabel value="good" control={<Radio color="primary" />} label="Good" />
                        <FormControlLabel value="poor" control={<Radio color="primary" />} label="Poor" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <Grid container justifyContent="flex-end">
                    <Button className={classes.addButton}
                            color="primary"  startIcon={<AddIcon />}
                            onClick={handleAddRoofDrainageItem}
                    >ADD ROOF DRAINAGE</Button>
                </Grid>
            </Grid>
        </Grid>
        {
            options['roofDrainage']['drainageItems'].map((drainageItem,drainageIndex)=>(
                <Paper key={`drainageItem-${drainageIndex}`} className={classes.paper}>
                    {['',...Object.keys(drainageTypes)].includes(drainageItem.drainageType)?
                        <TextField 
                            className={clsx(classes.textBox, classes.spacious)}
                            variant="outlined"
                            label="Drainage Type"
                            fullWidth
                            InputLabelProps={{shrink: true}}
                            select={true}
                            SelectProps={selectMenuProps}
                            value={drainageItem.drainageType}
                            onChange={handleChangeRoofDrainageItem(drainageIndex,'drainageType')}
                        >{[...Object.keys(drainageTypes), 'Other (Add Text)'].map(item=><MenuItem key={item} value={item}>{item}</MenuItem>)}
                        </TextField>
                     :
                        <TextField 
                            className={clsx(classes.textBox, classes.spacious)}
                            variant="outlined"
                            label="Drainage Type"
                            fullWidth
                            InputLabelProps={{shrink: true}}
                            value={drainageItem.drainageType}
                            onChange={handleChangeRoofDrainageItem(drainageIndex,'drainageType')}
                            onFocus={e=>e.target.select()}
                        />
                    }
                    {['Internal Drains','Primary Scuppers'].includes(drainageItem.drainageType)?
                        <>
                        <Grid container justifyContent="flex-end" style={{marginBottom:24}}>
                            <Button className={classes.addButton}
                                    color="primary"  startIcon={<AddIcon />}
                                    onClick={handleAddRoofDrainageSubItem(drainageIndex)}
                            >{drainageItem.drainageType}</Button>
                        </Grid>
                        {drainageItem.items.map((row,index)=>(
                            <Accordion 
                                key={`drainageItem-${drainageIndex}-${index}`} 
                                className={classes.accordion}
                                expanded={accordionExpanded===`drainageItem-${drainageIndex}-${index}`}
                                onChange={handleAccordionChange(`drainageItem-${drainageIndex}-${index}`)}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                                    {`${drainageItem.drainageType} ${index+1}`}
                                </AccordionSummary>
                                <AccordionDetails>
                                  <Grid container direction="column">
                                    {(row.dimensions && Object.keys(row.dimensions).length>0) && (
                                        <>
                                        <Grid container alignItems="center">
                                            <Grid item xs={6}>
                                                <div className={classes.sectionTitle}>Dimensions</div>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Grid container justifyContent="flex-end" alignItems="center" className={classes.itemLabel}>
                                                    <InfoIcon style={{marginRight:4, color:'#fc9c38'}} />
                                                    <div style={{marginRight:4}}>Help text see guidlines</div>
                                                    <Link href="#" color="primary" underline="hover"
                                                        style={{fontWeight:700}}
                                                        onClick={handleHelpDialogOpen(drainageItem.drainageType,row.type)}
                                                    >here</Link>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            {Object.keys(row.dimensions).map(symbol=>
                                                <Grid key={symbol} item xs={4} sm={2}>
                                                    <InchesFormat
                                                        className={classes.textBox}
                                                        label={symbol}
                                                        value={row.dimensions[symbol]}
                                                        onChange={handleChangeRoofDrainageSubItem(drainageIndex,index,'dimensions',symbol)}
                                                    />
                                                </Grid>
                                            )}
                                        </Grid>
                                        </>
                                    )}
                                    <div className={classes.sectionTitle}>Pictures</div>
                                    <Grid container spacing={3} style={{marginBottom:24}}>
                                        {uploadFiles['roofDrainage'][drainageIndex][index]['images'].map((imgSrc,imgIndex)=>
                                            <Grid key={`img-${index}-${imgIndex}`} item xs={6} sm={3}>
                                                <div className={classes.imageBox}>
                                                    <Avatar src={imgSrc} onClick={handleImageDialogOpen(drainageIndex, index,imgIndex)} />
                                                    <IconButton 
                                                        color="default" aria-label="remove image"
                                                        onClick={handleRemoveImage(drainageIndex, index, imgIndex)}
                                                    ><CloseIcon /></IconButton>
                                                </div>  
                                            </Grid>    
                                        )}
                                        {row.images.length < 4 && (
                                            <Grid item xs={6} sm={3}>
                                                <input type="file" id={`uploadPicture-${drainageIndex}-${index}`}
                                                    accept=".png, .jpg, .jpeg"
                                                    multiple
                                                    style={{display:'none'}}
                                                    onChange={handleUploadImages(drainageIndex,index)}
                                                />
                                                <label htmlFor={`uploadPicture-${drainageIndex}-${index}`} className={classes.uploadPicture}>
                                                    <AddIcon />
                                                    <div>ADD PICTURE</div>
                                                </label>
                                            </Grid>
                                        )}
                                    </Grid>
                                    {row.overflowsPresents && (
                                        <div style={{marginBottom:24}}>
                                            <div className={classes.itemLabel}>Overflows Presents</div>
                                            <Button 
                                                className={row.overflowsPresents==='yes'?classes.buttonPrimary:classes.buttonDefault}
                                                color={row.overflowsPresents==='yes'?'primary':'default'}
                                                style={{marginRight:10}}
                                                onClick={handleChangeRoofDrainageSubItem(drainageIndex, index,'overflowsPresents','yes')}
                                            >YES</Button>
                                            <Button 
                                                className={row.overflowsPresents==='no'?classes.buttonPrimary:classes.buttonDefault}
                                                color={row.overflowsPresents==='no'?'primary':'default'}
                                                onClick={handleChangeRoofDrainageSubItem(drainageIndex, index,'overflowsPresents','no')}
                                            >NO</Button>
                                        </div>
                                    )}      
                                    {((row.overflowsPresents && row.overflowsPresents==='yes')) && (
                                        <Grid container spacing={3} style={{marginBottom:24}}>
                                            <Grid item xs={12} sm={row.type===''?6:4}>
                                                <InchesFormat
                                                    className={classes.textBox}
                                                    label="Size"
                                                    value={row.size}
                                                    onChange={handleChangeRoofDrainageSubItem(drainageIndex, index,'size')}
                                                />
                                            </Grid>
                                            {row.type!=='' && (
                                                    <Grid item xs={12} sm={4}>
                                                        <TextField 
                                                            className={classes.textBox}
                                                            variant="outlined"
                                                            label="Type"
                                                            fullWidth
                                                            InputLabelProps={{shrink: true}}
                                                            select={true}
                                                            SelectProps={selectMenuProps}
                                                            value={row.type}
                                                            onChange={handleChangeRoofDrainageSubItem(drainageIndex, index,'type')}
                                                        >
                                                            {drainageTypes[drainageItem.drainageType]['types'].map(item=> 
                                                                <MenuItem key={item} value={item}>{item}</MenuItem>
                                                            )}
                                                        </TextField>
                                                    </Grid>
                                            )}
                                            <Grid item xs={12} sm={row.type===''?6:4}>
                                                <TextField 
                                                        className={classes.textBox}
                                                        variant="outlined"
                                                        label="Material"
                                                        fullWidth
                                                        InputLabelProps={{shrink: true}}
                                                        select={true}
                                                        SelectProps={selectMenuProps}
                                                        value={row.material}
                                                        onChange={handleChangeRoofDrainageSubItem(drainageIndex, index,'material')}
                                                >{materialTypes.map(item=><MenuItem key={item} value={item}>{item}</MenuItem>)}
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                    )}   
                                    {index>0 && (
                                        <Grid container justifyContent="flex-end" style={{marginBottom:24}}>
                                            <Button className={classes.removeButton}
                                                    color="default"  startIcon={<DeleteIcon />}
                                                    onClick={handleRemoveRoofDrainageSubItem(drainageIndex,index)}
                                            >Remove</Button>
                                        </Grid>
                                    )}
                                </Grid>
                                </AccordionDetails>
                            </Accordion>    
                         ))
                        }
                        </>
                    :
                        <>
                        {drainageItem.items.map((row,index)=>(
                            <div key={`drainageItem-${drainageIndex}-${index}`}>
                                {(row.dimensions && Object.keys(row.dimensions).length>0) && (
                                    <>
                                    <Grid container alignItems="center">
                                        <Grid item xs={6}>
                                            <div className={classes.sectionTitle}>Dimensions</div>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Grid container justifyContent="flex-end" alignItems="center" className={classes.itemLabel}>
                                                <InfoIcon style={{marginRight:4, color:'#fc9c38'}} />
                                                <div style={{marginRight:4}}>Help text see guidlines</div>
                                                <Link href="#" color="primary" underline="hover"
                                                    style={{fontWeight:700}}
                                                    onClick={handleHelpDialogOpen(drainageItem.drainageType,row.type)}
                                                >here</Link>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        {Object.keys(row.dimensions).map(symbol=>
                                            <Grid key={symbol} item xs={4} sm={2}>
                                                <InchesFormat
                                                    className={classes.textBox}
                                                    label={symbol}
                                                    value={row.dimensions[symbol]}
                                                    onChange={handleChangeRoofDrainageSubItem(drainageIndex,index,'dimensions',symbol)}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                    </>
                                )}
                                <div className={classes.sectionTitle}>Pictures</div>
                                <Grid container spacing={3} style={{marginBottom:24}}>
                                    {uploadFiles['roofDrainage'][drainageIndex][index]['images'].map((imgSrc,imgIndex)=>
                                        <Grid key={`img-${index}-${imgIndex}`} item xs={6} sm={3}>
                                            <div className={classes.imageBox}>
                                                <Avatar src={imgSrc} onClick={handleImageDialogOpen(drainageIndex, index,imgIndex)} />
                                                <IconButton 
                                                    color="default" aria-label="remove image"
                                                    onClick={handleRemoveImage(drainageIndex, index, imgIndex)}
                                                ><CloseIcon /></IconButton>
                                            </div>  
                                        </Grid>    
                                    )}
                                    {row.images.length < 4 && (
                                        <Grid item xs={6} sm={3}>
                                            <input type="file" id={`uploadPicture-${drainageIndex}-${index}`}
                                                accept=".png, .jpg, .jpeg"
                                                multiple
                                                style={{display:'none'}}
                                                onChange={handleUploadImages(drainageIndex,index)}
                                            />
                                            <label htmlFor={`uploadPicture-${drainageIndex}-${index}`} className={classes.uploadPicture}>
                                                <AddIcon />
                                                <div>ADD PICTURE</div>
                                            </label>
                                        </Grid>
                                    )}
                                </Grid>
                                {(['Gutter','Downspout','Leaderheads'].includes(drainageItem.drainageType)) && (
                                    <Grid container spacing={3} style={{marginBottom:24}}>
                                        <Grid item xs={12} sm={row.type===''?6:4}>
                                            <InchesFormat
                                                className={classes.textBox}
                                                label="Size"
                                                value={row.size}
                                                onChange={handleChangeRoofDrainageSubItem(drainageIndex, index,'size')}
                                            />
                                        </Grid>
                                        {row.type!=='' && (
                                                <Grid item xs={12} sm={4}>
                                                    <TextField 
                                                        className={classes.textBox}
                                                        variant="outlined"
                                                        label="Type"
                                                        fullWidth
                                                        InputLabelProps={{shrink: true}}
                                                        select={true}
                                                        SelectProps={selectMenuProps}
                                                        value={row.type}
                                                        onChange={handleChangeRoofDrainageSubItem(drainageIndex, index,'type')}
                                                    >
                                                        {drainageTypes[drainageItem.drainageType]['types'].map(item=> 
                                                            <MenuItem key={item} value={item}>{item}</MenuItem>
                                                        )}
                                                    </TextField>
                                                </Grid>
                                        )}
                                        <Grid item xs={12} sm={row.type===''?6:4}>
                                            <TextField 
                                                    className={classes.textBox}
                                                    variant="outlined"
                                                    label="Material"
                                                    fullWidth
                                                    InputLabelProps={{shrink: true}}
                                                    select={true}
                                                    SelectProps={selectMenuProps}
                                                    value={row.material}
                                                    onChange={handleChangeRoofDrainageSubItem(drainageIndex, index,'material')}
                                            >{materialTypes.map(item=><MenuItem key={item} value={item}>{item}</MenuItem>)}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                )}
                            </div>    
                        ))
                      }
                      </>
                    }      
                    {drainageIndex>0 && (
                        <Grid container justifyContent="flex-end">
                            <Button className={classes.removeButton}
                                    color="default"  startIcon={<DeleteIcon />}
                                    onClick={handleRemoveRoofDrainageItem(drainageIndex)}
                            >Remove</Button>
                        </Grid>
                    )}
                </Paper>
            ))
        }
        <ModalGateway>
            {imageDialogOpen && (
                <Modal onClose={() => setImageDialogOpen(false)}
                    allowFullscreen={false}
                    closeOnBackdropClick={false}
                    styles={customModalStyles}
                ><Carousel views={images} currentIndex={currentImage} styles={customCarouselStyles} />
                </Modal>
            )}
        </ModalGateway>
        <ModalGateway>
            {helpDialogOpen && (
                <Modal onClose={() => setHelpDialogOpen(false)}
                    allowFullscreen={false}
                    closeOnBackdropClick={false}
                    styles={customModalStyles}
                ><Carousel views={[{source:helpImage}]} styles={customCarouselStyles} />
                </Modal>
            )}
        </ModalGateway>
        </>
    )
}

export default withStyles(styles)(RoofDrainage);
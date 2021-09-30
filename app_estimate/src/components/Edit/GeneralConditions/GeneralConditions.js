import React, { useState } from 'react';
//import PropTypes from 'prop-types';
import clsx from  'clsx';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoIcon from '@material-ui/icons/Info';

import { v4 as uuidv4 } from 'uuid';
import Carousel, { Modal, ModalGateway } from 'react-images'
import InchesFormat, {ConvertInchesToDecimals, ConvertDecimalToInchesRepresentation} from '../../customs/InchesFormat';

import { 
    roofLifeCycleItems, surfacingTypes,
    attachmentItems, insulationTypes, roofDeckTypes,
    customModalStyles, customCarouselStyles,
    selectMenuProps
} from '../../../utils/constants';

const styles = (theme) => ({
    sectionTitle:{
        padding:'24px 0',
        fontFamily:'Roboto',
        fontSize:14,
        fontWeight:500,
        fontStyle:'normal',
        color:'#767786',
        textTransform:'uppercase',
    },
    paper:{
       padding:24,
       boxShadow:'none',
       borderRadius:8,
       border:'1px solid #76778633'
    },
    accordionCore:{
       marginBottom:8,
       boxShadow:'none',
       borderRadius:8,
       border:'1px solid #76778633', //rgba(118,119,134,0.2)
       '&:before': {
         display: 'none',
       },
       '&.MuiAccordion-root.Mui-expanded':{
          margin:'8px 0'
       },
       '& .MuiAccordionSummary-root':{
          borderRadius:8,
          minHeight:56,
          padding:'0 24px',
          backgroundColor:'#fff',
       },
       '& .MuiAccordionSummary-content':{
          margin:0,
          color:'#171d29',
          fontSize:14,
          fontWeight:700,
          textTransform:'uppercase',
       },
       '& .MuiAccordionSummary-content.Mui-expanded':{
          margin:0
       },
       '& .MuiAccordionSummary-expandIcon':{
          margin:-8,
          width:16,
          height:16,
          borderRadius:8,
          //backgroundColor:'#fff',
       },
       '& .MuiAccordionDetails-root':{
           padding:24
       }
    },
    accordionRoof:{
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
            padding:'20px 0'
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
    itemLabel:{
        marginBottom:10,
        fontSize:12,
        fontWeight:400,
        color:'#767786',
        opacity:0.8
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

function GeneralConditions(props){
    const {
        classes, 
        options, setOptions,
        uploadFiles, setUploadFiles,
    } = props;
    
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [coreExpanded, setCoreExpanded] = useState(null);
    const [roofNumberExpanded, setRoofNumberExpanded] = useState(null);

    const handleImageDialogOpen = (imgIndex) => (e) => {
        var newImages = uploadFiles['generalConditions']['images'].map((imgSrc,index)=>{
            return {source:imgSrc}
        });
        setImages(newImages);
        setCurrentImage(imgIndex);
        setImageDialogOpen(true);
    }

    const handleChangeOptions = (key) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        newOptions['generalConditions'][key] = e.target.value;
        setOptions(newOptions);
    }
    
    const handleAddRoofComposition = () => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var items = newOptions['generalConditions']['roofComposition'];
        if(items.length >= 10) return;
        var newItems = [
            ...items,
            {
                overBurden:'yes',
                gravel:'',
                pavers:'',
                tiles:'',
                woodDecks:'',
                other:'',
                roofNumbers:[{
                    surfacingType: surfacingTypes[0],
                    surfacingTypeThickness:'',
                    attachment: attachmentItems[0],
                    insulationType_1: insulationTypes[0],
                    insulationTypeThickness_1:'',
                    insulationType_2: insulationTypes[0],
                    insulationTypeThickness_2:''
                }]
            }
        ];
        newOptions['generalConditions']['roofComposition'] = newItems;
        setOptions(newOptions);
        setCoreExpanded(newItems.length-1);
    }

    const handleRemoveRoofComposition = (removeIndex) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var items = newOptions['generalConditions']['roofComposition'];
        var newItems = items.filter((item,index) => index !== removeIndex);
        newOptions['generalConditions']['roofComposition'] = newItems;
        setOptions(newOptions);
    }

    const handleChangeRoofComposition = (updateIndex,key) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var newItem = newOptions['generalConditions']['roofComposition'][updateIndex];
        newItem[key] = e.target.value;
        newOptions['generalConditions']['roofComposition'][updateIndex] = newItem;
        setOptions(newOptions);
    }
    
    const handleOverBurden = (updateIndex,value) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var newItem = newOptions['generalConditions']['roofComposition'][updateIndex];
        newItem['overBurden'] = value;
        newOptions['generalConditions']['roofComposition'][updateIndex] = newItem;
        setOptions(newOptions);
    }

    const handleAddRoofNumber = (coreIndex) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var items = newOptions['generalConditions']['roofComposition'][coreIndex]['roofNumbers'];
        if(items.length >= 3) return;
        newOptions['generalConditions']['roofComposition'][coreIndex]['roofNumbers'] = [
            ...newOptions['generalConditions']['roofComposition'][coreIndex]['roofNumbers'],
            {
                surfacingType: surfacingTypes[0],
                surfacingTypeThickness:'',
                attachment: attachmentItems[0],
                insulationType_1: insulationTypes[0],
                insulationTypeThickness_1:'',
                insulationType_2: insulationTypes[0],
                insulationTypeThickness_2:''
            }
        ];
        setOptions(newOptions);
        setRoofNumberExpanded(items.length);
    }

    const handleChangeRoofNumber = (coreIndex, index, key) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        newOptions['generalConditions']['roofComposition'][coreIndex]['roofNumbers'][index][key] = e.target.value;
        if(['surfacingTypeThickness','insulationTypeThickness_1','insulationTypeThickness_2'].includes(key)){
            if (e.target.value !== "" && e.target.value !== null) {
                let sum = 0;
                newOptions['generalConditions']['roofComposition'].forEach(coreItem=>{
                    coreItem.roofNumbers.forEach(roofNumberItem=>{
                        sum+=parseFloat(ConvertInchesToDecimals(roofNumberItem.surfacingTypeThickness))
                        sum+=parseFloat(ConvertInchesToDecimals(roofNumberItem.insulationTypeThickness_1))
                        sum+=parseFloat(ConvertInchesToDecimals(roofNumberItem.insulationTypeThickness_2))
                    });
                });
                newOptions['generalConditions']['totalExistingRoofThickness'] = ConvertDecimalToInchesRepresentation(String(sum));
            }
        }
        setOptions(newOptions);
    }

    const handleRemoveRoofNumber = (coreIndex, removeIndex) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var items = newOptions['generalConditions']['roofComposition'][coreIndex]['roofNumbers'];
        var newItems = items.filter((item,index) => index !== removeIndex);
        newOptions['generalConditions']['roofComposition'][coreIndex]['roofNumbers'] = newItems;
        setOptions(newOptions);
    }

    const handleUploadImages = async (e) => {
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
        var count = uploadFiles['generalConditions']['images'].length;
        var newFiles = files.filter((file, index) => index < 4 - count).map((file, index) => {
            return new File([file], `${uuidv4()}.${MIME_TYPE_MAP[file.type]}`, {
                type: file.type,
                lastModified: file.lastModified,
            });
        });
        let newOptions = JSON.parse(JSON.stringify(options));
        newFiles.forEach(file => {
            newOptions['generalConditions']['images'].push(file.name);
        });
        setOptions(newOptions);

        var newImages = [];
        for (var i = 0; i < newFiles.length; i++) {
            var imgSrc = await toBase64(newFiles[i]);
            newImages.push(imgSrc);
        }
        let newUploadFiles = {...uploadFiles};
        newUploadFiles['generalConditions']['files'] = [
            ...newUploadFiles['generalConditions']['files'],
            ...newFiles
        ];
        newUploadFiles['generalConditions']['images'] = [
            ...newUploadFiles['generalConditions']['images'],
            ...newImages
        ];
        setUploadFiles(newUploadFiles);
    }

    const handleRemoveImage = (removeIndex) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var newImageNames = options['generalConditions'].images.filter((item, index) => index !== removeIndex);
        newOptions['generalConditions'].images = newImageNames;
        setOptions(newOptions);

        var newFiles = uploadFiles['generalConditions']['files'].filter((item, index) => index !== removeIndex);
        var newImages = uploadFiles['generalConditions']['images'].filter((item, index) => index !== removeIndex);
        
        let newUploadFiles = {...uploadFiles};
        newUploadFiles['generalConditions']['files'] = newFiles;
        newUploadFiles['generalConditions']['images'] = newImages;
        setUploadFiles(newUploadFiles);
    }

    const handleAccordionCoreChange = (index) => (e, newExpanded) => {
        setRoofNumberExpanded(null);
        setCoreExpanded(newExpanded ? index : false);
    }
    
    const handleAccordionRoofNumberChange = (index) => (e, newExpanded) => {
        setRoofNumberExpanded(newExpanded ? index : false);
    }

    return(
        <>
        <TextField 
            className={clsx(classes.textBox, classes.spacious)}
            variant="outlined"
            label="Roof Life Cycle"
            fullWidth
            InputLabelProps={{shrink: true}}
            select={true}
            SelectProps={selectMenuProps}
            value={options['generalConditions']['roofLifeCycle']}
            onChange={handleChangeOptions('roofLifeCycle')}
        >{roofLifeCycleItems.map((item, index)=><MenuItem key={item} value={item}>{item}</MenuItem>)}
        </TextField>
        <Grid container justifyContent="space-between" alignItems="center">
            <div className={classes.sectionTitle}>Roof Composition</div>
            <Button className={classes.addButton}
                    color="primary"  startIcon={<AddIcon />}
                    onClick={handleAddRoofComposition}
            >ADD CORE</Button>
        </Grid>
        <Divider style={{backgroundColor:'#dee7ee', marginBottom:20}} />
        {options['generalConditions']['roofComposition'].map((coreItem,coreIndex)=>{
            const characters = ['A','B','C','D','E','F','G','H','I','J','K'];
            return(
                <Accordion key={`#core-${coreIndex}`} className={classes.accordionCore} 
                           expanded={coreExpanded===coreIndex}
                           onChange={handleAccordionCoreChange(coreIndex)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}
                                    //aria-controls="panel1a-content" //id="panel1a-header"
                    >{`CORE ${characters[coreIndex]}`}</AccordionSummary>
                    <AccordionDetails>
                        <Grid container direction="column">
                            <div style={{marginBottom:24}}>
                                <div className={classes.itemLabel}>Overburden</div>
                                <Button 
                                    className={coreItem.overBurden==='yes'?classes.buttonPrimary:classes.buttonDefault}
                                    color={coreItem.overBurden==='yes'?'primary':'default'}
                                    style={{marginRight:10}}
                                    onClick={handleOverBurden(coreIndex,'yes')}
                                >YES</Button>
                                <Button 
                                    className={coreItem.overBurden==='no'?classes.buttonPrimary:classes.buttonDefault}
                                    color={coreItem.overBurden==='no'?'primary':'default'}
                                    onClick={handleOverBurden(coreIndex,'no')}
                                >NO</Button>
                            </div>
                            {(coreItem.overBurden==='yes') && (
                                <Grid container spacing={3} style={{marginBottom:24}}>
                                    <Grid item xs={6} sm={2}>
                                        <InchesFormat
                                            className={classes.textBox}
                                            label="Gravel"
                                            value={coreItem.gravel}
                                            onChange={handleChangeRoofComposition(coreIndex,'gravel')}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={2}>
                                        <InchesFormat
                                            className={classes.textBox}
                                            label="Pavers"
                                            value={coreItem.pavers}
                                            onChange={handleChangeRoofComposition(coreIndex,'pavers')}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={2}>
                                        <InchesFormat
                                            className={classes.textBox}
                                            label="Tiles"
                                            value={coreItem.tiles}
                                            onChange={handleChangeRoofComposition(coreIndex,'tiles')}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <InchesFormat
                                            className={classes.textBox}
                                            label="Wood Decks"
                                            value={coreItem.woodDecks}
                                            onChange={handleChangeRoofComposition(coreIndex,'woodDecks')}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <InchesFormat
                                            className={classes.textBox}
                                            label="Other"
                                            value={coreItem.other}
                                            onChange={handleChangeRoofComposition(coreIndex,'other')}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                            <Grid container style={{marginBottom:20}}>
                                <Grid item xs={6}>
                                    <div className={classes.sectionTitle} style={{padding:0,marginBottom:10}}># of Roofs</div>
                                    <Grid container alignItems="center" className={classes.itemLabel}>
                                        <InfoIcon style={{marginRight:4, color:'#fc9c38'}} />
                                        <div style={{marginRight:4}}>You can only add 3 Roofs</div>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container justifyContent="flex-end">
                                        <Button className={classes.addButton}
                                                color="primary"  startIcon={<AddIcon />}
                                                onClick={handleAddRoofNumber(coreIndex)}
                                        >ADD ROOFS</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {
                                coreItem.roofNumbers.map((item,index)=>(
                                    <Accordion key={`${coreIndex}-roofNumber-${index}`} 
                                               className={classes.accordionRoof}
                                               expanded={roofNumberExpanded===index}
                                               onChange={handleAccordionRoofNumberChange(index)}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                                            {`Roof Number ${index+1}`}
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container direction="column">
                                                <Grid container spacing={3} style={{marginBottom:10}}>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField 
                                                            className={classes.textBox}
                                                            variant="outlined"
                                                            label="Surfacing"
                                                            fullWidth
                                                            InputLabelProps={{shrink: true}}
                                                            select={true}
                                                            SelectProps={selectMenuProps}
                                                            value={item.surfacingType}
                                                            onChange={handleChangeRoofNumber(coreIndex,index,'surfacingType')}
                                                        >{surfacingTypes.map((item,index)=><MenuItem key={item} value={item}>{item}</MenuItem>)}
                                                        </TextField>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <InchesFormat
                                                            className={classes.textBox}
                                                            label="Thickness"
                                                            value={item.surfacingTypeThickness}
                                                            onChange={handleChangeRoofNumber(coreIndex,index,'surfacingTypeThickness')}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <TextField 
                                                    className={clsx(classes.textBox, classes.spacious)}
                                                    variant="outlined"
                                                    label="Attachment"
                                                    fullWidth
                                                    InputLabelProps={{shrink: true}}
                                                    select={true}
                                                    SelectProps={selectMenuProps}
                                                    value={item.attachment}
                                                    onChange={handleChangeRoofNumber(coreIndex,index,'attachment')}
                                                >{attachmentItems.map((item,index)=><MenuItem key={item} value={item}>{item}</MenuItem>)}
                                                </TextField>
                                                <Grid container spacing={3} style={{marginBottom:10}}>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField 
                                                            className={classes.textBox}
                                                            variant="outlined"
                                                            label="Insulation Type 1"
                                                            fullWidth
                                                            InputLabelProps={{shrink: true}}
                                                            select={true}
                                                            SelectProps={selectMenuProps}
                                                            value={item.insulationType_1}
                                                            onChange={handleChangeRoofNumber(coreIndex,index,'insulationType_1')}
                                                        >{insulationTypes.map((item,index)=><MenuItem key={item} value={item}>{item}</MenuItem>)}
                                                        </TextField>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <InchesFormat
                                                            className={classes.textBox}
                                                            label="Thickness"
                                                            value={item.insulationTypeThickness_1}
                                                            onChange={handleChangeRoofNumber(coreIndex,index,'insulationTypeThickness_1')}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={3} style={{marginBottom:10}}>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField 
                                                            className={classes.textBox}
                                                            variant="outlined"
                                                            label="Insulation Type 2"
                                                            fullWidth
                                                            InputLabelProps={{shrink: true}}
                                                            select={true}
                                                            SelectProps={selectMenuProps}
                                                            value={item.insulationType_2}
                                                            onChange={handleChangeRoofNumber(coreIndex,index,'insulationType_2')}
                                                        >{insulationTypes.map((item,index)=><MenuItem key={item} value={item}>{item}</MenuItem>)}
                                                        </TextField>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <InchesFormat
                                                            className={classes.textBox}
                                                            label="Thickness"
                                                            value={item.insulationTypeThickness_2}
                                                            onChange={handleChangeRoofNumber(coreIndex,index,'insulationTypeThickness_2')}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                {index > 0 && (
                                                <Grid container justifyContent="flex-end">
                                                    <Button className={classes.removeButton}
                                                            startIcon={<DeleteIcon />}
                                                            onClick={handleRemoveRoofNumber(coreIndex, index)}
                                                    >Remove</Button>
                                                </Grid>)}
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                ))
                            }
                            {coreIndex > 0 && (
                            <Grid container justifyContent="flex-end" style={{marginTop:24}}>
                                <Button className={classes.removeButton}
                                        startIcon={<DeleteIcon />}
                                        onClick={handleRemoveRoofComposition(coreIndex)}
                                >Remove</Button>
                            </Grid>)}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            )})       
        }
        <Paper className={classes.paper}>
            <TextField 
                className={clsx(classes.textBox, classes.spacious)}
                variant="outlined"
                label="Type of roof Deck"
                fullWidth
                InputLabelProps={{shrink: true}}
                select={true}
                SelectProps={selectMenuProps}
                value={options['generalConditions']['roofDeckType']}
                onChange={handleChangeOptions('roofDeckType')}
            >{roofDeckTypes.map((item,index)=><MenuItem key={item} value={item}>{item}</MenuItem>)}
            </TextField>
            <InchesFormat
                className={classes.textBox}
                label="Total Existing Roof Thickness"
                value={options['generalConditions']['totalExistingRoofThickness']}
                onChange={handleChangeOptions('totalExistingRoofThickness')}
            />
            <div className={classes.sectionTitle}>Pictures</div>
            <Grid container spacing={3}>
                {uploadFiles['generalConditions']['images'].map((imgSrc,imgIndex)=>
                    <Grid key={`img-${imgIndex}`} item xs={6} sm={3}>
                        <div className={classes.imageBox} >
                            <Avatar src={imgSrc} onClick={handleImageDialogOpen(imgIndex)} />
                            <IconButton color="default" aria-label="remove image"
                                onClick={handleRemoveImage(imgIndex)}
                            ><CloseIcon /></IconButton>
                        </div>  
                    </Grid>    
                )}
                {uploadFiles['generalConditions']['images'].length < 4 && (
                    <Grid item xs={6} sm={3}>
                        <input type="file" id="upload-picture"
                            accept=".png, .jpg, .jpeg"
                            multiple
                            style={{display:'none'}}
                            onChange={handleUploadImages}
                        />
                        <label htmlFor="upload-picture" className={classes.uploadPicture}>
                            <AddIcon />
                            <div>ADD PICTURE</div>
                        </label>
                    </Grid>
                )}
            </Grid>
        </Paper>
        <ModalGateway>
            {imageDialogOpen && (
                <Modal onClose={()=>setImageDialogOpen(false)}
                       allowFullscreen={false}
                       closeOnBackdropClick={false}
                       styles={customModalStyles}
                >
                    <Carousel 
                         views={images}
                         currentIndex={currentImage}
                         styles={customCarouselStyles}
                    />
                </Modal>
            )}
        </ModalGateway>
        </>
    )
}

export default withStyles(styles)(GeneralConditions);
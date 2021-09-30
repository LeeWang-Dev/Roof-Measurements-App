import React, {useState} from 'react';
import clsx from  'clsx';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

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

import InputAdornment from '@material-ui/core/InputAdornment';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { v4 as uuidv4 } from 'uuid';
import Carousel, { Modal, ModalGateway } from 'react-images'

import InchesFormat from '../../customs/InchesFormat';
import { 
    materialCompositionItems,
    customModalStyles, customCarouselStyles, selectMenuProps
} from '../../../utils/constants';

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
            padding:'20px 0'
        }
    },
    formControl:{
        width:'100%',
        paddingLeft:24,
        marginBottom:24,
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

function WallDetails(props){
    const {
        classes, options, setOptions,
        uploadFiles, setUploadFiles
    } = props;

    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [accordionExpanded, setAccordionExpanded] = useState(null);

    const handleImageDialogOpen = (index,imgIndex) => (e) => {
        var newImages;
        newImages = uploadFiles['wallDetails'][index]['images'].map((imgSrc,index)=>{
            return {source:imgSrc}
        });
        setImages(newImages);
        setCurrentImage(imgIndex);
        setImageDialogOpen(true);
    }

    const handleChangeOptions = (key) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        newOptions['wallDetails'][key] = e.target.value;
        setOptions(newOptions);
    }

    const handleChangeStucco = (value) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        newOptions['wallDetails']['stucco'] = value;
        setOptions(newOptions);
    }
    
    const handleChangeWoodNailer = (updateIndex,value) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        newOptions['wallDetails']['wallProperties'][updateIndex]['woodNailer'] = value;
        setOptions(newOptions);
    }

    const handleAddProperties = () => {
        let newOptions = JSON.parse(JSON.stringify(options));
        
        var items = newOptions['wallDetails']['wallProperties'];
        if(items.length >= 10) return;

        newOptions['wallDetails']['wallProperties'] = [
            ...newOptions['wallDetails']['wallProperties'],
            {
                wallHeight:'',
                wallThickness:'',
                wallFlashingHeight:'',
                woodNailer:'yes',
                images:[]
            }
        ];
        setOptions(newOptions);
        setAccordionExpanded(items.length);
        let newUploadFiles = {...uploadFiles};
        newUploadFiles['wallDetails'] = [
            ...newUploadFiles['wallDetails'],
            {
                files:[],
                images:[]
            }
        ];;
        setUploadFiles(newUploadFiles);
    }
    
    const handleChangeProperties = (updateIndex,key) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        newOptions['wallDetails']['wallProperties'][updateIndex][key] = e.target.value;
        setOptions(newOptions);
    }
    
    const handleClearText = (clearIndex,key) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        newOptions['wallDetails']['wallProperties'][clearIndex][key] = '';
        setOptions(newOptions);
    }

    const handleRemoveProperties = (removeIndex) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var items = newOptions['wallDetails']['wallProperties'];
        var newItems = items.filter((item,index) => index !== removeIndex);
        newOptions['wallDetails']['wallProperties'] = newItems;
        setOptions(newOptions);
        
        let newUploadFiles = {...uploadFiles};
        var newImageItems = newUploadFiles['wallDetails'].filter((item,index) => index !== removeIndex);
        newUploadFiles['wallDetails'] = newImageItems
        setUploadFiles(newUploadFiles);
    }

    const handleUploadImages = (index) => async (e) => {
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
        var count = uploadFiles['wallDetails'][index]['images'].length;
        var newFiles = files.filter((file, index) => index < 4 - count).map((file, index) => {
            return new File([file], `${uuidv4()}.${MIME_TYPE_MAP[file.type]}`, {
                type: file.type,
                lastModified: file.lastModified,
            });
        });
        let newOptions = JSON.parse(JSON.stringify(options));
        newFiles.forEach(file => {
            newOptions['wallDetails']['wallProperties'][index]['images'].push(file.name);
        });
        setOptions(newOptions);

        var newImages = [];
        for (var i = 0; i < newFiles.length; i++) {
            var imgSrc = await toBase64(newFiles[i]);
            newImages.push(imgSrc);
        }
        let newUploadFiles = {...uploadFiles};
        newUploadFiles['wallDetails'][index]['files'] = [
            ...newUploadFiles['wallDetails'][index]['files'],
            ...newFiles
        ];
        newUploadFiles['wallDetails'][index]['images'] = [
            ...newUploadFiles['wallDetails'][index]['images'],
            ...newImages
        ];
        setUploadFiles(newUploadFiles);
    }

    const handleRemoveImage = (index, removeIndex) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var newImageItems = newOptions['wallDetails']['wallProperties'][index]['images'].filter((item, index) => index !== removeIndex);
        newOptions['wallDetails']['wallProperties'][index]['images'] = newImageItems;
        setOptions(newOptions);

        var newFiles = uploadFiles['wallDetails'][index]['files'].filter((item, index) => index !== removeIndex);
        var newImages = uploadFiles['wallDetails'][index]['images'].filter((item, index) => index !== removeIndex);
        
        let newUploadFiles = {...uploadFiles};
        newUploadFiles['wallDetails'][index]['files'] = newFiles;
        newUploadFiles['wallDetails'][index]['images'] = newImages;
        setUploadFiles(newUploadFiles);
    }

    const handleAccordionChange = (index) => (e, newExpanded) => {
        setAccordionExpanded(newExpanded ? index : false);
    }

    return(
        <>
        <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Parapet wall information</FormLabel>
            <RadioGroup 
                row={true}
                aria-label="Parapet wall information"
                name="parapet-wall-information" 
                value={options['wallDetails']['parapetWallInformation']}
                onChange={handleChangeOptions('parapetWallInformation')}
            >
                <FormControlLabel value="good" control={<Radio color="primary" />} label="Good" />
                <FormControlLabel value="poor" control={<Radio color="primary" />} label="Poor" />
            </RadioGroup>
        </FormControl>
        <Paper className={classes.paper}> 
            <TextField 
                className={clsx(classes.textBox, classes.spacious)}
                variant="outlined"
                label="Material Composition"
                fullWidth
                InputLabelProps={{shrink: true}}
                select={true}
                SelectProps={selectMenuProps}
                value={options['wallDetails']['materialComposition']}
                onChange={handleChangeOptions('materialComposition')}
            >{materialCompositionItems.map((item, index)=><MenuItem key={item} value={item}>{item}</MenuItem>)}
            </TextField>
            <div style={{marginBottom:24}}>
            <div className={classes.itemLabel}>Stucco</div>
                <Button 
                    className={options['wallDetails']['stucco']==='yes'?classes.buttonPrimary:classes.buttonDefault}
                    color={options['wallDetails']['stucco']==='yes'?'primary':'default'}
                    style={{marginRight:10}}
                    onClick={handleChangeStucco('yes')}
                >YES</Button>
                <Button 
                    className={options['wallDetails']['stucco']==='no'?classes.buttonPrimary:classes.buttonDefault}
                    color={options['wallDetails']['stucco']==='no'?'primary':'default'}
                    onClick={handleChangeStucco('no')}
                >NO</Button>
            </div> 
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={6}>
                    <div className={classes.sectionTitle}>Wall Properties</div>
                </Grid>
                <Grid item xs={6}>
                    <Grid container justifyContent="flex-end">
                        <Button className={classes.addButton}
                                color="primary"  startIcon={<AddIcon />}
                                onClick={handleAddProperties}
                        >ADD WALL PROPERTIES</Button>
                    </Grid>
                </Grid>
            </Grid>
            {options['wallDetails']['wallProperties'].map((row,index)=>{
                const characters = ['A', 'B', 'C', 'D', 'E', 'F','G','H','I','J','K'];
                return(
                    <Accordion key={index} className={classes.accordion}
                               expanded={accordionExpanded===index}
                               onChange={handleAccordionChange(index)}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                            {`WALL ${characters[index]} PROPERTIES`}
                        </AccordionSummary>
                        <AccordionDetails>
                           <Grid container direction="column">
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={4}>
                                        <InchesFormat
                                            className={classes.textBox}
                                            label="Wall Height"
                                            InputProps={{
                                                endAdornment:(
                                                    <InputAdornment position="end">
                                                        <IconButton aria-label="clear text" edge="end"
                                                            onClick={handleClearText(index,'wallHeight')}
                                                            onMouseDown={(e)=>e.preventDefault()}
                                                        ><DeleteIcon /></IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                            value={row.wallHeight}
                                            onChange={handleChangeProperties(index,'wallHeight')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <InchesFormat
                                            className={classes.textBox}
                                            label="Wall Thickness"
                                            InputProps={{
                                                endAdornment:(
                                                    <InputAdornment position="end">
                                                        <IconButton aria-label="clear text" edge="end"
                                                            onClick={handleClearText(index,'wallThickness')}
                                                            onMouseDown={(e)=>e.preventDefault()}
                                                        ><DeleteIcon /></IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                            value={row.wallThickness}
                                            onChange={handleChangeProperties(index,'wallThickness')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <InchesFormat
                                            className={classes.textBox}
                                            label="Flashing Height"
                                            InputProps={{
                                                endAdornment:(
                                                    <InputAdornment position="end">
                                                        <IconButton aria-label="clear text"  edge="end"
                                                            onClick={handleClearText(index,'wallFlashingHeight')}
                                                            onMouseDown={(e)=>e.preventDefault()}
                                                        ><DeleteIcon /></IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                            value={row.wallFlashingHeight}
                                            onChange={handleChangeProperties(index,'wallFlashingHeight')}
                                        />
                                    </Grid>
                                </Grid>
                                <div className={classes.sectionTitle}>Pictures</div>
                                <Grid container spacing={3} style={{marginBottom:24}}>
                                    {uploadFiles['wallDetails'][index]['images'].map((imgSrc,imgIndex)=>
                                        <Grid key={`${index}-${imgIndex}`} item xs={6} sm={3}>
                                            <div className={classes.imageBox}>
                                                <Avatar src={imgSrc} onClick={handleImageDialogOpen(index, imgIndex)} />
                                                <IconButton color="default" aria-label="remove image"
                                                    onClick={handleRemoveImage(index, imgIndex)}
                                                ><CloseIcon /></IconButton>
                                            </div>  
                                        </Grid>    
                                    )}
                                    {row.images.length < 4 && (
                                        <Grid item xs={6} sm={3}>
                                            <input type="file" id={`uploadPicture-${index}`}
                                                accept=".png, .jpg, .jpeg" multiple
                                                style={{display:'none'}}
                                                onChange={handleUploadImages(index)}
                                            />
                                            <label htmlFor={`uploadPicture-${index}`} className={classes.uploadPicture}>
                                                <AddIcon />
                                                <div>ADD PICTURE</div>
                                            </label>
                                        </Grid>
                                    )}
                                </Grid>
                                <div style={{marginBottom:24}}>
                                    <div className={classes.itemLabel}>Wood-Nailer</div>
                                    <Button 
                                        className={row.woodNailer==='yes'?classes.buttonPrimary:classes.buttonDefault}
                                        color={row.woodNailer==='yes'?'primary':'default'}
                                        style={{marginRight:10}}
                                        onClick={handleChangeWoodNailer(index,'yes')}
                                    >YES</Button>
                                    <Button 
                                        className={row.woodNailer==='no'?classes.buttonPrimary:classes.buttonDefault}
                                        color={row.woodNailer==='no'?'primary':'default'}
                                        onClick={handleChangeWoodNailer(index,'no')}
                                    >NO</Button>
                                </div>
                                {index>0 && (
                                    <Grid container justifyContent="flex-end">
                                        <Button className={classes.removeButton}
                                                color="default" startIcon={<DeleteIcon />}
                                                onClick={handleRemoveProperties(index)}
                                        >Remove</Button>
                                    </Grid>
                                )}
                           </Grid>
                        </AccordionDetails>
                    </Accordion>    
                )})
            }
        </Paper>
        <ModalGateway>
            {imageDialogOpen && (
                <Modal onClose={() => setImageDialogOpen(false)}
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

export default withStyles(styles)(WallDetails);

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
import Link from '@material-ui/core/Link';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { v4 as uuidv4 } from 'uuid';
import Carousel, { Modal, ModalGateway } from 'react-images'

import InchesFormat from '../../customs/InchesFormat';
import SizeFormat from '../../customs/SizeFormat';
import { 
    sizeTypes, materialTypes, metalTerminationFlashingsTypes,
    customModalStyles, customCarouselStyles, selectMenuProps
} from '../../../utils/constants';

import imgExpansionJoint from '../../../assets/images/expansion_joint.png';
import imgGooseNeck from '../../../assets/images/gooseneck.png';
import imgLineJack from '../../../assets/images/linejack.png';
import imgApvs from '../../../assets/images/apvs.png';
import imgCoping from '../../../assets/images/coping.png';

import imgSurfaceMounted from '../../../assets/images/surface-mounted.png';
import imgStuccoStop from '../../../assets/images/stucco-stop.png';
import imgOnePieceReglet from '../../../assets/images/one-piece-reglet.png';
import imgTwoPieceReglet from '../../../assets/images/tow-piece-reglet.png';
import imgSlipMetalFlashing from '../../../assets/images/slip-metal-flashing.png';

import imgDripEdge from '../../../assets/images/drip-edge.png';
import imgGravelStop from '../../../assets/images/gravel-stop.png';
import imgMetalFascia from '../../../assets/images/metal-fascia.png';
import imgTerminationBar from '../../../assets/images/termination-bar.png';

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

function RoofDetails(props){
    const {
        classes, options, setOptions,
        uploadFiles, setUploadFiles,
        scrollRef
    } = props;

    const [helpDialogOpen, setHelpDialogOpen] = useState(false);
    const [helpImage, setHelpImage] = useState(false);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    
    const handleHelpDialogOpen = (type,subType) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        switch (type) {
            case 'Counter Flashing':
                if(subType==='Surface Mounted'){
                    setHelpImage(imgSurfaceMounted);
                }else if(subType==='Stucco Stop'){
                    setHelpImage(imgStuccoStop);
                }else if(subType==='1 Piece Reglet'){
                    setHelpImage(imgOnePieceReglet);
                }else if(subType==='2 Piece Reglet'){
                    setHelpImage(imgTwoPieceReglet);
                }else if(subType==='Slip Flashing'){
                    setHelpImage(imgSlipMetalFlashing);
                }
                break;
            case 'Edge Metal Termination':
                if(subType==='Drip Edge'){
                   setHelpImage(imgDripEdge);
                }else if(subType==='Gravel Stop'){
                   setHelpImage(imgGravelStop);
                }else if(subType==='Edge Fascia'){
                   setHelpImage(imgMetalFascia);
                }else if(subType==='Termination Bar'){
                   setHelpImage(imgTerminationBar);
                }
                break;
            case 'Expansion Joints':
                setHelpImage(imgExpansionJoint);
                break;
            case 'Goose Necks':
                setHelpImage(imgGooseNeck);
                break;    
            case 'Line Jacks':
                setHelpImage(imgLineJack);
                break;       
            case 'APV’s':
                setHelpImage(imgApvs);
                break;       
            case 'Coping':
                setHelpImage(imgCoping);
                break;
            default:
                setHelpImage('');
                break;
        }
        setHelpDialogOpen(true);
    }

    const handleImageDialogOpen = (index,imgIndex) => (e) => {
        var newImages = uploadFiles['roofDetails'][index]['images'].map((imgSrc,index)=>{
            return {source:imgSrc}
        });
        setImages(newImages);
        setCurrentImage(imgIndex);
        setImageDialogOpen(true);
    }

    const handleChangeOptions = (index, key1, key2) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        if(key1==='metalTerminationFlashingsType'){
            var type = e.target.value;
            var subTypes = metalTerminationFlashingsTypes[type]['types'];
            newOptions['roofDetails'][index] = {
                metalTerminationFlashingsType: type,
                type:subTypes.length>0?subTypes[0]:'',
                dimensions: {...metalTerminationFlashingsTypes[type]['dimensions']},
                images:[]
            }
            if(['Counter Flashing','Edge Metal Termination','Coping','Expansion Joints'].includes(type)){
               newOptions['roofDetails'][index] = {
                    ...newOptions['roofDetails'][index],
                    size:'',
                    materialType: materialTypes[0]
               }
            }else if(type==='Pitch Pans'){
                newOptions['roofDetails'][index] = {
                    ...newOptions['roofDetails'][index],
                    size:'',
                    count:'',
                    materialType: materialTypes[0],
               }
            }else if(['Goose Necks','Line Jacks','APV’s'].includes(type)){
                newOptions['roofDetails'][index] = {
                    ...newOptions['roofDetails'][index],
                    count:'',
                    materialType: materialTypes[0],
               }   
            }else if(type==='A/C Stand Legs'){
                newOptions['roofDetails'][index] = {
                    ...newOptions['roofDetails'][index],
                    height:'',
                    count:'',
                    materialType: materialTypes[0]
                }
            }else if(['A/C Stands','A/C Units'].includes(type)){
                newOptions['roofDetails'][index] = {
                    ...newOptions['roofDetails'][index],
                    count:'',
                }
            }else if(['VTR’s','Abandoned Equipment'].includes(type)){
                newOptions['roofDetails'][index] = {
                    ...newOptions['roofDetails'][index],
                    size:'',
                    count:'',
                }
            }else if(['A/C Units on Curbs','Roof Hatch','Skylights'].includes(type)){
                newOptions['roofDetails'][index] = {
                    ...newOptions['roofDetails'][index],
                    size:'',
                    curbSize:'',
                    count:'',
                }    
            }else if(['Condensation Lines','Electrical Lines on roof','Electrical Lines on walls','Lightning Protection'].includes(type)){
                newOptions['roofDetails'][index] = {
                    ...newOptions['roofDetails'][index],
                    length:''
                }
            }
            let newUploadFiles = {...uploadFiles};
            newUploadFiles['roofDetails'][index] = {
                files:[],
                images:[]
            }
            setUploadFiles(newUploadFiles);
        }else if(key1==='type'){
            var subType = e.target.value;
            newOptions['roofDetails'][index][key1] = subType;
            if(newOptions['roofDetails'][index]['metalTerminationFlashingsType']==='Counter Flashing'){
                switch (subType) {
                    case 'Surface Mounted':
                        newOptions['roofDetails'][index] = {
                            ...newOptions['roofDetails'][index],
                            dimensions:{A:'',B:''}
                        }
                        break;
                    case 'Stucco Stop':
                        newOptions['roofDetails'][index] = {
                            ...newOptions['roofDetails'][index],
                            dimensions:{A:''}
                        }
                        break;
                    case '1 Piece Reglet':
                        newOptions['roofDetails'][index] = {
                            ...newOptions['roofDetails'][index],
                            dimensions:{A:''}
                        }
                        break;  
                    case '2 Piece Reglet':
                        newOptions['roofDetails'][index] = {
                            ...newOptions['roofDetails'][index],
                            dimensions:{A:'',B:''}
                        }
                        break;    
                    case 'Slip Flashing':
                        newOptions['roofDetails'][index] = {
                            ...newOptions['roofDetails'][index],
                            dimensions:{A:''}
                        }
                        break;            
                    default:
                        newOptions['roofDetails'][index] = {
                            ...newOptions['roofDetails'][index],
                            dimensions:{}
                        }
                        break;
                }
            }else if(newOptions['roofDetails'][index]['metalTerminationFlashingsType']==='Edge Metal Termination'){
                 switch (subType) {
                    case 'Drip Edge':
                        newOptions['roofDetails'][index] = {
                            ...newOptions['roofDetails'][index],
                            dimensions:{A:'',B:'',C:'',D:''}
                        }
                        break;
                    case 'Gravel Stop':
                        newOptions['roofDetails'][index] = {
                            ...newOptions['roofDetails'][index],
                            dimensions:{A:'',B:'',C:''}
                        }
                        break;
                    case 'Edge Fascia':
                        newOptions['roofDetails'][index] = {
                            ...newOptions['roofDetails'][index],
                            dimensions:{A:'',B:''}
                        }
                        break;  
                    case 'Termination Bar':
                        newOptions['roofDetails'][index] = {
                            ...newOptions['roofDetails'][index],
                            dimensions:{A:''}
                        }
                        break;        
                    default:
                        newOptions['roofDetails'][index] = {
                            ...newOptions['roofDetails'][index],
                            dimensions:{}
                        }
                        break;
                 }
            }
        }else if(key1==='dimensions'){
            newOptions['roofDetails'][index][key1][key2] = e.target.value;
        }else{
            newOptions['roofDetails'][index][key1] = e.target.value;
        }
        setOptions(newOptions);
    }

    const handleAddRow = () => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var dimensions = metalTerminationFlashingsTypes[Object.keys(metalTerminationFlashingsTypes)[0]]['dimensions'];
        newOptions['roofDetails'] = [
            ...newOptions['roofDetails'],
            {
                metalTerminationFlashingsType: Object.keys(metalTerminationFlashingsTypes)[0],
                type:metalTerminationFlashingsTypes[Object.keys(metalTerminationFlashingsTypes)[0]]['types'][0],
                size:'',
                materialType: materialTypes[0],
                dimensions:{...dimensions},
                images:[]
            }
        ];
        setOptions(newOptions);

        let newUploadFiles = {...uploadFiles};
        newUploadFiles['roofDetails'] = [
            ...newUploadFiles['roofDetails'],
            {
                files:[],
                images:[]
            }
        ];
        setUploadFiles(newUploadFiles);

        setTimeout(() => {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }, 500);
    }

    const handleRemoveRow = (removeIndex) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var newRows = newOptions['roofDetails'].filter((item,index) => index !== removeIndex);
        newOptions['roofDetails'] = newRows;
        setOptions(newOptions);
        
        let newUploadFiles = {...uploadFiles};
        var newImageItems = newUploadFiles['roofDetails'].filter((item,index) => index !== removeIndex);
        newUploadFiles['roofDetails'] = newImageItems
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
        var count = uploadFiles['roofDetails'][index]['images'].length;
        var newFiles = files.filter((file, index) => index < 4 - count).map((file, index) => {
            return new File([file], `${uuidv4()}.${MIME_TYPE_MAP[file.type]}`, {
                type: file.type,
                lastModified: file.lastModified,
            });
        });
        let newOptions = JSON.parse(JSON.stringify(options));
        newFiles.forEach(file => {
            newOptions['roofDetails'][index]['images'].push(file.name);
        });
        setOptions(newOptions);

        var newImages = [];
        for (var i = 0; i < newFiles.length; i++) {
            var imgSrc = await toBase64(newFiles[i]);
            newImages.push(imgSrc);
        }
        let newUploadFiles = {...uploadFiles};
        newUploadFiles['roofDetails'][index]['files'] = [
            ...newUploadFiles['roofDetails'][index]['files'],
            ...newFiles
        ];
        newUploadFiles['roofDetails'][index]['images'] = [
            ...newUploadFiles['roofDetails'][index]['images'],
            ...newImages
        ];
        setUploadFiles(newUploadFiles);
    }

    const handleRemoveImage = (rowIndex, removeIndex) => (e) => {
        let newOptions = JSON.parse(JSON.stringify(options));
        var newImageItems = newOptions['roofDetails'][rowIndex]['images'].filter((item, index) => index !== removeIndex);
        newOptions['roofDetails'][rowIndex]['images'] = newImageItems;
        setOptions(newOptions);

        var newFiles = uploadFiles['roofDetails'][rowIndex]['files'].filter((item, index) => index !== removeIndex);
        var newImages = uploadFiles['roofDetails'][rowIndex]['images'].filter((item, index) => index !== removeIndex);
        
        let newUploadFiles = {...uploadFiles};
        newUploadFiles['roofDetails'][rowIndex]['files'] = newFiles;
        newUploadFiles['roofDetails'][rowIndex]['images'] = newImages;
        setUploadFiles(newUploadFiles);
    }

    return(
        <>
        <Grid container justifyContent="flex-end" style={{marginBottom:24}}>
            <Button className={classes.addButton}
                    color="primary"  startIcon={<AddIcon />}
                    onClick={handleAddRow}
            >Add Roof Details</Button>
        </Grid>
        <ValidatorForm onSubmit={(e)=>e.preventDefault()} style={{ width: '100%' }}>
            {options['roofDetails'].map((row,rowIndex)=>
                <Paper key={`roofDetails-${rowIndex}`} className={classes.paper}>
                    <TextField 
                        className={clsx(classes.textBox, classes.spacious)}
                        variant="outlined"
                        label="Select metal flashings"
                        fullWidth
                        InputLabelProps={{shrink: true}}
                        select={true}
                        SelectProps={selectMenuProps}
                        value={row.metalTerminationFlashingsType}
                        onChange={handleChangeOptions(rowIndex,'metalTerminationFlashingsType')}
                    >{Object.keys(metalTerminationFlashingsTypes).map((item, index)=> 
                        <MenuItem key={`${rowIndex}-${item}`} value={item} style={{paddingTop:2,paddingBottom:2}}>{item}</MenuItem>
                     )}
                    </TextField>
                    {row.type!=='' && (
                        <TextField 
                            className={clsx(classes.textBox, classes.spacious)}
                            variant="outlined"
                            label="Subset"
                            fullWidth
                            InputLabelProps={{shrink: true}}
                            select={true}
                            SelectProps={selectMenuProps}
                            value={row.type}
                            onChange={handleChangeOptions(rowIndex,'type')}
                        >{metalTerminationFlashingsTypes[row.metalTerminationFlashingsType]['types'].map(item=> 
                            <MenuItem key={item} value={item}>{item}</MenuItem>
                         )}
                        </TextField>
                    )}
                    {(['Counter Flashing','Edge Metal Termination','Coping','Expansion Joints'].includes(row.metalTerminationFlashingsType)) && (
                      <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <InchesFormat
                                    className={classes.textBox}
                                    label={row.metalTerminationFlashingsType === 'Counter Flashing'?'Size':'Size/Strech out'}
                                    value={row.size}
                                    onChange={handleChangeOptions(rowIndex,'size')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    className={classes.textBox}
                                    variant="outlined"
                                    label="Material Type"
                                    fullWidth
                                    InputLabelProps={{shrink: true}}
                                    select={true}
                                    SelectProps={selectMenuProps}
                                    value={row.materialType}
                                    onChange={handleChangeOptions(rowIndex,'materialType')}
                                >{materialTypes.map((item, index)=><MenuItem key={`material-${rowIndex}-${index}`} value={item}>{item}</MenuItem>)}
                                </TextField>
                            </Grid>
                       </Grid>
                    )}
                    {['Pitch Pans','A/C Stand Legs'].includes(row.metalTerminationFlashingsType) && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>                                
                                {row.metalTerminationFlashingsType==='Pitch Pans' && (
                                    <TextField
                                        className={classes.textBox}
                                        label="Size"
                                        InputLabelProps={{shrink: true}}
                                        variant="outlined"
                                        placeholder="e.g. 12″×24″"
                                        fullWidth
                                        autoComplete="off"
                                        InputProps={{
                                            inputComponent: SizeFormat
                                        }}
                                        select={['', ...sizeTypes].includes(row.size)?true:false}
                                        SelectProps={selectMenuProps}
                                        value={row.size}
                                        onChange={handleChangeOptions(rowIndex,'size')}
                                    >{[...sizeTypes, 'Custom Size'].map((item, idx)=><MenuItem key={idx} value={item}>{item}</MenuItem>)}
                                    </TextField>
                                )}
                                {row.metalTerminationFlashingsType==='A/C Stand Legs' && (
                                    <InchesFormat
                                        className={classes.textBox}
                                        label="Height"
                                        value={row.height}
                                        onChange={handleChangeOptions(rowIndex,'height')}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextValidator
                                    className={classes.textBox}
                                    label="Count"
                                    InputLabelProps={{shrink: true}}
                                    variant="outlined"
                                    fullWidth
                                    autoComplete="off"
                                    value={row.count}
                                    onChange={handleChangeOptions(rowIndex,'count')}
                                    validators={['isNumber', 'isPositive']}
                                    errorMessages={['Must be integer', 'Must be positive.']}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField 
                                    className={classes.textBox}
                                    variant="outlined"
                                    label="Material Type"
                                    fullWidth
                                    InputLabelProps={{shrink: true}}
                                    select={true}
                                    SelectProps={selectMenuProps}
                                    value={row.materialType}
                                    onChange={handleChangeOptions(rowIndex,'materialType')}
                                >{materialTypes.map((item, index)=><MenuItem key={`material-${rowIndex}-${index}`} value={item}>{item}</MenuItem>)}
                                </TextField>
                            </Grid>
                       </Grid>
                    )}
                    {['Goose Necks','Line Jacks','APV’s'].includes(row.metalTerminationFlashingsType) && (
                        <Grid container spacing={3}>                            
                            <Grid item xs={12} sm={6}>
                                <TextValidator
                                    className={classes.textBox}
                                    label="Count"
                                    InputLabelProps={{shrink: true}}
                                    variant="outlined"
                                    fullWidth
                                    autoComplete="off"
                                    value={row.count}
                                    onChange={handleChangeOptions(rowIndex,'count')}
                                    validators={['isNumber', 'isPositive']}
                                    errorMessages={['Must be integer', 'Must be positive.']}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    className={classes.textBox}
                                    variant="outlined"
                                    label="Material Type"
                                    fullWidth
                                    InputLabelProps={{shrink: true}}
                                    select={true}
                                    SelectProps={selectMenuProps}
                                    value={row.materialType}
                                    onChange={handleChangeOptions(rowIndex,'materialType')}
                                >{materialTypes.map((item, index)=><MenuItem key={`material-${rowIndex}-${index}`} value={item}>{item}</MenuItem>)}
                                </TextField>
                            </Grid>
                       </Grid>
                    )}
                    {['VTR’s','Abandoned Equipment'].includes(row.metalTerminationFlashingsType) && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <InchesFormat
                                    className={classes.textBox}
                                    label="Dimensions"
                                    value={row.size}
                                    onChange={handleChangeOptions(rowIndex,'size')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextValidator
                                    className={classes.textBox}
                                    label="Count"
                                    InputLabelProps={{shrink: true}}
                                    variant="outlined"
                                    fullWidth
                                    autoComplete="off"
                                    value={row.count}
                                    onChange={handleChangeOptions(rowIndex,'count')}
                                    validators={['isNumber', 'isPositive']}
                                    errorMessages={['Must be integer', 'Must be positive.']}
                                />
                            </Grid>
                       </Grid>
                    )}
                    {['A/C Units on Curbs','Roof Hatch','Skylights'].includes(row.metalTerminationFlashingsType) && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <InchesFormat
                                    className={classes.textBox}
                                    label="Height"
                                    value={row.size}
                                    onChange={handleChangeOptions(rowIndex,'size')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    className={classes.textBox}
                                    label="Curb Size"
                                    InputLabelProps={{shrink: true}}
                                    variant="outlined"
                                    placeholder="e.g. 12″×24″"
                                    fullWidth
                                    autoComplete="off"
                                    value={row.curbSize}
                                    onChange={handleChangeOptions(rowIndex,'curbSize')}
                                    InputProps={{
                                        inputComponent: SizeFormat
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextValidator
                                    className={classes.textBox}
                                    label="Count"
                                    InputLabelProps={{shrink: true}}
                                    variant="outlined"
                                    fullWidth
                                    autoComplete="off"
                                    value={row.count}
                                    onChange={handleChangeOptions(rowIndex,'count')}
                                    validators={['isNumber', 'isPositive']}
                                    errorMessages={['Must be integer', 'Must be positive.']}
                                />
                            </Grid>
                       </Grid>
                    )}
                    {['A/C Stands','A/C Units'].includes(row.metalTerminationFlashingsType) && (
                        <TextValidator
                            className={clsx(classes.textBox,classes.spacious)}
                            label="Count"
                            InputLabelProps={{shrink: true}}
                            variant="outlined"
                            fullWidth
                            autoComplete="off"
                            value={row.count}
                            onChange={handleChangeOptions(rowIndex,'count')}
                            validators={['isNumber', 'isPositive']}
                            errorMessages={['Must be integer', 'Must be positive.']}
                        />
                    )}
                    {['Condensation Lines','Electrical Lines on roof',
                      'Electrical Lines on walls','Lightning Protection'].includes(row.metalTerminationFlashingsType) && (
                            <InchesFormat
                                className={clsx(classes.textBox,classes.spacious)}
                                label="Length"
                                value={row.length}
                                onChange={handleChangeOptions(rowIndex,'length')}
                            />
                    )}
                    {Object.keys(row.dimensions).length>0 && (
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
                                            onClick={handleHelpDialogOpen(row.metalTerminationFlashingsType,row.type)}
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
                                        onChange={handleChangeOptions(rowIndex,'dimensions',symbol)}
                                    />
                                </Grid>
                            )}
                        </Grid>
                        </>
                    )}
                    {(row.metalTerminationFlashingsType === 'A/C Stands' ||
                      row.metalTerminationFlashingsType === 'A/C Units')?null:(
                        <>
                        <div className={classes.sectionTitle}>Pictures</div>
                        <Grid container spacing={3} style={{marginBottom:24}}>
                            {uploadFiles['roofDetails'][rowIndex]['images'].map((imgSrc,imgIndex)=>
                                <Grid key={`img-${rowIndex}-${imgIndex}`} item xs={6} sm={3}>
                                    <div className={classes.imageBox}>
                                        <Avatar src={imgSrc} onClick={handleImageDialogOpen(rowIndex, imgIndex)} />
                                        <IconButton color="default" aria-label="remove image"
                                            onClick={handleRemoveImage(rowIndex, imgIndex)}
                                        ><CloseIcon /></IconButton>
                                    </div>  
                                </Grid>    
                            )}
                            {uploadFiles['roofDetails'][rowIndex]['images'].length < 4 && (
                                <Grid item xs={6} sm={3}>
                                    <input type="file" id={`uploadPicture-${rowIndex}`}
                                        accept=".png, .jpg, .jpeg" multiple
                                        style={{display:'none'}}
                                        onChange={handleUploadImages(rowIndex)}
                                    />
                                    <label htmlFor={`uploadPicture-${rowIndex}`} className={classes.uploadPicture}>
                                        <AddIcon />
                                        <div>ADD PICTURE</div>
                                    </label>
                                </Grid>
                            )}
                        </Grid>
                        </>
                    )}
                    {rowIndex>0 && (
                        <Grid container justifyContent="flex-end">
                            <Button className={classes.removeButton}
                                    color="default" startIcon={<DeleteIcon />}
                                    onClick={handleRemoveRow(rowIndex)}
                            >Remove</Button>
                        </Grid>
                    )}
                </Paper>
            )}
        </ValidatorForm>
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

export default withStyles(styles)(RoofDetails);

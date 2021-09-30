//export const BASE_URL = 'http://localhost:3001';
export const BASE_URL = 'https://server.x-scope.net';

export const SITE_URL = 'www.x-scope.net';

export const FOOTER_TEXT = 'Copyright © 2021 ' + SITE_URL;

export const google = window.google;

export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoicmF1bGNhcnBpbyIsImEiOiJja25lbzVmMXMyaTA5Mm9waDRoN3JzeTluIn0.vv2P5-OjpjGPfEmA6NK5KA';

export const blankStyle = {
    "version": 8,
    "name": "blank",
    "sources": {},
    "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    "layers": [{
      "id": "background",
      "type": "background",
      "paint": {
        //"background-color": "#1d1f20"
        "background-color": "#707070"
      }
    }]
};

export const rowsPerPage = 10; // view project counts per page on project page

export const selectedColor = '#000'; // selected color when edges/areas are selected

export const pitches = generatePitches();

 function generatePitches() {
   var temp = [];
   for(var i=0;i<25;i++){
      temp[`${i}/12`] = `${i} / 12`;
   }
   return temp;
 }

 export const edges = {
    'eaves': {name:'Eaves', style:'solid', color:'rgb(113, 191, 130)'},
    'valleys':{name:'Valleys', style:'solid', color:'rgb(240, 81, 46)'},
    'hips':{name:'Hips', style:'solid', color:'rgb(147, 104, 183)'},
    'ridges':{name:'Ridges', style:'solid', color:'rgb(208, 239, 177)'},
    'rakes':{name:'Rakes', style:'solid', color:'rgb(255, 204, 15)'},
    'wall_flashing':{name:'Wall Flashing', style:'dashed', color:'rgb(65, 135, 175)'},
    'step_flashing':{name:'Step Flashing', style:'dashed', color:'rgb(168, 107, 50)'},
    'transition':{name:'Transition', style:'solid', color:'rgb(251, 104, 255)'},
    'unspecified':{name:'Unspecified', style:'solid', color:'rgb(85, 211, 252)'}
};

export const roofAccessItems = [
   'Ladder',
   'Roof Hatch',
   'Stairwell to the Roof',
   'Exterior Access',
   'Elevator'
];

export const projectTypes = [
   'Steep Slope Roofs',
   'Low Slope Roofs'
];

export const roofLifeCycleItems = [
   'A (Repair and maintenance +15 years)',
   'B (Repair and maintenance 10-14 years)',
   'C (Repair and maintenance 5-9 years)',
   'D (Restore 2-4 years)',
   'E (Re-roof 0-2 years)',
];

export const surfacingTypes = [
   'N/A',
   'BUR/Gravel',
   'CTP/Gravel',
   'MOD BIT',
   'Single Ply',
   'BUR'
];

export const attachmentItems = [
   'N/A',
   'Mechanically Fasten',
   'Mopped',
   'Adhered'
];

export const insulationTypes = [
   'N/A',
   'Wood Fiber',
   'Perlite',
   'ISO',
   'LWIC',
   'EPS',
   'Extruded',
   'SPF'
];

export const roofDeckTypes = [
   'Steel',
   'Concrete',
   'Gypsum',
   'Tectum',
   'LWIC',
   'Wood'
];

export const slopeDefinitionItems = [
   'Structural Slope',
   'LWIC Slope',
   'Tapered Slope'
];

export const slopeValueItems = ['1/8', '1/4', '1/2', '1/12', '2/12', '3/12', '4/12'];

export const drainageTypes = {
   'Internal Drains':{
      types: [
         'Overflow Drains',
         'Main Drains'
      ],
      dimensions:{A:'',B:'',C:''}
   },
   'Primary Scuppers':{
      types:[
         'Overflow Scuppers',
         'Primary Scuppers',
         'EOS',
         'Primary open top scuppers'
      ],
      dimensions:{A:'',B:'',C:''}
   },
   'Gutter':{
      types: [
         'Seamless',
         'Box',
         'K-Style'
      ],
      dimensions:{A:'',B:'',C:'',D:''}
   },
   'Downspout':{
      types:[
         'Seamless',
         'Box',
         'K-Style'
      ],
      dimensions:{A:'',B:'',C:''}
   },
   'Leaderheads':{
      types:[],
      dimensions:{A:'',B:'',C:'',D:'',E:'',F:'',G:''}
   }
}

export const sizeTypes = [
   '4″×4″',
   '6″×6″',
   '8″×8″',
   '10″×10″',
   '12″×12″',
   '16″×16″',
   '24″×24″'
];

export const materialTypes = [
   'Aluminium',
   'Cast Iron',
   'Copper',
   'Galvanized',
   'PVC',
   'Stainless Steel',
   'Other'
];

export const materialCompositionItems = [
   'Wood',
   'Concrete',
   'Steel'
];

export const metalTerminationFlashingsTypes = {
    'Counter Flashing':{
      types:[
         'Surface Mounted',
         'Stucco Stop',
         '1 Piece Reglet',
         '2 Piece Reglet',
         'Slip Flashing'
      ],
      dimensions:{A:'',B:''}
    },
    'Edge Metal Termination':{
      types:[
         'Drip Edge',
         'Gravel Stop',
         'Edge Fascia',
         'Termination Bar'
      ],
      dimensions:{A:'',B:'',C:'',D:''}
    },
    'Coping':{
       types:[],
       dimensions:{A:'',B:'',C:'',D:''}
    },
    'Expansion Joints':{
      types:[],
      dimensions:{A:'',B:'',C:'',D:''}
    },
    'VTR’s':{
      types:[],
      dimensions:{}
    },
    'Pitch Pans':{
      types:[],
      dimensions:{}
    },
    'A/C Stands':{
      types:[],
      dimensions:{}
    },
    'A/C Units':{
      types:[],
      dimensions:{}
    },
    'A/C Stand Legs':{
      types:[],
      dimensions:{}
    },
    'A/C Units on Curbs':{
      types:[],
      dimensions:{}
    },
    'Roof Hatch':{
      types:[],
      dimensions:{}
    },
    'Skylights':{
      types:[],
      dimensions:{}
    },
    'Goose Necks':{
      types:[],
      dimensions:{A:'',B:'',C:''}
    },
    'Line Jacks':{
      types:[],
      dimensions:{A:'',B:'',C:'',D:'',E:''}
    },
    'APV’s':{
      types:[],
      dimensions:{A:''}
    },
    'Abandoned Equipment':{
      types:[],
      dimensions:{}
    },
    'Condensation Lines':{
      types:[],
      dimensions:{}
    },
    'Electrical Lines on roof':{
      types:[],
      dimensions:{}
    },
    'Electrical Lines on walls':{
      types:[],
      dimensions:{}
    },
    'Lightning Protection':{
       types:[],
       dimensions:{}
    }
};

export const initialOptions = {
   basicInformation: {
      projectName: '',
      projectType: projectTypes[0],
      address: '',
      location: {lat:0, lng:0},
      city: '',
      state:'',
      zipCode:'',
      contactName:'',
      email:'',
      phone:'',
      mobilePhone:'',
      fax:''
   },
   propertyAccess:{
      buildingHeight:'',
      roofAccess: roofAccessItems[0],
   },
   miscellaneousInformation:{
      salesStatus:'',
      marketingStatus:'',
      bidDate:'',
      leadForm:'',
      estimator:'',
      accountManager:'',
      takeOffPerson:'',
      productsServices:'',
      clientProfile:'',
      contractType:'',
      bdm:'',
      hardBid:''
   },
   generalConditions:{
     roofLifeCycle: roofLifeCycleItems[0],
     roofComposition:[{
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
            insulationTypeThickness_2:'',
        }]
     }],
     roofDeckType: roofDeckTypes[0],
     totalExistingRoofThickness:'',
     images:[]
   },
   roofSlope: {
      slopeDefinition: slopeDefinitionItems[0],
      slopeValue: slopeValueItems[0]
   },
   roofDrainage:{
      drainageRating:'good', // good, poor
      drainageItems:[{
         drainageType: Object.keys(drainageTypes)[0],
         items: [{
            overflowsPresents:'yes',
            size:'',
            type: drainageTypes[Object.keys(drainageTypes)[0]]['types'][0],
            material: materialTypes[0],
            dimensions:drainageTypes[Object.keys(drainageTypes)[0]]['dimensions'],
            images:[]
         }]
      }]
   },
   wallDetails:{
      parapetWallInformation:'good',
      materialComposition: materialCompositionItems[0],
      stucco: 'yes',
      wallProperties:[{
         wallHeight:'',
         wallThinkness:'',
         wallFlashingHeight:'',
         woodNailer:'yes',
         images:[]
      }]
   },
   roofDetails:[{
      metalTerminationFlashingsType: Object.keys(metalTerminationFlashingsTypes)[0],
      type: metalTerminationFlashingsTypes[Object.keys(metalTerminationFlashingsTypes)[0]]['types'][0],
      size:'',
      materialType: materialTypes[0],
      dimensions:metalTerminationFlashingsTypes[Object.keys(metalTerminationFlashingsTypes)[0]]['dimensions'],
      images:[]
   }]
}

export const initialUploadFiles = {
   generalConditions:{
      files:[], images:[]
   },
   roofDrainage:[
      [{ files:[], images:[] }]
   ],
   wallDetails:[{
      files:[], images:[]
   }],
   roofDetails:[{
      files:[],
      images:[]
   }]
}

// react-images component custom styles

export const customModalStyles = {
   blanket: base => ({
      ...base,
      backgroundColor: 'rgba(23,29,41,0.9)', //#171d29
   })
}

export const customCarouselStyles = {
   header: (base, state) => ({
      ...base,
      height:56,
      paddingLeft: 20,
      paddingRight:20,
      paddingBottom:10,
      backgroundColor:'#171d29 !important'
  }),
  view: (base,state) => ({
      ...base,
      '& img':{
          borderRadius:8
      }
  }),
  navigation: (base, state) => ({
      ...base,
      '& button':{
          backgroundColor:'#171d29'
      },
      '& button svg':{
          width:24,
          height:24
      }
  })
}

export const selectMenuProps = {
   MenuProps: {
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
      transformOrigin: { vertical: "top", horizontal: "center" },
      getContentAnchorEl: null
  }
}
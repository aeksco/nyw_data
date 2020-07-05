const fs = require('fs')
const csv = require('fast-csv')

// // // //

// Stores all schools
let schools = {}

// // // //

// // // //
// EXMAPLE OBJECT

// 'SOUTH COLONIE CENTRAL SCHOOL DISTRICT', // SCHOOL DISTRICT
// 'SADDLEWOOD ES', // SCHOOL
// 'Albany', // COUNTY
// 'Public School', // TYPE OF ORGANIZATION
// '55', // NUMBER OF OUTLETS
// 'No', // ANY BUILDINGS WITH LEAD FREE PLUMBING?
// '0', // PREVIOUSLY SAMPLED OUTLETS
// '0', // OUTLETS WAIVER REQUESTED
// '0', // WAIVERS GRANTED
// '55', // OUTLETS SAMPLED AFTER REGULATION
// 'Yes', // SAMPLING COMPLETE?
// '09/15/2016', // SAMPLING COMPLETION DATE
// '55', // NUMBER OF OUTLETS =< 15 ppb
// '0', // NUMBER OF OUTLETS > 15 ppb
// 'No', // OUT OF SERVICE?
// 'Yes', // ALL RESULTS RECEIVED?
// '09/21/2015', // DATE ALL RESULTS RECEIVED
// 'southcolonieschools.org', // SCHOOL WEBSITE
// '010601060005', // BEDS CODE
// '100 LORALEE DR', // SCHOOL STREE
// 'ALBANY', // SCHOOL CITY
// 'NY', // SCHOOL STATE
// '12205', // SCHOOL ZIP CODE
// '11/09/2016', // DATE SAMPLING RESULTS
// '11/09/2016', // DATE RESULTS UPDATED
// '(42.678066, -73.814233)', // COUNTY LOCATION
// '100 LORALEE DR\nALBANY, NY 12205\n(42.73286448300007, -73.83963376499997)' // LOCATION

// // // //

// Attribute indicies
const SCHOOL_DISTRICT = 0 // USED
const SCHOOL_NAME = 1 // USED
const COUNTY_NAME = 2 // USED
const TYPE_OF_ORGANIZATION = 3 // USED
const NUMBER_OF_OUTLETS = 4
const ANY_BUILDINGS_WITH_LEAD_FREE_PLUMBING = 5
const PREVIOUSLY_SAMPLED_OUTLETS = 6
const OUTLETS_WAIVER_REQUESTED = 7
const WAIVERS_GRANTED = 8
const OUTLETS_SAMPLED_AFTER_REGULATION = 9
const SAMPLING_COMPLETE = 10
const SAMPLING_COMPLETION_DATE = 11
const NUMBER_OF_OUTLETS_LEQ_15PPB = 12
const NUMBER_OF_OUTLETS_GE_15PPB = 13
const OUT_OF_SERVICE = 14
const ALL_RESULTS_RECEIVED = 15
const DATE_ALL_RESULTS_RECEIVED = 16
const SCHOOL_WEBSITE = 17
const BEDS_CODE = 18 // USED
const SCHOOL_STREET = 19 // USED
const SCHOOL_CITY = 20 // USED
const SCHOOL_STATE = 21 // USED
const SCHOOL_ZIP_CODE = 22 // USED
const DATE_SAMPLING_RESULTS = 23
const DATE_RESULTS_UPDATED = 24
const COUNTY_LOCATION = 25
const LOCATION = 26

// // // //

// Sanitizes school name
function sanitizeName(name) {
  // name = str(name).strip().title().replace(' (Lead Only)', '')
  name = name.replace('H S', 'High School')
  name = name.replace('E S', 'Elementary School')
  name = name.replace('Es', 'Elementary School')
  name = name.replace('Hs', 'High School')
  name = name.replace('Ms', 'Middle School')
  name = name.replace('Elem School', 'Elementary School')
  name = name.replace('P S ', 'PS #')
  return name
}

function getRestaurant(data) {
  return schools[data[1]]
}

// Turns each CSV row into an object
function toObject(data) {

  // FROM JUPYTER NOTEBOOK
  // return {
  //   'name': sanitizeName(data['School']),
  //   'beds_code': str(data['BEDS Code']).strip().title(),
  //   'district': str(data['School District']).strip().title(),
  //   'address': {
  //       #'street': str(data['School Street']).strip().title(),
  //       'city': str(data['School City']).strip().title(),
  //       'state': str(data['School State']).strip().title(),
  //       'county': str(data['County']).strip().title(),
  //       'zip_code': str(int(data['School Zip Code'])).strip().title()
  //   },
  //   'sector': str(data['Type of Organization']).strip().title(),
  //   'outlets': str(data['Number of Outlets']).strip().title(),
  //   'lead_free': str(data['Any Buildings with Lead-Free Plumbing?']).strip().title(),
  //   'outlets_sampled_pre_2016': str(data['Previously Sampled Outlets']).strip().title(),
  //   'outlet_waivers_requested': str(data['Outlets Waiver Requested']).strip().title(),
  //   'outlet_waivers_granted': str(data['Waivers Granted']).strip().title(),
  //   'outlets_sampled_post_regulation': str(data['Outlets Sampled After Regulation']).strip().title(),
  //   'sampling_completed': str(data['Sampling Complete']).strip().title(),
  //   'sampling_completed_date': str(data['Sampling Completion Date']).strip().title(),
  //   'outlets_leq_15ppb': str(data['Number of Outlets, Result ≤ 15 ppb']).strip().title(),
  //   'outlets_gt_15ppb': str(data['Number of Outlets, Result > 15 ppb']).strip().title(),
  //   'out_of_service': str(data['Out of Service']).strip().title(),
  //   // #'all_results_received': str(data['All Results Received']).strip().title(),
  //   'all_results_received_date': str(data['Date All Results Received']).strip().title(),
  //   // #'website': data['School Website'],
  //   'sampling_update_date': str(data['Date Sampling Updated']).strip().title(),
  //   'results_update_date': str(data['Date Results Updated']).strip().title(),
  //   'county_coords': str(data['County Location']).strip().title(),
  //   'coords': str(data['Location']).strip().title().replace('(', '').replace(')', '').split(', ')
  // }

  return {
    district: data[SCHOOL_DISTRICT],
    school: data[SCHOOL_NAME],
    county: data[COUNTY_NAME],
    beds_code: data[BEDS_CODE],
    sector: data[TYPE_OF_ORGANIZATION],
    out_of_service: data[OUT_OF_SERVICE],
    address: {
      street: data[SCHOOL_STREET],
      city: data[SCHOOL_CITY],
      state: data[SCHOOL_STATE],
      zip: data[SCHOOL_ZIP_CODE]
    }
  }

  // return {}

}

// // // //

function handleRow(data) {
  let row = toObject(data)

  console.log(row)
  console.log("\n")

  // Defines defaultRestaurant object
  // TODO - no empty strings!!
  // let defaultRestaurant = {
  //   facility_id: row.nys_health_operation_id || 'N/A',
  //   facility: row.facility || 'N/A', //.strip().title().replace("'S","'s"),
  //   operation_name: row.operation_name || 'N/A', //.strip().title().replace("'S","'s"),
  //   type: row.food_service_type || 'N/A',
  //   description: row.food_service_description || 'N/A',
  //   address: {
  //       street: row.address.split(',  ')[0] || 'N/A', //.strip().title(),
  //       city: row.address.split(',  ')[1] || 'N/A', // TODO - sanitize city here
  //       state: row.fs_facility_state || 'N/A', //.strip().upper(),
  //       zipcode: row.facility_postal_zipcode || 'N/A' //).strip()
  //   },
  //   inspections: []
  // }

  // Gets restaurant, or uses default
  // let restaurant = schools[defaultRestaurant.facility_id] || defaultRestaurant

  // Defines the default parent inspection for this violation
  // let inspection = {
  //   date: row.date_of_inspection || 'N/A',
  //   type: row.inspection_type || 'N/A',
  //   comment: row.inspection_comments || 'N/A',
  //   violations: []
  // }

  // Gets the parent inspection, or returns defaultInspection
  // inspection = restaurant['inspections'].get(data['DATE OF INSPECTION'], defaultInspection)
  // let hasParent = false
  // restaurant.inspections.forEach((insp) => {
  //     if (insp.date === inspection.date) {
  //       inspection = insp
  //       hasParent = true
  //     }
  // })

  // Adds the individual violation to the inspection record
  // inspection.violations.push(row.violation_item)

  // Adds the restaurant to our complete list
  // schools[school.beds_code] = restaurant

}

// // // //

const stream = fs.createReadStream("data.csv");

const csvStream = csv()
.on("data", handleRow)
.on("end", function(){
  // fs.writeFileSync('output.json', JSON.stringify(schools, null, 2))
  // fs.writeFileSync('violations.json', JSON.stringify(violationLookup, null, 2))
  console.log("done");
});

stream.pipe(csvStream);

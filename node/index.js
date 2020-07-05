const Promise = require('bluebird')
const mongoose = require('mongoose');
const env = require('dotenv').load();

const schoolList = [] // TODO - import from JSON

// // // //

function uploadSchools (School) {

  const ids = Object.keys(schoolList)

  return Promise.each(ids, (k) => {
    let r = Schools[k]

    return new Promise((resolve, reject) => {

      console.log("Wrote " + r.facility_id);
      return School.create(r)
      .then(() => {
        return resolve()
      })

    })
  })
}

// // // //

const School = mongoose.model('schools', new mongoose.Schema({
  name: String,
  stats: mongoose.Schema.Types.Mixed
},
    // Collection options
    {
        timestamps: {
            createdAt: 'createdOn',
            updatedAt: 'updatedOn'
        },
        versionKey: false
    }
));

// // // //

// MongoDB connection logic
mongoose.connect(process.env.MONGO_ATLAS_URI, { useNewUrlParser: true })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // console.log(db)
  // uploadSchools(School)
  // .then(() => {
  //   console.log('DONEZO')
  // })
  process.exit(0);
});
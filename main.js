
const loadSpliceJunctionTrack = (name, coverageFilePath, junctionsFilePath) => {
  console.log('Loading coverageFilePath', coverageFilePath)
  console.log('Loading junctionsFilePath', junctionsFilePath)

  let minUniquelyMappedReads = parseInt(document.getElementById('minUniquelyMappedReads').value);
  let minTotalReads = parseInt(document.getElementById('minTotalReads').value);
  let maxFractionMultiMappedReads = parseInt(document.getElementById('maxFractionMultiMappedReads').value);
  let minSplicedAlignmentOverhang = parseInt(document.getElementById('minSplicedAlignmentOverhang').value);
  let labelIsAnnotatedJunction = document.getElementById('labelIsAnnotatedJunction').value;
  let thicknessBasedOn = document.getElementById('thicknessBasedOn').value;
  let bounceHeightBasedOn = document.getElementById('bounceHeightBasedOn').value;
  let colorBy = document.getElementById('colorBy').value;
  let hideAnnotatedJunctions = document.getElementById('hideAnnotatedJunctions').checked;
  let hideUnannotatedJunctions = document.getElementById('hideUnannotatedJunctions').checked;
  /*
            minUniquelyMappedReads: 1,
            minTotalReads: 1,
            maxFractionMultiMappedReads: 1,
            minSplicedAlignmentOverhang: 0,
            thicknessBasedOn: 'numUniqueReads', //options: numUniqueReads (default), numReads, isAnnotatedJunction
            bounceHeightBasedOn: 'random', //options: random (default), distance, thickness
            colorBy: 'isAnnotatedJunction', //options: numUniqueReads (default), numReads, isAnnotatedJunction, strand
            labelUniqueReadCount: true,
            labelMultiMappedReadCount: true,
            labelTotalReadCount: false,
            labelIsAnnotatedJunction: " [A]",
            hideAnnotatedJunctions: false,
            hideUnannotatedJunctions: false,
         */

  igv.getBrowser().loadTrack({
    type: 'merged',
    name: name,
    height: 175,
    tracks: [
      {
        type: 'wig',
        format: "bigwig",
        url: coverageFilePath,
        //oauthToken: token,
      },
      {
        type: 'junctions',
        format: 'bed',
        url: junctionsFilePath,
        indexURL: `${junctionsFilePath}.tbi`,
        displayMode: 'COLLAPSED',
        //oauthToken: token,
        minUniquelyMappedReads: minUniquelyMappedReads,
        minTotalReads: minTotalReads,
        maxFractionMultiMappedReads: maxFractionMultiMappedReads,
        minSplicedAlignmentOverhang: minSplicedAlignmentOverhang,
        thicknessBasedOn: thicknessBasedOn, //options: numUniqueReads (default), numReads, isAnnotatedJunction
        bounceHeightBasedOn: bounceHeightBasedOn, //options: random (default), distance, thickness
        colorBy: colorBy, //options: numUniqueReads (default), numReads, isAnnotatedJunction, strand
        labelUniqueReadCount: true,
        labelMultiMappedReadCount: true,
        labelTotalReadCount: false,
        labelIsAnnotatedJunction: labelIsAnnotatedJunction,
        hideAnnotatedJunctions: hideAnnotatedJunctions,
        hideUnannotatedJunctions: hideUnannotatedJunctions,
      },
    ],
  })
}

const initCheckboxesAndTracks = (parentDiv, sampleInfo) => {

  parentDiv.innerHTML = '';

  sampleInfo.forEach(({name, description, junctions, coverage}) => {
    let divElem = document.createElement("div")
    let labelElem = document.createElement("label")
    let checkboxElem = document.createElement("input")
    checkboxElem.setAttribute("type", "checkbox")
    checkboxElem.setAttribute("class", "sample-checkbox")
    checkboxElem.setAttribute("data-checkbox-track-name", name)
    labelElem.appendChild(checkboxElem)
    labelElem.appendChild(document.createTextNode(name))
    divElem.appendChild(labelElem)
    parentDiv.appendChild(divElem)
    if (description) {
      labelElem.insertAdjacentHTML('beforeend', `<div class="tooltip"><span class="help-icon"> ? </span><span class="tooltiptext">${description}</span></div>`)
    }

    if (isTrackShown(name)) {
      checkboxElem.setAttribute("checked", true)
      loadSpliceJunctionTrack(name, coverage, junctions)
    }

    checkboxElem.addEventListener("click", (e) => {
      if (e.target.checked) {
        updateTrack(name, true)
        loadSpliceJunctionTrack(name, coverage, junctions)
      } else {
        igv.getBrowser().removeTrackByName(name)
      }
    })
  })
}

const initSignOutButton = async () => {
  let divElem = document.createElement("div")
  divElem.insertAdjacentHTML('beforeend', `<p>Signed in as ${await getGoogleUserEmail()}</p>`)

  let buttonElem = document.createElement("input")
  buttonElem.setAttribute("type", "button")
  buttonElem.setAttribute("value", "Sign Out")
  buttonElem.addEventListener("click", async (e) => {
    await googleSignOut()
    await googleSignIn()
  })

  divElem.appendChild(buttonElem)

  document.getElementById("left-bar").appendChild(divElem)
}

const handleFileSelect = (e) => {
  console.log(e.target.files)
  for (let x of e.target.files) {
    console.log(x.type, x.name)
  }
  /*
  igvBrowser.loadTrack({
    type:
    format:
    url:
  })
   */
}

const initIGV = async () => {

  let options = {
    genome: 'hg38',
    locus: getLocus(),
    tracks: [],
  }

  // create IGV browser
  const igvDiv = document.getElementById("igv-div")
  const igvBrowser = await igv.createBrowser(igvDiv, options)

  igvBrowser.on('locuschange', ({chr, start, end, label: locus_string}) => {
    //save the new location
    updateLocus(locus_string)
  })

  igvBrowser.on('trackremoved', (track) => {
    const trackName = track.name

    //update state
    updateTrack(trackName, false)

    // reset checkboxes
    document.querySelectorAll(`input[data-checkbox-track-name="${trackName}"]`).forEach(checkboxElem => {
      if(checkboxElem.checked) {
        checkboxElem.checked = false
      }
    })
  })
}

const initClearAllSamplesButton = () => {
  document.getElementById("clear-all-samples-button").addEventListener('click', () => {
    const reference_track_names = REFERENCE_TRACKS.map(t => t.name)
    getTrackList().filter(trackName => reference_track_names.indexOf(trackName) === -1).forEach(trackName => {
      // remove tracks from IGV
      igv.getBrowser().removeTrackByName(trackName)
    })
  })
}

const initApp = async () => {

  initGlobalProperties()

  try {
    await initGoogleClient()
    await googleSignIn()
    igv.oauth.google.setToken(getGoogleAccessToken)
  } catch(e) {
    console.error("Couldn't authenticate to google", e)
  }

  await initIGV()


  initCheckboxesAndTracks(document.getElementById('reference-tracks'), REFERENCE_TRACKS)
  initCheckboxesAndTracks(document.getElementById('samples'), SAMPLE_TRACKS)

  initClearAllSamplesButton()

  await initSignOutButton()


  /*

  let x = ['minUniquelyMappedReads', 'minTotalReads', 'maxFractionMultiMappedReads', 'minSplicedAlignmentOverhang',
    'labelIsAnnotatedJunction', 'thicknessBasedOn', 'bounceHeightBasedOn', 'colorBy',
    'hideAnnotatedJunctions', 'hideUnannotatedJunctions']

  x.forEach(elemId => {
    document.getElementById(elemId).addEventListener("change", (e) => {
      getTrackList().forEach(trackName => {
        // remove tracks from IGV
        igv.getBrowser().removeTrackByName(trackName)

        document.querySelectorAll(`input[data-checkbox-track-name="${trackName}"]`).forEach(checkboxElem => {
          console.log('resetting track', trackName)
          checkboxElem.checked = false
          checkboxElem.checked = true

        })
      })
    })
  })
  */
  
  //init local files input
  //document.getElementById('local-files').addEventListener('change', handleFileSelect, false)


  //https://cloud.google.com/storage/docs/json_api/v1/
  //const storage = await listGoogleStorageFiles('gs://macarthurlab-rnaseq/test_data')
  //if (window.File && window.FileReader && window.FileList)
  //console.log("#getGoogleStorageFiles", storage)

}


document.addEventListener("DOMContentLoaded", initApp)

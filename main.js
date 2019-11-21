
const loadSpliceJunctionTrack = (name, coverageFilePath, junctionsFilePath) => {
  console.log('Loading coverageFilePath', coverageFilePath)
  console.log('Loading junctionsFilePath', junctionsFilePath)
  igv.getBrowser().loadTrack({
    type: 'merged',
    name: name,
    height: 100,
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
      const isChecked = e.target.checked

      updateTrack(name, isChecked)

      if (isChecked) {
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
}

const initClearAllSamplesButton = () => {
  document.getElementById("clear-all-samples-button").addEventListener('click', () => {
    const reference_track_names = REFERENCE_TRACKS.map(t => t.name)
    getTrackList().filter(trackName => reference_track_names.indexOf(trackName) === -1).forEach(trackName => {
      
      //update state
      updateTrack(trackName, false)

      // remove tracks from IGV
      igv.getBrowser().removeTrackByName(trackName)

      // reset checkboxes
      document.querySelectorAll('#samples input').forEach(checkboxElem => {
        if(checkboxElem.checked) {
          checkboxElem.checked = false
        }
      })
    })
  })
}

const initApp = async () => {

  initGlobalProperties()

  await initGoogleClient()

  await googleSignIn()

  igv.oauth.google.setToken(getGoogleAccessToken)

  await initIGV()

  initCheckboxesAndTracks(document.getElementById('reference-tracks'), REFERENCE_TRACKS)
  initCheckboxesAndTracks(document.getElementById('samples'), SAMPLE_TRACKS)

  initClearAllSamplesButton()

  await initSignOutButton()


  //init local files input
  //document.getElementById('local-files').addEventListener('change', handleFileSelect, false)


  //https://cloud.google.com/storage/docs/json_api/v1/
  //const storage = await listGoogleStorageFiles('gs://macarthurlab-rnaseq/test_data')
  //if (window.File && window.FileReader && window.FileList)
  //console.log("#getGoogleStorageFiles", storage)

}


document.addEventListener("DOMContentLoaded", initApp)

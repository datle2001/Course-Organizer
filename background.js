//the map stores [i,j] as key and Course object as value
let courses_memory = new Map()

function onError(error) {
  console.log(`Error: ${error}`)
}

//send courses' info in memory to content-scripts when the url is loaded
function populateData(tabId, changeInfo, tabInfo) {
  
  let url = "https://my.depauw.edu/e/reg/soc-view/results.asp"

  if(!(tabInfo.status == "complete" 
    && tabInfo.url === url 
    && changeInfo.status == "complete")) return

  console.log("Change info:")
  console.log(changeInfo)
  console.log("tab info")
  console.log(tabInfo)

  let message = {"courses_memory": courses_memory}

  browser.tabs.sendMessage(tabId, message).then(() => {

    console.log('message populate data successfully sent')

  }, onError)
}

browser.tabs.onUpdated.addListener(populateData)

browser.runtime.onMessage.addListener((message) => {

  console.log("background listened")

  courses_memory.clear()

  courses_memory = message['position_course_map']

})


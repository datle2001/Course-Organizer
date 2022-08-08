//create footer and functionalities
let footer = document.createElement("footer")

function changeContent(container, content) {
  container.style.opacity = "0"
  setTimeout(() => {
    container.innerText = content
    container.style.opacity = "1";
  }, 500);
}


//Description retuns table to course description
let des = document.createElement("span")
des.id = "Description"
des.classList.add("bi")
des.classList.add("bi-book")
des.classList.add("tooltip")

let des_tooltip = createTooltip("Class description")
des.appendChild(des_tooltip)

footer.appendChild(des)

des.onclick = () => {
  table_organizer.querySelectorAll(".container").forEach(container => {
    changeContent(container, added_courses.get(parseInt(container.id)).presentTitle)
  })
}


//socButton gives a SOC table of chosen courses
let socButton = document.createElement("span")
socButton.id = "SOC"
socButton.innerText = "#"
socButton.classList.add("tooltip")

let soc_tooltip = createTooltip("SOC number")
socButton.appendChild(soc_tooltip)

footer.appendChild(socButton)

//change from course title to SOC 
socButton.onclick = () => {
  table_organizer.querySelectorAll(".container").forEach(container => {
    changeContent(container, container.id)
  })
}

//Time of main priorities
let clock = document.createElement("span")
clock.id = "Time"
clock.classList.add("bi")
clock.classList.add("bi-clock")
clock.classList.add("tooltip")

let clock_tooltip = createTooltip("Class time")
clock.appendChild(clock_tooltip)

footer.appendChild(clock)
//change to timetable
clock.onclick = () => {
  table_organizer.querySelectorAll(".container").forEach(container => {
    changeContent(container, added_courses.get(parseInt(container.id)).presentTime)
  })
}


//create a sheet containing all chosen courses
let sheets = document.createElement("span")
sheets.id = "Sheets"
sheets.classList.add("bi")
sheets.classList.add("bi-file-spreadsheet")
//footer.appendChild(sheets)

sheets.onclick = () => {
  browser.runtime.sendMessage({name: 'createSheet'}, (response) => {
    console.log(response);
  })
}

//trash removes courses by drag-and-drop operation 
let trash = document.createElement("span")
let trashStyle = trash.style
trash.id = "Remove"
trash.classList.add("bi")
trash.classList.add("bi-trash")
trash.classList.add("tooltip")

let trash_tooltip = createTooltip("Remove class")
trash.appendChild(trash_tooltip)

footer.appendChild(trash)


//allow courses to be dragged over and dropped on trash
function trashToNormal() {
  trashStyle.transform = ""
  trashStyle.color = ""
}

trash.ondragover = (ev) => {
  ev.preventDefault()
}
trash.ondragleave = () => {
  trashToNormal()
}
trash.ondragenter = () => {
  trashStyle.transform = "scale(1.5)"
  trashStyle.color = "red"
}

//remove the course from the table and mark the course unadded
trash.ondrop = (ev) => {
  ev.preventDefault()

  let id = ev.dataTransfer.getData("id_container")
  
  if(id !== "") {
    let container = document.getElementById(id)
    
    container.remove()
    added_courses.delete(parseInt(id))
    trashToNormal()
  }
}


organizer.appendChild(footer)

function createTooltip(text) {
  let tooltip = document.createElement("span")
  tooltip.classList.add("tooltiptext")
  tooltip.textContent = text;
  return tooltip;
}
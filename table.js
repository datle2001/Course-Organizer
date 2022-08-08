//class Course
class Course {
  constructor(course_description_array, course_name, soc, course_time_array) {
    this.description_array = course_description_array
    this.name = course_name
    this.soc = parseInt(soc)
    this.time_array = course_time_array
  }

  //return the title of a course inside a cell
  get presentTitle() {
    let res = this.name + '\n';
    const MAXCHAR = 30
    let arr = [':', '&', '/']
    let regex = /Prindle Reading Course/
    let courseDes = this.description_array[0].trim()
    if(regex.test(courseDes)) {
      res += 'PRC'
      courseDes = courseDes.substring(22, courseDes.length)
    }
    for(let i = 0; i<courseDes.length; i++) {
      let c = courseDes[i]
      let p = courseDes[i-1]
      if(c >= 'A' && c <= 'Z' && i>0 && ((p >= 'a' && p <= 'z') || arr.includes(p))) {
        res += ' '
      }
      res += c
    }
    return (res.length < MAXCHAR) ? res : res.substring(0,MAXCHAR) + '...\n' + ((this.description_array.length == 2) ? this.description_array[1] : '' )
  }

  //return the time of a course inside a cell
  get presentTime() {
    return this.time_array[0] + ((this.time_array.length == 1) ? '' : '\n' + this.time_array[1])
  }

  static createFromRow(row) {
    let cells = row.cells
    let soc = cells[0].innerText.trim()
    if(soc.length > 0) {
      let course_description_array = [cells[2].innerText]
      let course_name = cells[1].innerText
      let course_time_array = [cells[5].innerText]
      let nextRow = row.nextElementSibling
      
      //if the course has lab sessions, gather the lab's time and description as well
      if(isLab(nextRow)) {
        course_description_array.push(nextRow.cells[2].innerText)
        course_time_array.push(nextRow.cells[5].innerText)
      }
      let course = new Course(course_description_array, course_name, soc, course_time_array)
      return course
    }
  }

  get fromCourseToObject() {
    let obj = {
      soc: this.soc,
      name: this.name,
      description_array: this.description_array,
      time_array: this.time_array
    }
    return obj
  }

  static fromObjectToCourse(object) {
    return new Course(object.description_array, object.name, object.soc, object.time_array)
  }
}

//create course organizer table
const NUMCOL = 4
const NUMROW = 6
let table_organizer = document.createElement("table")
table_organizer.id = "organizer_table"
let table_not_reduced = true

//add cells to rows and rows to table
for(let i = 1; i<=NUMROW; i++) {
  let row = document.createElement("tr")
  row.id = i
  row.classList.add("row")
  //add cells to row
  for(let j = 1; j<=NUMCOL; j++) {
    let cell = row.insertCell()
    cell.classList.add("cell")
    cell.style.maxWidth = table_organizer.style.width/NUMCOL
    
    //enable cell droppable
    cell.ondragover = (ev) => {
      ev.preventDefault()
    }
    cell.ondrop = (ev) => {
      drop(ev)
    }
  }
  //add row to table
  table_organizer.appendChild(row)
}+
//add table to course organizer
organizer.appendChild(table_organizer)


//drag if the dragged node is already inside the table
function dragInOrganizer(ev) {
  ev.dataTransfer.setData("id_container", ev.target.id)
}

//drag if the dragged node is new from the class schedule
function dragFromSchedule(ev, course) { 
  ev.dataTransfer.setData("title", course.presentTitle)
  ev.dataTransfer.setData("soc", course.soc)
  ev.dataTransfer.setData("isNew", true)
}

function drop(ev) {
  ev.preventDefault()
  let container;


  //if this course is dragged from the class schedule
  if(ev.dataTransfer.getData("isNew")) {

    let soc = parseInt(ev.dataTransfer.getData("soc"))
    let title = ev.dataTransfer.getData("title")
    
    //alert user has added this course
    if(added_courses.has(soc)) {
      alert("Course " + title + " already included")
      return
    }
    
    //create a node for this course
    container = createContainer(title, soc);
    
    //mark this course is already added to the table
    added_courses.set(soc, dragged_courses.pop())
  }
  //if this course is dragged around inside the table
  else {
    let id = ev.dataTransfer.getData("id_container")
    container = document.getElementById(id)
  }

  //if the target that is about to be dropped on is a cell, add the node to the target
  if(ev.target.nodeName == "TD") {
    ev.target.appendChild(container)
  }
  //if the target that is about to be dropped on is another node course, add the node to the target's parent
  else {
    ev.target.parentNode.appendChild(container)
  }
}

function isLab(row) {
  return row !== null && row.innerText.trim().length > 0 && row.cells[0].innerText.trim().length == 0
}

//Features that relate to DePauw's schedule of courses 
class_schedule.querySelectorAll("tr").forEach(row => {
  if(row.rowIndex > 1 && row.innerText.trim().length > 0) {

    //add color-changing effect to rows that the mouse is currently over
    row.style.transitionDuration = "500ms"
    row.onmouseover = () => {
      row.style.background = "#DCDCDC"
    }
    row.onmouseout = () => {
      row.style.background = "white"
    }

    //make each row draggable and gather information about the course in each row whenever it is dragged
    row.draggable = true
    row.style.cursor = "pointer"
    row.ondragstart = (ev) => {
      let course = Course.createFromRow(row)
      dragged_courses.push(course)
      dragFromSchedule(ev, course)
    }
  } 
})

//populate table with courses fetched from background
function populateCoursesIntoTable(soc_position_map) {
  added_courses.forEach((value,key, map) => {
    let container = createContainer(value.presentTitle, key)
    let position = soc_position_map.get(key)

    table_organizer.rows[position[0]].cells[position[1]].appendChild(container)
  })
}

//create div element called container
function createContainer(title, soc) {
  let container = document.createElement("div")
  container.classList.add("container")
  container.draggable = true
  container.ondragstart = (ev) => {
    dragInOrganizer(ev)
  }

  container.innerText = title
  container.id = soc

  return container
}
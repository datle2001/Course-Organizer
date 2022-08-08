browser.runtime.onMessage.addListener((message) => {
    let courses_memory = message['courses_memory']
    let soc_position_map = new Map();

    courses_memory.forEach((value, key, map) => {

      let course = Course.fromObjectToCourse(value)

      added_courses.set(course.soc, course)
      soc_position_map.set(course.soc, key)
    })

    console.log('Successfully populated data')

    populateCoursesIntoTable(soc_position_map);
})

window.addEventListener('beforeunload', () => {
  let position_course_map = createPositionCourseMap();

  let message = {'position_course_map': position_course_map}

  browser.runtime.sendMessage(message).then(() => {

    console.log('successfully send data to background')

  }, (error) => {

    console.log(`Error: ${error}`)

  })
})

//create a map that stores a course's position in the table and its information
function createPositionCourseMap() {
  let position_course_map = new Map();

  for(let i = 0; i < NUMROW; i++) {
    for(let j = 0; j< NUMCOL; j++) {
      let containers = table_organizer.rows[i].cells[j].children
      for(let k = 0; k<containers.length; k++) {
        let course = added_courses.get(parseInt(containers[k].id))
        let course_object = course.fromCourseToObject
        position_course_map.set([i,j], course_object)
      }
    }
  }
  return position_course_map
}

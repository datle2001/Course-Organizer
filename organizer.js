let body = document.body
let class_schedule = body.querySelectorAll("table").item(2)
let added_courses = new Map()
let dragged_courses = []

//create and style course organizer
let organizer = document.createElement("div")
organizer.id = "organizer"
let organizer_style = organizer.style


body.appendChild(organizer)


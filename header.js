//header of course organizer
let header = document.createElement("h1")
header.textContent = "Course Organizer"

let utility = document.createElement("span")
utility.id = "utility"
utility.classList.add("bi")
utility.classList.add("bi-caret-down")
header.appendChild(utility)
organizer.appendChild(header)

//resize course organizer
utility.onclick = () => {
  let utilClasses = utility.classList
  if(table_not_reduced) {
    organizer_style.height = "fit-content"
    organizer_style.borderRadius = "0px"
    table_organizer.style.display = "none"
    footer.style.display = "none"

    utilClasses.add("bi-caret-up")
  }
  else {
    organizer_style.height = "350px"  
    organizer_style.borderRadius = "10%"
    table_organizer.style.display = "table"
    footer.style.display = "flex"
    utilClasses.remove("bi-caret-up")
  } 
  table_not_reduced = !table_not_reduced
}



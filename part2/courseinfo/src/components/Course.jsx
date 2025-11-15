const Header = ({ courseName }) => {
  console.log('course name is:', courseName)
  return <h2>{courseName}</h2>
}

const Part = ({ partsName, partsExercises }) => {
  console.log('individual part:', partsName, '; with exercises:', partsExercises)
  return (
    <div>
      <p>{partsName} {partsExercises}</p>
    </div>
  )
}

const Content = ({ courseParts }) => {
  console.log('the course parts are', courseParts)
  return (
    <div>
      {courseParts.map(coursePart => 
        <Part key={coursePart.id} partsName={coursePart.name} partsExercises={coursePart.exercises} />
      )}
    </div>
  )
}

const Total = ({ courseParts }) => {
  const totalExercises = courseParts.reduce((sum, coursePart) => sum + coursePart.exercises, 0)
  console.log('Total # of exercises is', totalExercises)
    
  return (
    <div>
      <h4>Total of {totalExercises} exercises</h4>
    </div>
  )
}

const Course = ({ courseName, courseParts }) => {
  console.log('course details', courseName, courseParts)
  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  )
}

export default Course
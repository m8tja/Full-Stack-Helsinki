const Course = ({ course }) => {

    const totalArr = [];

    course.parts.map(c => totalArr.push(c.exercises));

    const total = totalArr.reduce(
        (accumulator, currentValue) => accumulator + currentValue, 0);

    return (
        <div>
            <h2>{course.name}</h2>
            <ul>
                {course.parts.map(c =>
                    <li key={c.id}>
                        {c.name} {c.exercises}
                    </li>
                )}
            </ul>
            <h4>total of {total} exercises</h4>
        </div>
    )
}

export default Course
import { utilService } from "../services/util.service.js"

const { useState, useEffect } = React

export function BugPreview({bug}) {
    const [randomImgNum, setRandomImgNum ] = useState(1)

    useEffect(() => {
        setRandomImgNum(utilService.getRandomIntInclusive(1, 9))
    }, [bug])
    const imgSrc = `https://robohash.org/api/${bug._id}`

    return <article>
        <h4>{bug.title}</h4>
        <img src={imgSrc} alt={`Bug ${randomImgNum}`} />
        <p>Severity: <span>{bug.severity}</span></p>
    </article>
}
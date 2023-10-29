export default function Stats(props) {
    // Constructing the stats object
    props = props.props

    return (
        <div className="stats bg-black text-white p-2 pr-10">
            <div className="stats__generation">
                <span>Generation: </span>
                <span>{props.generationNumber}</span>
            </div>
            <div className="stats__population">
                <span>Population: </span>
                <span>{props.population}</span>
            </div>
            <div className="stats__max-population">
                <span>Max Population: </span>
                <span>{props.maxPopulation}</span>
            </div>
            <div className="stats__min-population">
                <span>Min Population: </span>
                <span>{props.minPopulation}</span>
            </div>
            <div className="stats__new-born">
                <span>New Born: </span>
                <span>{props.newBorn}</span>
            </div>
            <div className="stats__dead">
                <span>Dead: </span>
                <span>{props.dead}</span>
            </div>
        </div>
    )
}
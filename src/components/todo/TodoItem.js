import React from 'react'
import PropTypes from 'prop-types';

export const TodoItem = (props) => {
    const handleToggle = props.handleToggle.bind(null, props.id)
    const handleRemove = props.handleRemove.bind(null, props.id)
    return (
        <li>
            <a href="#" onClick={handleRemove}>x</a>
            <input type="checkbox" onChange={handleToggle}
                checked={props.isComplete}/>{props.name}
        </li>
    )
}

TodoItem.prototypes = {
    name: PropTypes.string.isRequired,
    isComplete: PropTypes.bool,
    id: PropTypes.number.isRequired
}
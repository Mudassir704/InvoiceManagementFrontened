import React from 'react'

export const CheckBox = ({ id, handleCheckChieldElement, isChecked, value }) => {
    return (
       <input key={id} onClick={handleCheckChieldElement} type="checkbox" value={value} />
    )
}

export default CheckBox
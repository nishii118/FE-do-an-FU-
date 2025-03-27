
import { IconButton, Tooltip } from '@mui/material'
import React from 'react'

const NewsActionTooltip = ({ tooltipContent, icon, onclick, color = "primary", placement = "bottom" }) => {
    return (
        <Tooltip title={tooltipContent} placement={placement}>
            <IconButton
                color={color}
                onClick={onclick}
            >
                {icon}
            </IconButton>
        </Tooltip>
    )
}

export default NewsActionTooltip
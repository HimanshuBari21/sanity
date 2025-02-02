import React from 'react'
import {Tooltip, Text, Box} from '@sanity/ui'
import {LinkIcon} from '@sanity/icons'

export function ReferencedDocTooltip() {
  return (
    <Box marginLeft={2}>
      <Text>
        <Tooltip
          content={
            <Box padding={2}>
              <Text muted size={1}>
                This is a referenced document
              </Text>
            </Box>
          }
          placement="right"
          fallbackPlacements={['bottom']}
          portal
        >
          <LinkIcon />
        </Tooltip>
      </Text>
    </Box>
  )
}

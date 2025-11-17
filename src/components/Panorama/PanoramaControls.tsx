import React from 'react'
import ReplayIcon from '@mui/icons-material/Replay'
import CloseIcon from '@mui/icons-material/Close'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { CustomStack } from '../ui/CustomStack.tsx'
import { CustomIconButton } from '../ui/CustomIconButton.tsx'

interface PanoramaControlsProps {
  onClose: () => void
  handleReset: () => void
  rotate: (axis: 'x' | 'y', delta: number) => void
  zoom: (deltaFov: number) => void
}

type Placement = 'top' | 'bottom' | 'left' | 'right'

interface ButtonConfig {
  id: string
  icon: React.ReactNode
  tooltip: string
  placement: Placement
  onClick: () => void
  container: string
}

export const PanoramaControls = ({
  onClose,
  handleReset,
  rotate,
  zoom
}: PanoramaControlsProps) => {
  const buttonsConfig: ButtonConfig[] = [
    {
      id: 'reset',
      icon: <ReplayIcon />,
      tooltip: 'Reset',
      placement: 'bottom',
      onClick: handleReset,
      container: 'topRight'
    },
    {
      id: 'close',
      icon: <CloseIcon />,
      tooltip: 'Close',
      placement: 'bottom',
      onClick: onClose,
      container: 'topRight'
    },

    {
      id: 'zoomIn',
      icon: <ZoomInIcon />,
      tooltip: 'Zoom In',
      placement: 'left',
      onClick: () => zoom(-5),
      container: 'middleRight'
    },
    {
      id: 'zoomOut',
      icon: <ZoomOutIcon />,
      tooltip: 'Zoom Out',
      placement: 'left',
      onClick: () => zoom(5),
      container: 'middleRight'
    },

    {
      id: 'rotateLeft',
      icon: <ArrowBackIcon />,
      tooltip: 'Rotate Left',
      placement: 'top',
      onClick: () => rotate('y', -0.3),
      container: 'bottomCenter'
    },
    {
      id: 'rotateRight',
      icon: <ArrowForwardIcon />,
      tooltip: 'Rotate Right',
      placement: 'top',
      onClick: () => rotate('y', 0.3),
      container: 'bottomCenter'
    },
    {
      id: 'rotateUp',
      icon: <ArrowUpwardIcon />,
      tooltip: 'Rotate Up',
      placement: 'top',
      onClick: () => rotate('x', -0.3),
      container: 'bottomCenter'
    },
    {
      id: 'rotateDown',
      icon: <ArrowDownwardIcon />,
      tooltip: 'Rotate Down',
      placement: 'top',
      onClick: () => rotate('x', 0.3),
      container: 'bottomCenter'
    }
  ]

  const containerStyles: Record<
    string,
    { style: React.CSSProperties; direction: 'row' | 'column' }
  > = {
    topRight: {
      style: { position: 'absolute', top: 20, right: 20, zIndex: 1020 },
      direction: 'row'
    },
    middleRight: {
      style: {
        position: 'absolute',
        top: '50%',
        right: 20,
        transform: 'translateY(-50%)',
        zIndex: 1020
      },
      direction: 'column'
    },
    bottomCenter: {
      style: {
        position: 'absolute',
        bottom: '10%',
        right: '50%',
        transform: 'translateX(50%)',
        zIndex: 1020
      },
      direction: 'row'
    }
  }

  return (
    <>
      {Object.entries(containerStyles).map(([key, { style, direction }]) => (
        <CustomStack key={key} spacing={1} sx={style} direction={direction}>
          {buttonsConfig
            .filter((btn) => btn.container === key)
            .map((btn) => (
              <CustomIconButton
                key={btn.id}
                tooltip={btn.tooltip}
                placement={btn.placement}
                onClick={btn.onClick}
              >
                {btn.icon}
              </CustomIconButton>
            ))}
        </CustomStack>
      ))}
    </>
  )
}

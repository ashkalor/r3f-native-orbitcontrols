import React, { useEffect, useMemo } from "react"
import {
  ControlsChangeEvent,
  ControlsProps,
  createControls,
  CONTROLMODES,
  ControlMode,
} from "./Controls"
import { useFrame, useThree } from "@react-three/fiber/native"
import { OrthographicCamera, PerspectiveCamera } from "three"

type ControlsInternalProps = ControlsProps & {
  controls: ReturnType<typeof createControls>
}

function Controls({ controls, ...props }: ControlsInternalProps) {
  const camera = useThree((state) => state.camera)

  useEffect(() => {
    if (
      (camera as PerspectiveCamera).isPerspectiveCamera ||
      (camera as OrthographicCamera).isOrthographicCamera
    ) {
      controls.scope.camera = camera as PerspectiveCamera | OrthographicCamera
    } else {
      throw new Error(
        "The camera must be a PerspectiveCamera or OrthographicCamera for controls to work",
      )
    }
  }, [camera, controls.scope])

  useEffect(() => {
    for (const prop in props) {
      ;(controls.scope[prop as keyof typeof controls.scope] as any) =
        props[prop as keyof typeof props]
    }
  }, [props, controls.scope])

  useFrame(controls.functions.update, -1)

  return null
}

export default function useControls(mode: ControlMode = "orbit") {
  const controls = useMemo(() => createControls(mode), [mode])
  return [
    (props: ControlsProps) => <Controls controls={controls} {...props} />,
    controls.events,
  ] as const
}

export { ControlsChangeEvent, ControlsProps, ControlMode, CONTROLMODES }

import React, { useEffect } from "react"
import { useLearningPath } from "../providers/LearningPath"
import { useNotifications } from "../providers/NotificationProvider"
import LearningPathSteps from "../components/LearningPath/Steps"
import LearningPathFinish from "../components/LearningPath/Finish"
import LearningPathIcon from "../components/LearningPath/Icon"

const useCurrentLearningPath = () => {
  const { path, currentStep, updatePath, endPath } = useLearningPath()
  const step = path?.steps[currentStep]
  const {
    addNotification,
    generateId,
    removeNotification,
    updateNotification,
  } = useNotifications()

  // used when a notification closed (finished or not)
  const handleClose = (notificationId: string, shouldEndPath = true) => {
    if (shouldEndPath) {
      setTimeout(() => {
        endPath()
      }, 500)
    }
    removeNotification(notificationId)
  }

  // used when the learning path is completely finished
  // shows the finish step, if the path has any
  const handleFinish = (notificationId: string) => {
    if (path.finish) {
      updateNotification(notificationId, {
        title: path.finish.step.title,
        text: path.finish.step.description,
        type: "custom",
        layout: "default",
        CustomIcon: (
          <LearningPathIcon
            className="!tw-w-2 !tw-h-2"
            imgClassName="!tw-w-1.5 !tw-h-1.5"
          />
        ),
        children: (
          <LearningPathFinish
            {...path.finish}
            onRating={() =>
              setTimeout(() => {
                handleClose(notificationId, false)
              }, 1500)
            }
          />
        ),
      })
      endPath()
    } else {
      handleClose(notificationId)
    }
  }

  const LearningStep = (notificationId: string) => {
    return <LearningPathSteps onFinish={() => handleFinish(notificationId)} />
  }

  // create a notification when a path is initialized
  useEffect(() => {
    if (path && !path.notificationId) {
      const id = generateId()

      addNotification({
        title: path.label,
        text: step?.description,
        onClose: () => handleClose(id),
        layout: "empty",
        id,
        children: LearningStep(id),
      })
      updatePath({
        notificationId: id,
      })
    }
  }, [path])

  // update an existing notification when the step changes
  useEffect(() => {
    if (path && path.notificationId && step) {
      updateNotification(path.notificationId, {
        text: step?.description,
        children: LearningStep(path.notificationId),
      })
    }
  }, [step])
}

export default useCurrentLearningPath

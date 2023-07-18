import {
  animationCloseSelectMobile,
  animationSelectMobile,
  dialogAnimationClose,
  dialogAnimationOpen,
  fadeInBackground,
  fadeOutBackground,
  fullDialogAnimationClose,
  fullDialogAnimationOpen,
} from '@finetwork:ui/src/animations'
import { useControllScroll } from '@finetwork:ui/src/hooks/useWindowSize'
import * as React from 'react'
import { DOMEvent } from '../Select/types'
import {
  CloseButton,
  CloseButtonIcon,
  Overlay,
  StyledDialog,
  StyledDialogTrigger,
} from './styled'
import { DialogProps, DialogTriggerProps } from './types'
import { handleDialogCssProps } from './utils'

export const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerProps
>(({ children, id, setIsOpen, ...props }, ref) => {
  return (
    <StyledDialogTrigger id={id} onClick={() => setIsOpen(true)} {...props}>
      {children}
    </StyledDialogTrigger>
  )
})

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      children,
      id,
      overlay = true,
      width = 'auto',
      borderRadius,
      closeButton = true,
      closeButtonSize = '15px',
      bottomSheet = false,
      isOpen,
      setIsOpen,
      ...props
    },
    ref
  ) => {
    const dialogRef = React.useRef<HTMLDivElement>(null)
    const overlayRef = React.useRef<HTMLDivElement>(null)

    const [customStyle, setCustomStyle] = React.useState({
      dialog: {},
      closeButton: {},
    })

    const { disableScroll, allowScroll, allowScrollInSpecificComponent } =
      useControllScroll()

    function handleOutsideClick(e: DOMEvent<HTMLInputElement>) {
      if (!dialogRef.current?.contains(e.target)) {
        return setIsOpen(false)
      }
    }

    function handleKeyPress(e) {
      if (e.code === 'Escape') {
        setIsOpen(false)
      }
    }

    function handleDialogAnimation() {
      const dialogElement = dialogRef.current
      const overlayElement = overlayRef.current

      dialogElement.addEventListener('animationend', () => {
        if (isOpen) {
          overlayElement.style.display = 'block'
          dialogElement.style.display = 'block'
        } else {
          overlayElement.style.display = 'none'
          dialogElement.style.display = 'none'
        }
      })

      if (isOpen) {
        dialogElement.style.display = 'block'
        overlayElement.style.display = 'block'
      }

      if (!bottomSheet && width !== 'full') {
        dialogElement.style.animation = `${
          isOpen ? dialogAnimationOpen : dialogAnimationClose
        } 0.4s cubic-bezier(0.69,-0.37,0.24,1.48) forwards`
      }

      if (bottomSheet) {
        dialogElement.style.animation = `${
          isOpen
            ? `${animationSelectMobile} cubic-bezier(0.72,-0.67,0.49,0.01)`
            : `${animationCloseSelectMobile} linear`
        } 0.25s forwards`
      }

      if (width === 'full') {
        dialogElement.style.animation = `${
          isOpen ? fullDialogAnimationOpen : fullDialogAnimationClose
        } 0.4s ease forwards`
      }

      if (overlay) {
        overlayElement.style.animation = `${
          isOpen ? fadeInBackground : fadeOutBackground
        } 0.4s forwards`
      }
    }

    React.useEffect(() => {
      handleDialogAnimation()
    }, [isOpen])

    React.useEffect(() => {
      setCustomStyle(handleDialogCssProps(borderRadius, closeButtonSize, width))
    }, [borderRadius, closeButtonSize, width])

    React.useEffect(() => {
      if (isOpen) {
        disableScroll()
        allowScrollInSpecificComponent(dialogRef)
        document.addEventListener('click', handleOutsideClick, true)
        document.addEventListener('keydown', handleKeyPress, true)
      } else {
        allowScroll()
        document.removeEventListener('click', handleOutsideClick, true)
        document.removeEventListener('keydown', handleKeyPress, true)
      }

      return () => {
        // allowScroll()
        // document.removeEventListener('click', handleOutsideClick, true)
        // document.removeEventListener('keydown', handleKeyPress, true)
      }
    }, [isOpen])

    return (
      <>
        <Overlay ref={overlayRef} />
        <StyledDialog
          css={customStyle.dialog}
          ref={dialogRef}
          id={id}
          fullSize={width === 'full'}
          bottomSheet={bottomSheet}
          {...props}
        >
          {closeButton && (
            <CloseButton
              css={customStyle.closeButton}
              onClick={() => setIsOpen(false)}
            >
              <CloseButtonIcon />
            </CloseButton>
          )}
          {children}
        </StyledDialog>
      </>
    )
  }
)

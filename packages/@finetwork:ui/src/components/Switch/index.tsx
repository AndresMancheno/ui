import * as React from 'react'
import { Ring } from '@uiball/loaders'

import {
  StyledEnhancerContainer,
  StyledInput,
  StyledLoadingContainer,
  StyledSlider,
  StyledSwitch,
} from './styled'

import { SwitchComponent } from './types'
import { RenderEnhancer } from '@finetwork:ui/src/utils'

export const Switch = React.forwardRef<HTMLInputElement, SwitchComponent>(
  (
    {
      size = 'medium',
      id,
      isLoading,
      checked,
      loadingColor = '#fff',
      loadingSpeed = 2,
      kind = 'primary',
      type,
      disabled,
      handleChange,
      sliderColor,
      switchBackgroundColor,
      checkedEnhancer,
      uncheckedEnhancer,
      focusOutlineColor,
      ...props
    },
    ref
  ) => {
    const [switchStyles, setSwitchStyles] = React.useState({
      slider: {},
      switch: {},
      input: {},
    })
    const [isFirstChecked, setIsFirstChecked] = React.useState(true)
    const loadingSize = size === 'large' ? 21 : 16

    React.useEffect(() => {
      let css = { slider: {}, switch: {}, input: {} }
      if (sliderColor) {
        css = {
          ...css,
          slider: {
            ...css.slider,
            backgroundColor: sliderColor,
          },
        }
      }

      if (switchBackgroundColor?.checked && switchBackgroundColor?.unchecked) {
        css = {
          ...css,
          switch: {
            ...css.switch,
            backgroundColor: `${switchBackgroundColor.unchecked} !important`,
          },
          input: {
            [`&:checked ~ ${StyledSwitch}`]: {
              backgroundColor: `${switchBackgroundColor.checked} !important`,
            },
          },
        }
      }

      if (focusOutlineColor) {
        css = {
          ...css,
          switch: {
            ...css.switch,
            '&:focus-visible': {
              outline: 'none',
              boxShadow: `0 0 0 2px #fff, 0 0 0 4px ${focusOutlineColor}`,
            },
          },
        }
      }

      setSwitchStyles(css)
    }, [])

    return (
      <div>
        <StyledInput
          checked={
            checked !== null || checked !== undefined ? checked : undefined
          }
          kind={kind}
          switchType={type ? type : undefined}
          type={'checkbox'}
          id={id}
          size={size}
          isFirstChecked={isFirstChecked}
          disabled={disabled}
          onChange={(e) => {
            if (isFirstChecked) setIsFirstChecked(false)
            if (handleChange && !isLoading && !disabled) {
              handleChange(e.target.checked)
            }
          }}
          css={{ ...switchStyles.input }}
          {...props}
        />
        <StyledSwitch
          tabIndex={disabled ? -1 : 0}
          htmlFor={id}
          size={size}
          kind={kind}
          type={type ? type : undefined}
          disabled={disabled}
          css={{ ...switchStyles.switch }}
          onKeyUp={(e) => {
            if (e.key !== 'Enter') return
            if (isFirstChecked) setIsFirstChecked(false)
            if (handleChange && !isLoading && !disabled) {
              console.log(!checked)
              handleChange(!checked)
            }
          }}
        >
          {isLoading ? (
            <StyledLoadingContainer>
              <Ring
                size={loadingSize}
                lineWeight={5}
                speed={loadingSpeed}
                color={loadingColor}
              />
            </StyledLoadingContainer>
          ) : (
            <StyledSlider
              size={size}
              css={{ ...switchStyles.slider }}
              disabled={disabled}
            >
              {checkedEnhancer && checked && (
                <StyledEnhancerContainer>
                  <RenderEnhancer Enhancer={checkedEnhancer} />
                </StyledEnhancerContainer>
              )}

              {uncheckedEnhancer && !checked && (
                <StyledEnhancerContainer>
                  <RenderEnhancer Enhancer={uncheckedEnhancer} />
                </StyledEnhancerContainer>
              )}
            </StyledSlider>
          )}
        </StyledSwitch>
      </div>
    )
  }
)

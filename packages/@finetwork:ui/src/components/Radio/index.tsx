import * as React from 'react'

import {
  ContainerRadioLabel,
  StyledLabel,
  StyledRadio,
  StyledRadioGroup,
  StyledRadioIndicator,
} from '../../styled-components/radio'

import { KIND } from '../../types'
import { RadioComponent } from '../../types/components/radio'

export const RadioGroup = StyledRadioGroup
export const Radio: RadioComponent = React.forwardRef(
  (
    { kind = KIND.primary, label, disabled, indicatorProps = {}, ...props },
    ref
  ) => {
    const Radio = () => (
      <StyledRadio
        {...props}
        ref={ref}
        isDisabled={disabled}
        disabled={disabled}
        kind={kind}
      >
        <StyledRadioIndicator kind={kind} {...indicatorProps} />
      </StyledRadio>
    )
    return label ? (
      <ContainerRadioLabel disabled={disabled}>
        <Radio />
        <StyledLabel htmlFor={props.id}>{label}</StyledLabel>
      </ContainerRadioLabel>
    ) : (
      <Radio />
    )
  }
)

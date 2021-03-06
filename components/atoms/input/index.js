import PropTypes from 'prop-types';
import React from 'react';
import Style from './input.style';

const Input = React.forwardRef((props, ref) => {
  function blur() {
    props.onBlur();
  }

  function change(e) {
    props.onChange(e.target.value);
  }

  function focus() {
    props.onFocus();
  }

  function type() {
    if (['number', 'password', 'hidden'].includes(props.type)) {
      return props.type;
    } else {
      return 'text';
    }
  }

  const classes = [
    'input',
    `input-name-${props.name}`,
    `size-${props.size}`,
    props.error && 'error',
    props.type === 'currency' && 'currency',
  ]
    .filter(Boolean)
    .join(' ');

  const inputProps = {
    disabled: props.disabled,
    hidden: props.type === 'hidden',
    id: props.name,
    maxLength: props.maxLength,
    name: props.name,
    onBlur: blur,
    onChange: change,
    onFocus: focus,
    placeholder: props.placeholder,
    type: type(),
    value: props.value ?? '',
  };

  return <Style className={classes} {...inputProps} ref={ref} />;
});

Input.componentDescription = 'Form input element. Used for all form inputs.';
Input.componentKey = 'Form field input';
Input.componentName = 'Form field input';
Input.displayName = 'Input';

Input.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.any,
  maxLength: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  size: PropTypes.string,
  /** "text", "number", "currency", "password", or "hidden" */
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Input.defaultProps = {
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
  size: 'md',
};

export default Input;

import React from 'react';
import { FormStateContext, FormApiContext, FormRegisterContext } from '../Context';
import Debug from '../debug';
import useForm from '../hooks/useForm';
import isReactNative from '../utils/isReactNative';

const debug = Debug('informed:Form' + '\t\t');

const Form = ({ 
  children, 
  getApi, 
  onChange, 
  onSubmit, 
  onValueChange, 
  initialValues,
  onSubmitFailure,
  render,
  validate,
  validateFields,
  component,
  preventEnter,
  dontPreventDefault,
  allowEmptyStrings,
  ...rest }) => {

  debug('Render FORM');

  const { 
    formApi, 
    formController,
    formState 
  } = useForm({
    dontPreventDefault,
    initialValues,
    validate,
    validateFields,
    allowEmptyStrings,
    preventEnter,
    getApi,
    onChange,
    onSubmit,
    onValueChange, 
    onSubmitFailure
  });
    
  const getContent = () => {

    const props = {
      formState,
      formApi
    };

    if (component) {
      return React.createElement(component, props, children);
    }
    if (render) {
      return render(props);
    }
    if (typeof children === 'function') {
      return children(props);
    }
    return children;
  };

  const getWrappedContent = () => {
    const content = getContent();

    if (isReactNative && React.Children.count(content) > 1) {
      return (
        <React.Fragment>
          {content}
        </React.Fragment>
      );
    }

    if (isReactNative) {
      return content;
    }

    return (
      <form
        {...rest}
        onReset={formController.reset}
        onSubmit={formController.submitForm}
        onKeyDown={formController.keyDown}>
        {getContent()}
      </form>
    );
  };

  /* --- Create Provider and render Content --- */
  return (
    <FormRegisterContext.Provider value={formController.updater}>
      <FormApiContext.Provider value={formApi}>
        <FormStateContext.Provider value={formState}>
          {getWrappedContent()}
        </FormStateContext.Provider>
      </FormApiContext.Provider>
    </FormRegisterContext.Provider>
  );
  
};

export default Form;

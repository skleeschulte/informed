import React from 'react';
import { FormStateContext, FormApiContext, FormRegisterContext } from '../Context';
import Debug from '../debug';
import useForm from '../hooks/useForm';
import isReactNative from '../utils/isReactNative';

const debug = Debug('informed:FormProvider' + '\t\t');

const FormProvider = ({ 
  children, 
  getApi, 
  onChange, 
  onSubmit, 
  onValueChange, 
  initialValues,
  onSubmitFailure,
  validate,
  validateFields,
  preventEnter,
  dontPreventDefault,
  allowEmptyStrings,
  ...rest }) => {

  debug('Render FormProvider');

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

  const getWrappedChildren = () => {
    if (isReactNative && React.Children.count(children) > 1) {
      return (
        <React.Fragment>
          {children}
        </React.Fragment>
      );
    }

    if (isReactNative) {
      return children;
    }

    return (
      <form
        {...rest}
        onReset={formController.reset}
        onSubmit={formController.submitForm}
        onKeyDown={formController.keyDown}>
        {children}
      </form>
    );
  };

  /* --- Create Provider and render Content --- */
  return (
    <FormRegisterContext.Provider value={formController.updater}>
      <FormApiContext.Provider value={formApi}>
        <FormStateContext.Provider value={formState}>
          {getWrappedChildren()}
        </FormStateContext.Provider>
      </FormApiContext.Provider>
    </FormRegisterContext.Provider>
  );
  
};

export default FormProvider;

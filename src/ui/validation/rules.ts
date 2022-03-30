interface ValidationRule<T extends string | string[][]> {
  message: T;
  isValid: boolean;
}

type Validator<T extends string | string[][]> = (value: T, isDirty: boolean) => ValidationRule<T>;

export const notEmpty: Validator<string> = (value, isDirty) => {
  const isValid = value.length > 0;
  return {
    message: isDirty || isValid ? '' : 'Missing value',
    isValid,
  };
};

export const notEmptyDeep: Validator<string[][]> = (value, isDirty) => {
  const checkFn = (item: string): boolean => item.length > 0;
  const getMessage = (item: string): string => isDirty || checkFn(item) ? '' : 'Missing value';
  return {
    message: value.map(item => item.map(getMessage)),
    isValid: value.every(item => item.every(checkFn)),
  };
};

export const validation = <T extends string | string[][]> (value: T, isDirty: boolean, validator: Validator<T>): ValidationRule<T> => {
  return validator(value, isDirty);
};

'use client';
import { Input, InputProps } from 'antd';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { styled } from 'styled-components';

interface FormInputItemProps<T extends FieldValues> extends Omit<InputProps, 'name'> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  error?: string;
}

const StyledFormItem = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  height: 64px;
`;

const Label = styled.label`
  color: #2A2A2A;
  font-family: 'IBM Plex Sans Thai', sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.021px;
`;

const StyledInput = styled(Input)`
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #D9D9D9;
  background: #FFF;
  font-family: 'IBM Plex Sans Thai', sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.016px;

  &::placeholder {
    color: #B9B9B9;
  }

  &:hover {
    border-color: #265ED6;
  }

  &:focus {
    border-color: #265ED6;
    box-shadow: none;
  }

  &:disabled {
    background: #F8F8F8;
    color: #2A2A2A;
    border-color: #D9D9D9;
    cursor: not-allowed;

    &:hover {
      border-color: #D9D9D9;
    }
  }

  &.ant-input-status-error {
    border-color: #ff4d4f;
  }
`;

const ErrorMessage = styled.span`
  align-self: stretch;
  color: #F04438;
  font-family: 'IBM Plex Sans Thai', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.048px;
  position: relative;

  @media (max-width: 768px) {
    font-size: 11px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const FormInputItem = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  error,
  ...inputProps
}: FormInputItemProps<T>) => {
  return (
    <StyledFormItem>
      {label && <Label>{label}{required && <span style={{ color: '#ff4d4f' }}> *</span>}</Label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <StyledInput
            {...field}
            {...inputProps}
            status={error ? 'error' : undefined}
          />
        )}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </StyledFormItem>
  );
};

export default FormInputItem; 
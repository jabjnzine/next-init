'use client';

import { Select, SelectProps } from 'antd';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { styled } from 'styled-components';

interface FormSelectItemProps<T extends FieldValues> extends Omit<SelectProps, 'name'> {
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

const ArrowIcon = () => (
  <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
    <path d="M7 8C6.83259 8 6.67061 7.96946 6.51408 7.9084C6.35671 7.84733 6.22571 7.7659 6.12108 7.66412L0.345291 2.0458C0.115097 1.82188 0 1.53689 0 1.19084C0 0.844783 0.115097 0.559796 0.345291 0.335877C0.575485 0.111959 0.86846 0 1.22422 0C1.57997 0 1.87294 0.111959 2.10314 0.335877L7 5.09924L11.8969 0.335877C12.1271 0.111959 12.42 0 12.7758 0C13.1315 0 13.4245 0.111959 13.6547 0.335877C13.8849 0.559796 14 0.844783 14 1.19084C14 1.53689 13.8849 1.82188 13.6547 2.0458L7.87892 7.66412C7.75336 7.78626 7.61734 7.87257 7.47085 7.92305C7.32436 7.97435 7.16741 8 7 8Z" fill="#2A2A2A"/>
  </svg>
);

const StyledSelect = styled(Select)`
  width: 100%;
  .ant-select-selector {
    padding: 8px 12px !important;
    border-radius: 8px !important;
    border: 1px solid #D9D9D9 !important;
    background: #FFF !important;
    font-family: 'IBM Plex Sans Thai', sans-serif !important;
    font-size: 16px !important;
    font-style: normal !important;
    font-weight: 400 !important;
    line-height: 24px !important;
    letter-spacing: 0.016px !important;
    height: 40px !important;
    display: flex !important;
    align-items: center !important;
  }
  .ant-select-arrow {
    display: flex !important;
    align-items: center !important;
    right: 12px !important;
    color: #2A2A2A !important;
    font-size: 24px !important;
    width: 24px !important;
    height: 24px !important;
  }

  .ant-select-selection-placeholder {
    color: #B9B9B9 !important;
  }

  &:hover .ant-select-selector {
    border-color: #265ED6 !important;
  }

  &.ant-select-focused .ant-select-selector {
    border-color: #265ED6 !important;
    box-shadow: none !important;
  }

  &.ant-select-disabled .ant-select-selector {
    background: #F8F8F8 !important;
    color: #2A2A2A !important;
    border-color: #D9D9D9 !important;
    cursor: not-allowed !important;
  }

  &.ant-select-status-error .ant-select-selector {
    border-color: #ff4d4f !important;
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

const FormSelectItem = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  error,
  ...selectProps
}: FormSelectItemProps<T>) => {
  return (
    <StyledFormItem>
      {label && <Label>{label}{required && <span style={{ color: '#ff4d4f' }}> *</span>}</Label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <StyledSelect
            {...field}
            {...selectProps}
            status={error ? 'error' : undefined}
            suffixIcon={<ArrowIcon />}
          />
        )}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </StyledFormItem>
  );
};

export default FormSelectItem; 
import React from 'react';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';

const FormField = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  options, // For select type
  className = '',
  textarea = false, // For textarea
  children // For custom input elements if needed, or for default for Select/Input
}) => {
  return (
    <div className={className}>
      <Label htmlFor={id}>
        {label} {required && '*'}
      </Label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-20 resize-none"
        />
      ) : type === 'select' ? (
        <Select id={id} value={value} onChange={onChange} required={required}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
};

export default FormField;
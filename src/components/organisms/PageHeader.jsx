import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import PropTypes from 'prop-types';

const PageHeader = ({ title, subtitle, actions = [] }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center space-x-3">
        {actions.map((action, index) => (
          <Button key={index} onClick={action.onClick} variant={action.variant || 'text'} className={action.className || 'px-4 py-2'}>
            {action.iconName && <ApperIcon name={action.iconName} size={20} className="mr-2" />}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      iconName: PropTypes.string,
      variant: PropTypes.string,
      className: PropTypes.string,
    })
  ),
};

export default PageHeader;
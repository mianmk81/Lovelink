import React from 'react';
import PropTypes from 'prop-types';

const RetroGrid = ({
  children,
  columns = 2,
  gap = 'medium',
  responsive = true,
  equalHeight = false,
  centerItems = false,
  className = '',
  ...props
}) => {
  // Map gap sizes to Tailwind classes
  const gapMap = {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
    xlarge: 'gap-8'
  };

  // Map column counts to Tailwind grid classes
  const columnMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  };

  // If responsive is false, override the column mapping
  const columnClass = responsive 
    ? columnMap[columns] || columnMap[2] 
    : `grid-cols-${columns}`;

  const gapClass = gapMap[gap] || gapMap.medium;
  const heightClass = equalHeight ? 'h-full' : '';
  const centerClass = centerItems ? 'place-items-center' : '';

  return (
    <div 
      className={`grid ${columnClass} ${gapClass} ${centerClass} ${className}`}
      {...props}
    >
      {React.Children.map(children, (child) => 
        child ? (
          <div className={heightClass}>
            {child}
          </div>
        ) : null
      )}
    </div>
  );
};

RetroGrid.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  gap: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  responsive: PropTypes.bool,
  equalHeight: PropTypes.bool,
  centerItems: PropTypes.bool,
  className: PropTypes.string
};

export default RetroGrid;

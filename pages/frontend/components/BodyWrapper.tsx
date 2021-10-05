import React from 'react';

const BodyWrapper = ({children}) => {
  return (
      <div className="relative ">
        <main className="w-full">{children}</main>
      </div>
  );
};

export default BodyWrapper;

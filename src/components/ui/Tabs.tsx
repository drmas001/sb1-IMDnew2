import React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className = '' }) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = '' }) => {
  return (
    <button
      onClick={() => {
        const tabs = document.querySelector('[role="tablist"]');
        if (tabs) {
          const parent = tabs.parentElement;
          if (parent && 'onValueChange' in parent) {
            (parent as any).onValueChange(value);
          }
        }
      }}
      className={`${className} ${
        document.querySelector(`[data-state="active"][value="${value}"]`)
          ? 'bg-indigo-600 text-white'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      } rounded-md transition-colors`}
      role="tab"
      data-state={value === document.querySelector('[role="tabpanel"][data-state="active"]')?.getAttribute('value') ? 'active' : 'inactive'}
      value={value}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '' }) => {
  const isActive = value === document.querySelector('[role="tab"][data-state="active"]')?.getAttribute('value');
  
  return (
    <div
      role="tabpanel"
      data-state={isActive ? 'active' : 'inactive'}
      value={value}
      className={`${className} ${isActive ? 'block' : 'hidden'}`}
    >
      {children}
    </div>
  );
};
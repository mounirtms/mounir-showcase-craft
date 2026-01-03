#!/usr/bin/env node

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get component name from command line arguments
const componentName = process.argv[2];
const componentPath = process.argv[3] || 'components';

if (!componentName) {
  console.error('❌ Please provide a component name');
  console.log('Usage: npm run generate:component <ComponentName> [path]');
  console.log('Example: npm run generate:component Button');
  console.log('Example: npm run generate:component AdminCard admin');
  process.exit(1);
}

// Validate component name (PascalCase)
if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
  console.error('❌ Component name must be in PascalCase (e.g., MyComponent)');
  process.exit(1);
}

// Create directory path
const srcPath = join(process.cwd(), 'src', componentPath, componentName);

// Check if component already exists
if (existsSync(srcPath)) {
  console.error(`❌ Component ${componentName} already exists at ${componentPath}`);
  process.exit(1);
}

// Create directory
mkdirSync(srcPath, { recursive: true });

// Component template
const componentTemplate = `import React from 'react';
import { cn } from '@/lib/utils';

interface ${componentName}Props {
  children?: React.ReactNode;
  className?: string;
}

export const ${componentName}: React.FC<${componentName}Props> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
};

export default ${componentName};
`;

// Index file template
const indexTemplate = `export { ${componentName}, default } from './${componentName}';
export type { ${componentName}Props } from './${componentName}';
`;

// Stories template (for Storybook if needed)
const storiesTemplate = `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '${componentName} content',
  },
};

export const WithCustomClass: Story = {
  args: {
    children: '${componentName} with custom styling',
    className: 'border-2 border-blue-500 p-4 rounded-lg',
  },
};
`;

// Test template
const testTemplate = `import { render, screen } from '@testing-library/react';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('renders children correctly', () => {
    render(<${componentName}>Test content</${componentName}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <${componentName} className="custom-class">Test</${componentName}>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards additional props', () => {
    render(
      <${componentName} data-testid="test-component">Test</${componentName}>
    );
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });
});
`;

try {
  // Write component file
  writeFileSync(join(srcPath, `${componentName}.tsx`), componentTemplate);
  
  // Write index file
  writeFileSync(join(srcPath, 'index.ts'), indexTemplate);
  
  // Write stories file
  writeFileSync(join(srcPath, `${componentName}.stories.tsx`), storiesTemplate);
  
  // Write test file
  writeFileSync(join(srcPath, `${componentName}.test.tsx`), testTemplate);

  console.log('✅ Component generated successfully!');
  console.log(`📁 Location: src/${componentPath}/${componentName}/`);
  console.log('📄 Files created:');
  console.log(`   - ${componentName}.tsx (main component)`);
  console.log(`   - index.ts (exports)`);
  console.log(`   - ${componentName}.stories.tsx (Storybook stories)`);
  console.log(`   - ${componentName}.test.tsx (tests)`);
  console.log('');
  console.log('💡 Next steps:');
  console.log(`   1. Implement your component logic in ${componentName}.tsx`);
  console.log(`   2. Add the component to your main exports if needed`);
  console.log(`   3. Run tests: npm run test`);
  console.log(`   4. View in Storybook (if configured)`);

} catch (error) {
  console.error('❌ Error generating component:', error.message);
  process.exit(1);
}
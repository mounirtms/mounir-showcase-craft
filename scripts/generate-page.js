#!/usr/bin/env node

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get page name from command line arguments
const pageName = process.argv[2];
const isAdminPage = process.argv.includes('--admin');

if (!pageName) {
  console.error('❌ Please provide a page name');
  console.log('Usage: npm run generate:page <PageName> [--admin]');
  console.log('Example: npm run generate:page Dashboard');
  console.log('Example: npm run generate:page UserManagement --admin');
  process.exit(1);
}

// Validate page name (PascalCase)
if (!/^[A-Z][a-zA-Z0-9]*$/.test(pageName)) {
  console.error('❌ Page name must be in PascalCase (e.g., MyPage)');
  process.exit(1);
}

// Create directory path
const pagesPath = isAdminPage ? 'pages/admin' : 'pages';
const srcPath = join(process.cwd(), 'src', pagesPath);
const filePath = join(srcPath, `${pageName}.tsx`);

// Check if page already exists
if (existsSync(filePath)) {
  console.error(`❌ Page ${pageName} already exists at ${pagesPath}`);
  process.exit(1);
}

// Create directory if it doesn't exist
mkdirSync(srcPath, { recursive: true });

// Page template
const pageTemplate = `import React from 'react';
import { Helmet } from 'react-helmet-async';${isAdminPage ? `
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';` : ''}

interface ${pageName}Props {
  // Add props here if needed
}

export const ${pageName}: React.FC<${pageName}Props> = () => {
  ${isAdminPage ? `const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: '${pageName}', href: '/admin/${pageName.toLowerCase()}' },
  ];` : ''}

  return (
    <>
      <Helmet>
        <title>${pageName} | ${isAdminPage ? 'Admin Dashboard' : 'Portfolio'}</title>
        <meta name="description" content="${pageName} page description" />
      </Helmet>
      
      ${isAdminPage ? `<AdminLayout>
        <AdminBreadcrumb items={breadcrumbItems} />
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">${pageName}</h1>
              <p className="text-muted-foreground">
                Manage and configure ${pageName.toLowerCase()} settings
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Add your page content here */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">${pageName} Content</h2>
              <p className="text-muted-foreground">
                This is the ${pageName} page. Add your content here.
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>` : `<div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                ${pageName}
              </h1>
              <p className="text-xl text-muted-foreground">
                Welcome to the ${pageName} page
              </p>
            </div>

            <div className="grid gap-6">
              {/* Add your page content here */}
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-2xl font-semibold mb-4">${pageName} Content</h2>
                <p className="text-muted-foreground">
                  This is the ${pageName} page. Add your content here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>`}
    </>
  );
};

export default ${pageName};
`;

// Test template
const testTemplate = `import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ${pageName} } from './${pageName}';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </HelmetProvider>
  );
};

describe('${pageName}', () => {
  it('renders page title', () => {
    renderWithProviders(<${pageName} />);
    expect(screen.getByRole('heading', { name: /${pageName}/i })).toBeInTheDocument();
  });

  it('sets correct document title', () => {
    renderWithProviders(<${pageName} />);
    expect(document.title).toContain('${pageName}');
  });

  ${isAdminPage ? `it('renders admin layout', () => {
    renderWithProviders(<${pageName} />);
    // Add specific admin layout tests here
    expect(screen.getByText('Manage and configure ${pageName.toLowerCase()} settings')).toBeInTheDocument();
  });` : `it('renders page content', () => {
    renderWithProviders(<${pageName} />);
    expect(screen.getByText('Welcome to the ${pageName} page')).toBeInTheDocument();
  });`}
});
`;

try {
  // Write page file
  writeFileSync(filePath, pageTemplate);
  
  // Write test file
  writeFileSync(join(srcPath, `${pageName}.test.tsx`), testTemplate);

  console.log('✅ Page generated successfully!');
  console.log(`📁 Location: src/${pagesPath}/${pageName}.tsx`);
  console.log('📄 Files created:');
  console.log(`   - ${pageName}.tsx (main page component)`);
  console.log(`   - ${pageName}.test.tsx (tests)`);
  console.log('');
  console.log('💡 Next steps:');
  console.log(`   1. Implement your page logic in ${pageName}.tsx`);
  console.log(`   2. Add the page to your router configuration`);
  console.log(`   3. Run tests: npm run test`);
  if (isAdminPage) {
    console.log(`   4. Add navigation link in AdminSidebar if needed`);
  }

} catch (error) {
  console.error('❌ Error generating page:', error.message);
  process.exit(1);
}
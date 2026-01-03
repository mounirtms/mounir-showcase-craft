#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function runCommand(command, description) {
  log(`\n${description}`, 'cyan')
  log(`Running: ${command}`, 'blue')
  
  try {
    execSync(command, { stdio: 'inherit' })
    log(`✅ ${description} completed successfully`, 'green')
    return true
  } catch (error) {
    log(`❌ ${description} failed`, 'red')
    log(`Error: ${error.message}`, 'red')
    return false
  }
}

function checkTestFiles() {
  const testDirs = [
    'src/components/admin/auth/__tests__',
    'src/components/admin/dashboard/__tests__',
    'src/components/admin/layout/__tests__',
    'src/components/admin/projects/__tests__',
    'src/components/admin/skills/__tests__',
    'src/test/integration',
    'src/test/e2e',
    'src/test/visual',
  ]

  log('\n📁 Checking test file structure...', 'yellow')
  
  let totalTests = 0
  testDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir)
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath).filter(file => 
        file.endsWith('.test.ts') || 
        file.endsWith('.test.tsx') || 
        file.endsWith('.spec.ts') || 
        file.endsWith('.spec.tsx')
      )
      log(`  ${dir}: ${files.length} test files`, 'blue')
      totalTests += files.length
    } else {
      log(`  ${dir}: Directory not found`, 'red')
    }
  })
  
  log(`\nTotal test files found: ${totalTests}`, 'bright')
  return totalTests > 0
}

function generateTestReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    results,
    summary: {
      total: results.length,
      passed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
    }
  }

  const reportPath = path.join(process.cwd(), 'test-results', 'test-report.json')
  
  // Ensure directory exists
  const reportDir = path.dirname(reportPath)
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true })
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  log(`\n📊 Test report saved to: ${reportPath}`, 'cyan')
  
  return report
}

function main() {
  const args = process.argv.slice(2)
  const testType = args[0] || 'all'

  log('🧪 Admin Dashboard Test Runner', 'bright')
  log('================================', 'bright')

  // Check if test files exist
  if (!checkTestFiles()) {
    log('\n⚠️  No test files found. Please ensure tests are created first.', 'yellow')
    process.exit(1)
  }

  const results = []

  switch (testType) {
    case 'unit':
      log('\n🔬 Running Unit Tests Only', 'magenta')
      results.push({
        type: 'unit',
        success: runCommand('npm run test:unit', 'Unit Tests')
      })
      break

    case 'integration':
      log('\n🔗 Running Integration Tests Only', 'magenta')
      results.push({
        type: 'integration',
        success: runCommand('npm run test:integration', 'Integration Tests')
      })
      break

    case 'e2e':
      log('\n🌐 Running E2E Tests Only', 'magenta')
      results.push({
        type: 'e2e',
        success: runCommand('npm run test:e2e', 'End-to-End Tests')
      })
      break

    case 'visual':
      log('\n👁️  Running Visual Regression Tests Only', 'magenta')
      results.push({
        type: 'visual',
        success: runCommand('npm run test:visual', 'Visual Regression Tests')
      })
      break

    case 'coverage':
      log('\n📊 Running Tests with Coverage', 'magenta')
      results.push({
        type: 'coverage',
        success: runCommand('npm run test:coverage', 'Coverage Tests')
      })
      break

    case 'all':
    default:
      log('\n🚀 Running All Tests', 'magenta')
      
      // Run unit tests
      results.push({
        type: 'unit',
        success: runCommand('npm run test:unit', 'Unit Tests')
      })

      // Run integration tests
      results.push({
        type: 'integration',
        success: runCommand('npm run test:integration', 'Integration Tests')
      })

      // Run E2E tests (only if unit and integration pass)
      if (results.every(r => r.success)) {
        results.push({
          type: 'e2e',
          success: runCommand('npm run test:e2e', 'End-to-End Tests')
        })
      } else {
        log('\n⚠️  Skipping E2E tests due to previous failures', 'yellow')
      }

      // Run visual tests (only if all others pass)
      if (results.every(r => r.success)) {
        results.push({
          type: 'visual',
          success: runCommand('npm run test:visual', 'Visual Regression Tests')
        })
      } else {
        log('\n⚠️  Skipping Visual tests due to previous failures', 'yellow')
      }
      break
  }

  // Generate test report
  const report = generateTestReport(results)

  // Print summary
  log('\n📋 Test Summary', 'bright')
  log('===============', 'bright')
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌'
    const color = result.success ? 'green' : 'red'
    log(`${status} ${result.type.toUpperCase()} Tests`, color)
  })

  log(`\nTotal: ${report.summary.total}`, 'bright')
  log(`Passed: ${report.summary.passed}`, 'green')
  log(`Failed: ${report.summary.failed}`, report.summary.failed > 0 ? 'red' : 'green')

  // Exit with appropriate code
  const allPassed = results.every(r => r.success)
  if (allPassed) {
    log('\n🎉 All tests passed!', 'green')
    process.exit(0)
  } else {
    log('\n💥 Some tests failed!', 'red')
    process.exit(1)
  }
}

// Handle command line arguments
if (require.main === module) {
  main()
}

module.exports = { runCommand, checkTestFiles, generateTestReport }
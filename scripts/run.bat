@echo off
REM Development scripts runner for Windows

if "%1"=="" (
    echo Usage: scripts\run.bat ^<script^> [args...]
    echo.
    echo Available scripts:
    echo   generate-component ^<name^> [path]  - Generate a new component
    echo   generate-page ^<name^> [--admin]   - Generate a new page
    echo   generate-hook ^<name^> [type]      - Generate a new hook
    echo   setup-dev                         - Setup development environment
    echo   dev-utils ^<command^>              - Run development utilities
    echo.
    echo Examples:
    echo   scripts\run.bat generate-component Button
    echo   scripts\run.bat generate-page Dashboard --admin
    echo   scripts\run.bat generate-hook useCounter custom
    echo   scripts\run.bat setup-dev
    echo   scripts\run.bat dev-utils info
    goto :eof
)

set SCRIPT_NAME=%1
shift

REM Build the arguments string
set ARGS=
:loop
if "%1"=="" goto :run
set ARGS=%ARGS% %1
shift
goto :loop

:run
node scripts\%SCRIPT_NAME%.js%ARGS%
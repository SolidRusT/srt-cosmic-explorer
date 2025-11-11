#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Build and push Cosmic Explorer Docker image to Docker Hub

.DESCRIPTION
    Builds the Cosmic Explorer Flask application Docker image and optionally pushes to Docker Hub

.PARAMETER DockerHubUsername
    Docker Hub username (default: suparious)

.PARAMETER ImageName
    Docker image name (default: cosmic-explorer)

.PARAMETER Tag
    Docker image tag (default: latest)

.PARAMETER Push
    Push image to Docker Hub after building

.PARAMETER Login
    Login to Docker Hub before building/pushing

.EXAMPLE
    .\build-and-push.ps1
    Build image locally

.EXAMPLE
    .\build-and-push.ps1 -Login -Push
    Build and push to Docker Hub
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$DockerHubUsername = "suparious",

    [Parameter(Mandatory = $false)]
    [string]$ImageName = "cosmic-explorer",

    [Parameter(Mandatory = $false)]
    [string]$Tag = "latest",

    [Parameter(Mandatory = $false)]
    [switch]$Push,

    [Parameter(Mandatory = $false)]
    [switch]$Login
)

$ErrorActionPreference = 'Stop'

#region Configuration

# Color formatting
$colors = @{
    Header = 'Cyan'
    Success = 'Green'
    Warning = 'Yellow'
    Error = 'Red'
    Info = 'White'
}

# Build configuration
$imageFull = "$DockerHubUsername/${ImageName}:$Tag"

# Cross-platform paths
$scriptPath = if ($IsWindows -or $PSVersionTable.PSVersion.Major -le 5) {
    $PSScriptRoot
} else {
    $PSScriptRoot
}

#endregion

#region Functions

function Write-ColorOutput {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Message,
        [Parameter(Mandatory = $false)]
        [string]$Color = 'White'
    )
    Write-Host $Message -ForegroundColor $Color
}

function Test-DockerHub {
    Write-ColorOutput "Checking Docker Hub authentication..." $colors.Info
    try {
        $result = docker info 2>&1 | Select-String "Username"
        if ($result) {
            Write-ColorOutput "✓ Docker Hub authenticated" $colors.Success
            return $true
        }
        else {
            Write-ColorOutput "✗ Not authenticated to Docker Hub" $colors.Warning
            return $false
        }
    }
    catch {
        Write-ColorOutput "✗ Docker not running or not installed" $colors.Error
        return $false
    }
}

#endregion

#region Main Script

Write-ColorOutput "`n========================================" $colors.Header
Write-ColorOutput "Cosmic Explorer - Docker Build Script" $colors.Header
Write-ColorOutput "========================================`n" $colors.Header

# Login if requested
if ($Login) {
    Write-ColorOutput "Logging into Docker Hub..." $colors.Info
    docker login
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "✗ Docker Hub login failed" $colors.Error
        exit 1
    }
    Write-ColorOutput "✓ Logged into Docker Hub`n" $colors.Success
}

# Check authentication if push is requested
if ($Push) {
    if (-not (Test-DockerHub)) {
        Write-ColorOutput "`n⚠️  Not authenticated to Docker Hub. Use -Login flag to authenticate." $colors.Warning
        Write-ColorOutput "   Example: .\build-and-push.ps1 -Login -Push`n" $colors.Info
        exit 1
    }
}

# Build image
Write-ColorOutput "Building Docker image..." $colors.Info
Write-ColorOutput "Image: $imageFull" $colors.Info
Write-ColorOutput "Context: $scriptPath`n" $colors.Info

docker build -t $imageFull $scriptPath

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "`n✗ Docker build failed" $colors.Error
    exit 1
}

Write-ColorOutput "`n✓ Docker image built successfully`n" $colors.Success

# Test image
Write-ColorOutput "Testing image..." $colors.Info
$testContainer = docker run --rm -d -p 5555:5000 $imageFull

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "✗ Failed to start test container" $colors.Error
    exit 1
}

Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5555/api/health" -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-ColorOutput "✓ Health check passed`n" $colors.Success
    }
    else {
        Write-ColorOutput "⚠️  Health check returned status code: $($response.StatusCode)`n" $colors.Warning
    }
}
catch {
    Write-ColorOutput "⚠️  Health check failed (this may be normal if endpoint doesn't exist yet)`n" $colors.Warning
}
finally {
    docker stop $testContainer | Out-Null
}

# Push if requested
if ($Push) {
    Write-ColorOutput "Pushing to Docker Hub..." $colors.Info
    docker push $imageFull

    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "`n✗ Docker push failed" $colors.Error
        exit 1
    }

    Write-ColorOutput "`n✓ Image pushed to Docker Hub`n" $colors.Success
}

# Summary
Write-ColorOutput "========================================" $colors.Header
Write-ColorOutput "Build Summary" $colors.Header
Write-ColorOutput "========================================" $colors.Header
Write-ColorOutput "Image: $imageFull" $colors.Info
Write-ColorOutput "Status: Built $(if ($Push) { "and pushed" } else { "locally" })" $colors.Success
Write-ColorOutput "`nNext steps:" $colors.Info
if (-not $Push) {
    Write-ColorOutput "  1. Test locally: docker run -p 5000:5000 $imageFull" $colors.Info
    Write-ColorOutput "  2. Push to hub: .\build-and-push.ps1 -Login -Push" $colors.Info
}
else {
    Write-ColorOutput "  1. Deploy: .\deploy.ps1" $colors.Info
    Write-ColorOutput "  2. Or build + deploy: .\deploy.ps1 -Build -Push" $colors.Info
}
Write-ColorOutput "========================================`n" $colors.Header

#endregion

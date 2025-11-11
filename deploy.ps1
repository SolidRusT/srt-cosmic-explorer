#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Deploy Cosmic Explorer to Kubernetes

.DESCRIPTION
    Deploys the Cosmic Explorer space exploration game to SRT-HQ Kubernetes cluster

.PARAMETER Build
    Build Docker image before deploying

.PARAMETER Push
    Push Docker image to Docker Hub (requires authentication)

.PARAMETER Uninstall
    Remove deployment from cluster

.EXAMPLE
    .\deploy.ps1
    Deploy using existing Docker Hub image

.EXAMPLE
    .\deploy.ps1 -Build -Push
    Build, push, and deploy

.EXAMPLE
    .\deploy.ps1 -Uninstall
    Remove from cluster
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [switch]$Build,

    [Parameter(Mandatory = $false)]
    [switch]$Push,

    [Parameter(Mandatory = $false)]
    [switch]$Uninstall
)

$ErrorActionPreference = 'Stop'

#region Configuration

$APP_NAME = "cosmic-explorer"
$NAMESPACE = "cosmic-explorer"
$IMAGE = "suparious/cosmic-explorer:latest"
$K8S_DIR = "k8s"

# Color formatting
$colors = @{
    Header = 'Cyan'
    Success = 'Green'
    Warning = 'Yellow'
    Error = 'Red'
    Info = 'White'
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

function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-ColorOutput "===========================================" $colors.Header
    Write-ColorOutput " $Message" $colors.Header
    Write-ColorOutput "===========================================" $colors.Header
    Write-Host ""
}

#endregion

#region Main Script

# Handle uninstall
if ($Uninstall) {
    Write-Header "Uninstalling $APP_NAME from Kubernetes"

    Write-ColorOutput "Deleting Kubernetes resources..." $colors.Info
    kubectl delete -f "$K8S_DIR/04-ingress.yaml" --ignore-not-found
    kubectl delete -f "$K8S_DIR/03-service.yaml" --ignore-not-found
    kubectl delete -f "$K8S_DIR/02-deployment.yaml" --ignore-not-found
    kubectl delete -f "$K8S_DIR/01-namespace.yaml" --ignore-not-found

    Write-ColorOutput "✅ Uninstallation complete" $colors.Success
    exit 0
}

Write-Header "Deploying $APP_NAME to Kubernetes"

# Build and push if requested
if ($Build) {
    Write-ColorOutput "Building Docker image..." $colors.Info

    if ($Push) {
        & .\build-and-push.ps1 -Push
    }
    else {
        & .\build-and-push.ps1
    }

    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "Build failed" $colors.Error
        exit 1
    }
    Write-Host ""
}

# Apply Kubernetes manifests
Write-ColorOutput "Applying Kubernetes manifests..." $colors.Header

Write-ColorOutput "  → Creating namespace..." $colors.Info
kubectl apply -f "$K8S_DIR/01-namespace.yaml"

Write-ColorOutput "  → Creating deployment..." $colors.Info
kubectl apply -f "$K8S_DIR/02-deployment.yaml"

Write-ColorOutput "  → Creating service..." $colors.Info
kubectl apply -f "$K8S_DIR/03-service.yaml"

Write-ColorOutput "  → Creating ingress..." $colors.Info
kubectl apply -f "$K8S_DIR/04-ingress.yaml"

Write-ColorOutput "✅ Manifests applied" $colors.Success

# Force rollout restart if we pushed new images (using :latest tag)
if ($Push) {
    Write-Host ""
    Write-ColorOutput "Forcing rollout restart to pull new image..." $colors.Info
    kubectl rollout restart deployment/$APP_NAME -n $NAMESPACE
    Write-ColorOutput "✅ Rollout restart triggered" $colors.Success
}

# Wait for rollout
Write-Host ""
Write-ColorOutput "Waiting for deployment rollout..." $colors.Info
kubectl rollout status deployment/$APP_NAME -n $NAMESPACE --timeout=120s

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "⚠️  Rollout did not complete successfully" $colors.Warning
}
else {
    Write-ColorOutput "✅ Rollout complete" $colors.Success
}

# Display status
Write-Header "Deployment Status"

Write-ColorOutput "Pods:" $colors.Info
kubectl get pods -n $NAMESPACE

Write-Host ""
Write-ColorOutput "Service:" $colors.Info
kubectl get svc -n $NAMESPACE

Write-Host ""
Write-ColorOutput "Ingress:" $colors.Info
kubectl get ingress -n $NAMESPACE

Write-Host ""
Write-ColorOutput "Certificate:" $colors.Info
kubectl get certificate -n $NAMESPACE

# Useful commands
Write-Header "Useful Commands"

Write-ColorOutput "View logs:" $colors.Info
Write-ColorOutput "  kubectl logs -n $NAMESPACE -l app=$APP_NAME -f" $colors.Success

Write-ColorOutput "`nRestart deployment:" $colors.Info
Write-ColorOutput "  kubectl rollout restart deployment/$APP_NAME -n $NAMESPACE" $colors.Success

Write-ColorOutput "`nUninstall:" $colors.Info
Write-ColorOutput "  .\deploy.ps1 -Uninstall" $colors.Success

Write-ColorOutput "`nAccess application:" $colors.Info
Write-ColorOutput "  https://cosmic.lab.hq.solidrust.net" $colors.Success

Write-Host ""
Write-ColorOutput "===========================================" $colors.Header
Write-Host ""

#endregion

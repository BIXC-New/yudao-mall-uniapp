param([string]$HBuilderPath = 'D:/HBuilderX', [ValidateSet('h5', 'mp-weixin')][string]$Platform = 'h5')
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$pluginRoot = Join-Path $HBuilderPath 'plugins'
$compilerRoot = Join-Path $pluginRoot 'uniapp-cli-vite'
$modules = Join-Path $compilerRoot 'node_modules'
foreach ($library in @('vite', '@dcloudio/vite-plugin-uni', '@dcloudio/uni-components', '@dcloudio/uni-h5', '@dcloudio/uni-app', '@dcloudio/uni-shared')) {
  $destination = Join-Path $projectRoot "node_modules/$library"
  $source = Join-Path $modules $library
  if (!(Test-Path -LiteralPath $destination)) { New-Item -ItemType Junction -Path $destination -Target $source | Out-Null }
}
$sassDestination = Join-Path $projectRoot 'node_modules/sass'
if (!(Test-Path -LiteralPath $sassDestination)) { New-Item -ItemType Junction -Path $sassDestination -Target (Join-Path $pluginRoot 'compile-dart-sass/node_modules/sass') | Out-Null }
$env:HX_APP_ROOT = $HBuilderPath
$env:UNI_HBUILDERX_PLUGINS = $pluginRoot
$env:RUN_BY_HBUILDERX = 'true'
$env:UNI_CLI_CONTEXT = $compilerRoot
$env:NODE_PATH = $modules
$env:UNI_INPUT_DIR = $projectRoot
$env:UNI_OUTPUT_DIR = Join-Path $projectRoot "unpackage/dist/build/$Platform"
$env:UNI_PLATFORM = $Platform
$env:NODE_ENV = 'production'
$manifestPath = Join-Path $projectRoot 'manifest.json'
$manifestBytes = [IO.File]::ReadAllBytes($manifestPath)
$manifestJson = [Text.Encoding]::UTF8.GetString($manifestBytes) | ConvertFrom-Json | ConvertTo-Json -Depth 100 -Compress
Push-Location $projectRoot
try {
  & (Join-Path $pluginRoot 'node/node.exe') (Join-Path $modules '@dcloudio/vite-plugin-uni/bin/uni.js') build -p $Platform --config vite.hbuilder.config.js
  if ($LASTEXITCODE -ne 0) { throw "$Platform build failed" }
  $entry = if ($Platform -eq 'mp-weixin') { 'app.json' } else { 'index.html' }
  if (!(Test-Path -LiteralPath (Join-Path $env:UNI_OUTPUT_DIR $entry))) { throw "Missing expected $Platform output: $entry" }
} finally {
  # ??????? manifest?????????????????
  $currentJson = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json | ConvertTo-Json -Depth 100 -Compress
  if ($currentJson -eq $manifestJson) { [IO.File]::WriteAllBytes($manifestPath, $manifestBytes) }
  Pop-Location
}

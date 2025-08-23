#! /usr/bin/pwsh

function Convert-Icons {
	[CmdletBinding()]
	param (
		[Alias('i')]
		[Parameter(Mandatory = $true)]
		[ValidateNotNullOrEmpty()]
		[string]$Icon,

		[Alias('m')]
		[Parameter()]
		[string]$MaskableIcon,

		[Alias('c')]
		[Parameter()]
		[string]$MonochromeIcon,

		[Alias('d')]
		[Parameter()]
		[ValidateNotNullOrEmpty()]
		[string]$Destination = $PWD,

		[Alias('s')]
		[Parameter()]
		[ValidateNotNullOrEmpty()]
		[string[]]$Sizes = @('64', '192', '512', '1024'),

		[Alias('f')]
		[Parameter()]
		[ValidateNotNullOrEmpty()]
		[string[]]$FaviconSizes = @('16', '32', '64', '256')
	)

	$Destination = Resolve-Path $Destination

	$Sizes |
	ForEach-Object {
		$Size = "${_}x${_}"

		magick -background 'none' "$Icon" -resize "$Size^" -gravity 'center' -extent "$Size" "$(Join-Path -Path $Destination -ChildPath "./icon-$Size.png")"
		oxipng -o max --strip all --interlace 1 --scale16 --filters '0-9' --fast --zopfli "$(Join-Path -Path $Destination -ChildPath "./icon-$Size.png")"

		if ($MaskableIcon) {
			magick -background 'none' "$MaskableIcon" -resize "$Size^" -gravity 'center' -extent "$Size" "$(Join-Path -Path $Destination -ChildPath "./icon-mask-$Size.png")"
			oxipng -o max --strip all --interlace 1 --scale16 --filters '0-9' --fast --zopfli "$(Join-Path -Path $Destination -ChildPath "./icon-mask-$Size.png")"
		}

		if ($MonochromeIcon) {
			magick -background 'none' "$MonochromeIcon" -resize "$Size^" -gravity 'center' -extent "$Size" "$(Join-Path -Path $Destination -ChildPath "./icon-mono-$Size.png")"
			oxipng -o max --strip all --interlace 1 --scale16 --filters '0-9' --fast --zopfli "$(Join-Path -Path $Destination -ChildPath "./icon-mono-$Size.png")"
		}
	}

	$PngFiles = $FaviconSizes |
	ForEach-Object {
		$Size = "${_}x${_}"

		magick -background 'none' "$Icon" -resize "$Size^" -gravity 'center' -extent "$Size" "$(Join-Path -Path $Env:Temp -ChildPath "./icon-$Size.png")"
		oxipng -o max --strip all --interlace 1 --scale16 --filters '0-9' --fast --zopfli "$(Join-Path -Path $Env:Temp -ChildPath "./icon-$Size.png")"

		"$(Join-Path -Path $Env:Temp -ChildPath "./icon-$Size.png")"
	}

	magick $PngFiles "$(Join-Path -Path $Destination -ChildPath './favicon.ico')"

	$PngFiles | Remove-Item -ErrorAction 'SilentlyContinue'
}

Convert-Icons -Icon "$PSScriptRoot/../src/assets/icons/icon.svg" -MaskableIcon "$PSScriptRoot/../src/assets/icons/icon-mask.svg" -MonochromeIcon "$PSScriptRoot/../src/assets/icons/icon-mono.svg" -Destination "$PSScriptRoot/../src/assets/icons/"

Get-ChildItem "$PSScriptRoot/../src/assets/icons/shortcuts" -Directory |
ForEach-Object {
	Convert-Icons -Icon "$_/icon.svg" -MaskableIcon "$_/icon-mask.svg" -MonochromeIcon "$_/icon-mono.svg" -Destination "$_"
}

Convert-Icons -Icon "$PSScriptRoot/../src/assets/icons/file/icon.svg" -Destination "$PSScriptRoot/../src/assets/icons/file" -Sizes @('1024', '512', '256', '96', '64', '48', '32', '24', '16') -FaviconSizes @('16', '24', '32', '48', '64', '96', '256')

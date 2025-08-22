#! /usr/bin/pwsh

function Convert-Icons {
	[CmdletBinding()]
	param (
		[Alias('i')]
		[Parameter(Mandatory = $true)]
		[ValidateNotNullOrEmpty()]
		[string]$Icon,

		[Alias('m')]
		[Parameter(Mandatory = $true)]
		[ValidateNotNullOrEmpty()]
		[string]$MaskableIcon,

		[Alias('c')]
		[Parameter(Mandatory = $true)]
		[ValidateNotNullOrEmpty()]
		[string]$MonochromeIcon,

		[Alias('d')]
		[Parameter()]
		[ValidateNotNullOrEmpty()]
		[string]$Destination = $PWD
	)

	$Destination = Resolve-Path $Destination

	@('64', '192', '512', '1024') |
	ForEach-Object {
		$Size = "${_}x${_}"

		magick -background 'none' "$Icon" -resize "$Size^" -gravity 'center' -extent "$Size" "$(Join-Path -Path $Destination -ChildPath "./icon-$Size.png")"
		oxipng -o max --strip all --interlace 1 --scale16 --filters '0-9' --fast --zopfli "$(Join-Path -Path $Destination -ChildPath "./icon-$Size.png")"

		magick -background 'none' "$MaskableIcon" -resize "$Size^" -gravity 'center' -extent "$Size" "$(Join-Path -Path $Destination -ChildPath "./icon-mask-$Size.png")"
		oxipng -o max --strip all --interlace 1 --scale16 --filters '0-9' --fast --zopfli "$(Join-Path -Path $Destination -ChildPath "./icon-mask-$Size.png")"

		magick -background 'none' "$MonochromeIcon" -resize "$Size^" -gravity 'center' -extent "$Size" "$(Join-Path -Path $Destination -ChildPath "./icon-mono-$Size.png")"
		oxipng -o max --strip all --interlace 1 --scale16 --filters '0-9' --fast --zopfli "$(Join-Path -Path $Destination -ChildPath "./icon-mono-$Size.png")"
	}

	$PngFiles = @('16', '32', '64', '256') |
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

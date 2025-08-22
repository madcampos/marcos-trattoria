#! /usr/bin/pwsh

function Convert-Images {
	[CmdletBinding()]
	param (
		[Alias('s')]
		[Parameter()]
		[ValidateNotNullOrEmpty()]
		[string]$Source = $PWD,

		[Alias('d')]
		[Parameter()]
		[ValidateNotNullOrEmpty()]
		[string]$Destination = "$PWD\optimized"
	)

	if (-not (Test-Path $Destination)) {
		New-Item -Path $Destination -ItemType 'Directory' | Out-Null
	}

	Get-ChildItem -Path "$Source\*.jpg" -Recurse -File |
	ForEach-Object {
		$Size = '720x720'

		magick "$($_.FullName)" -resize "$Size" -gravity 'center' -quality 65 "$Destination\$($_.BaseName).webp"
	}

	Get-ChildItem -Path "$Source\*.png" -Recurse -File |
	ForEach-Object {
		$Size = '720x720'

		magick "$($_.FullName)" -resize "$Size" -gravity 'center' -quality 75 "$Destination\$($_.BaseName).png"
		oxipng -o max --strip all --interlace 1 --scale16 --filters '0-9' --fast --zopfli "$Destination\*.png"
	}
}

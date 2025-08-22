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

		[Alias('o')]
		[Parameter()]
		[ValidateNotNullOrEmpty()]
		[string]$Output = $PWD
	)

	@('192', '512')
	| ForEach-Object {
		$Size = "${_}x${_}"

		magick -background 'none' "$Icon" -resize "$Size^" -gravity 'center' -extent "$Size" "$Output\icon-$Size.png"
		oxipng -o max --strip all --interlace 1 --scale16 --filters '0-9' --fast --zopfli "$Output\icon-$Size.png"

		magick -background 'none' "$MaskableIcon" -resize "$Size^" -gravity 'center' -extent "$Size" "$Output\icon-mask-$Size.png"
		oxipng -o max --strip all --interlace 1 --scale16 --filters '0-9' --fast --zopfli "$Output\icon-mask-$Size.png"

		magick -background 'none' "$MonochromeIcon" -resize "$Size^" -gravity 'center' -extent "$Size" "$Output\icon-mono-$Size.png"
		oxipng -o max --strip all --interlace 1 --scale16 --filters '0-9' --fast --zopfli "$Output\icon-mono-$Size.png"
	}

	$PngFiles = @('16', '32') |
	ForEach-Object {
		$Size = "${_}x${_}"

		magick -background 'none' "$Icon" -resize "$Size^" -gravity 'center' -extent "$Size" "$Env:Temp\icon-$Size.png"

		"$Temp\icon-$Size.png"
	}

	magick $PngFiles '.\favicon.ico'

	$PngFiles | Remove-Item -ErrorAction 'SilentlyContinue'
}

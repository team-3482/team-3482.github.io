#!/bin/bash

# Define source folder and subfolder
source_folder="/home/ocelot/GitKraken/website-media/CCC 2023 "
    subfolder="CCC_2023_LOW_RES"

# Create subfolder if it doesn't exist
mkdir -p "$source_folder/$subfolder"

# Iterate over each file in the source folder
for file in "$source_folder"/*; do
    # Check if the file is an image
    if [[ -f "$file" && $(file -b --mime-type "$file") == image/* ]]; then
        # Get filename and extension
        filename=$(basename -- "$file")
        extension="${filename##*.}"
        filename_no_ext="${filename%.*}"

        # Resize image to approximately 500KB
        convert "$file" -define jpeg:extent=500KB "$source_folder/$subfolder/$filename_no_ext"_resized."$extension"

        # Check if the resized image is indeed around 500KB
        actual_size=$(stat -c %s "$source_folder/$subfolder/$filename_no_ext"_resized."$extension")
        target_size=$((500 * 1024))  # 500KB in bytes
        # If the actual size is more than the target size, try reducing quality
        while [[ $actual_size -gt $target_size ]]; do
            convert "$file" -define jpeg:extent=500KB -quality 80 "$source_folder/$subfolder/$filename_no_ext"_resized."$extension"
            actual_size=$(stat -c %s "$source_folder/$subfolder/$filename_no_ext"_resized."$extension")
        done
    fi
done


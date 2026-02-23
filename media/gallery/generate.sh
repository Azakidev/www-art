#!/bin/bash

# Set variables
FULRES_DIR="fullres"
THUMBS_DIR="thumbs"
IMAGES_JSON="$(dirname "$0")/../../pages/_data/images.json"
SIZE=800
OUTFORMAT="png"

#Remove previous files
rm $IMAGES_JSON

if [ "$1" == "-r" ] || [ "$1" == "--regenerate" ]; then
  rm -r "$(dirname "$0")/$THUMBS_DIR"
fi

echo "Generating image thumbnails and data"
# Regenerate images.json
touch $IMAGES_JSON
echo "{ \"files\": [" >> $IMAGES_JSON

# Create thumbs directory if it doesn't exist
mkdir -p "$(dirname "$0")/$THUMBS_DIR"

# Loop through all image files in fulres directory
for FILE in $(dirname "$0")/$FULRES_DIR/*.png; do

  # Extract info from file
  ID=$(basename $FILE | sed 's/-.*\.png//')
  IMAGE_NAME=$(basename $FILE | sed 's/^[^-]*-\([^\.]*\)\.png/\1/')
  DATE=$(date -r "$FILE" +"%Y-%m-%d")
  TS=$(stat -c '%Y' $FILE)

  # Generate thumbnails if they don't exist
  if ! [ -f "$(dirname "$0")/$THUMBS_DIR/$ID-$IMAGE_NAME.$OUTFORMAT" ]; then
    if [ $OUTFORMAT == "avif" ]; then
      ffmpeg -hide_banner -loglevel error -i $FILE -vf "scale=$SIZE:$SIZE:force_original_aspect_ratio=decrease" -c:v librav1e -q:v 2 $(dirname "$0")/$THUMBS_DIR/$ID-$IMAGE_NAME.$OUTFORMAT
    else
      ffmpeg -hide_banner -loglevel error -i $FILE -vf "scale=$SIZE:$SIZE:force_original_aspect_ratio=decrease" -q:v 2 $(dirname "$0")/$THUMBS_DIR/$ID-$IMAGE_NAME.$OUTFORMAT
    fi
  fi

  # Add image info to images.json
  echo "{\"image\":\"$IMAGE_NAME\",\"fa_id\":\"$ID\",\"date\":\"$DATE\",\"ts\":\"$TS\"}," >> $IMAGES_JSON
done

# Remove trailing comma from images.json
sed -i '$ s/,$//' $IMAGES_JSON
# Close the json file
echo "] }" >> $IMAGES_JSON

echo "Done"

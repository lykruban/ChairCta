import os
from pathlib import Path
import shutil

def rename_images():
    # Get directory of this script
    folder_path = Path(__file__).parent
    
    # Counter for new filenames
    counter = 1
    
    # Get all image files
    image_files = []
    for ext in ['*.jpg', '*.png', '*.heic']:
        image_files.extend(list(folder_path.glob(ext)))
    
    # Sort files to ensure consistent ordering
    image_files.sort()
    
    # Rename and convert files
    for image_file in image_files:
        if counter <= 20:
            # Construct new filename
            new_name = f"{counter}.png"
            
            # Create full paths
            new_path = folder_path / new_name
            
            # Copy and rename file
            try:
                if image_file.suffix.lower() == '.heic':
                    print(f"Cannot convert HEIC files without PIL: {image_file.name}")
                    continue
                
                # For PNG/JPG files, just copy and rename
                shutil.copy2(image_file, new_path)
                
                # Remove original file after successful copy
                image_file.unlink()
                
                print(f"Renamed {image_file.name} to {new_name}")
                counter += 1
            except Exception as e:
                print(f"Error processing {image_file.name}: {e}")
        else:
            print("Maximum limit of 10 files reached")
            break

if __name__ == "__main__":
    rename_images()
